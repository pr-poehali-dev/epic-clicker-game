"""
Аутентификация пользователей: регистрация, вход, проверка токена. v2
action=register | login | me
"""
import json
import os
import hashlib
import hmac
import secrets
import psycopg2

SCHEMA = os.environ.get('MAIN_DB_SCHEMA', 't_p29755359_epic_clicker_game')
SECRET_KEY = os.environ.get('SECRET_KEY', 'epic-clicker-secret-2024')

CORS_HEADERS = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type, X-Auth-Token, X-User-Id',
    'Content-Type': 'application/json',
}

def hash_password(password: str) -> str:
    salt = secrets.token_hex(16)
    hashed = hashlib.pbkdf2_hmac('sha256', password.encode(), salt.encode(), 100000)
    return f"{salt}:{hashed.hex()}"

def verify_password(password: str, stored_hash: str) -> bool:
    parts = stored_hash.split(':')
    if len(parts) != 2:
        return False
    salt, hashed = parts
    new_hash = hashlib.pbkdf2_hmac('sha256', password.encode(), salt.encode(), 100000)
    return hmac.compare_digest(hashed, new_hash.hex())

def generate_token(user_id: int) -> str:
    import base64
    rand = secrets.token_hex(32)
    payload = f"{user_id}:{rand}"
    sig = hmac.new(SECRET_KEY.encode(), payload.encode(), hashlib.sha256).hexdigest()
    token_data = f"{payload}:{sig}"
    return base64.b64encode(token_data.encode()).decode()

def verify_token(token: str):
    try:
        import base64
        decoded = base64.b64decode(token.encode()).decode()
        parts = decoded.split(':')
        if len(parts) != 3:
            return None
        user_id_str, rand, sig = parts
        payload = f"{user_id_str}:{rand}"
        expected_sig = hmac.new(SECRET_KEY.encode(), payload.encode(), hashlib.sha256).hexdigest()
        if not hmac.compare_digest(sig, expected_sig):
            return None
        return int(user_id_str)
    except Exception:
        return None

def get_conn():
    return psycopg2.connect(os.environ['DATABASE_URL'])

def escape_str(s: str) -> str:
    return s.replace("'", "''")

def handler(event: dict, context) -> dict:
    if event.get('httpMethod') == 'OPTIONS':
        return {'statusCode': 200, 'headers': CORS_HEADERS, 'body': ''}

    body = {}
    if event.get('body'):
        body = json.loads(event['body'])

    action = body.get('action') or (event.get('queryStringParameters') or {}).get('action', '')

    if action == 'register':
        username = (body.get('username') or '').strip()
        email = (body.get('email') or '').strip().lower()
        password = body.get('password') or ''

        if not username or not email or not password:
            return {'statusCode': 400, 'headers': CORS_HEADERS, 'body': json.dumps({'error': 'Заполните все поля'})}
        if len(username) < 3:
            return {'statusCode': 400, 'headers': CORS_HEADERS, 'body': json.dumps({'error': 'Имя минимум 3 символа'})}
        if len(password) < 6:
            return {'statusCode': 400, 'headers': CORS_HEADERS, 'body': json.dumps({'error': 'Пароль минимум 6 символов'})}

        conn = get_conn()
        cur = conn.cursor()
        cur.execute(f"SELECT id FROM {SCHEMA}.users WHERE email = '{escape_str(email)}' OR username = '{escape_str(username)}'")
        if cur.fetchone():
            conn.close()
            return {'statusCode': 409, 'headers': CORS_HEADERS, 'body': json.dumps({'error': 'Пользователь с таким именем или email уже существует'})}

        pw_hash = hash_password(password)
        cur.execute(
            f"INSERT INTO {SCHEMA}.users (username, email, password_hash) VALUES ('{escape_str(username)}', '{escape_str(email)}', '{pw_hash}') RETURNING id, username, email"
        )
        row = cur.fetchone()
        conn.commit()
        conn.close()

        token = generate_token(row[0])
        return {
            'statusCode': 201,
            'headers': CORS_HEADERS,
            'body': json.dumps({'token': token, 'user': {'id': row[0], 'username': row[1], 'email': row[2]}})
        }

    if action == 'login':
        email = (body.get('email') or '').strip().lower()
        password = body.get('password') or ''

        if not email or not password:
            return {'statusCode': 400, 'headers': CORS_HEADERS, 'body': json.dumps({'error': 'Заполните все поля'})}

        conn = get_conn()
        cur = conn.cursor()
        cur.execute(f"SELECT id, username, email, password_hash FROM {SCHEMA}.users WHERE email = '{escape_str(email)}'")
        row = cur.fetchone()

        if not row or not verify_password(password, row[3]):
            conn.close()
            return {'statusCode': 401, 'headers': CORS_HEADERS, 'body': json.dumps({'error': 'Неверный email или пароль'})}

        cur.execute(f"UPDATE {SCHEMA}.users SET last_login = NOW() WHERE id = {row[0]}")
        conn.commit()
        conn.close()

        token = generate_token(row[0])
        return {
            'statusCode': 200,
            'headers': CORS_HEADERS,
            'body': json.dumps({'token': token, 'user': {'id': row[0], 'username': row[1], 'email': row[2]}})
        }

    if action == 'me':
        token = event.get('headers', {}).get('X-Auth-Token') or event.get('headers', {}).get('x-auth-token', '')
        user_id = verify_token(token)
        if not user_id:
            return {'statusCode': 401, 'headers': CORS_HEADERS, 'body': json.dumps({'error': 'Не авторизован'})}

        conn = get_conn()
        cur = conn.cursor()
        cur.execute(f"SELECT id, username, email FROM {SCHEMA}.users WHERE id = {user_id}")
        row = cur.fetchone()
        conn.close()

        if not row:
            return {'statusCode': 404, 'headers': CORS_HEADERS, 'body': json.dumps({'error': 'Пользователь не найден'})}

        return {
            'statusCode': 200,
            'headers': CORS_HEADERS,
            'body': json.dumps({'user': {'id': row[0], 'username': row[1], 'email': row[2]}})
        }

    return {'statusCode': 400, 'headers': CORS_HEADERS, 'body': json.dumps({'error': 'Неизвестное действие'})}