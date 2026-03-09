"""
Сохранение и загрузка прогресса игры для авторизованного пользователя.
action=save | load
"""
import json
import os
import hashlib
import hmac
import psycopg2

SCHEMA = os.environ.get('MAIN_DB_SCHEMA', 't_p29755359_epic_clicker_game')
SECRET_KEY = os.environ.get('SECRET_KEY', 'epic-clicker-secret-2024')

CORS_HEADERS = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type, X-Auth-Token, X-User-Id',
    'Content-Type': 'application/json',
}

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

def handler(event: dict, context) -> dict:
    if event.get('httpMethod') == 'OPTIONS':
        return {'statusCode': 200, 'headers': CORS_HEADERS, 'body': ''}

    token = (event.get('headers') or {}).get('X-Auth-Token') or (event.get('headers') or {}).get('x-auth-token', '')
    user_id = verify_token(token)
    if not user_id:
        return {'statusCode': 401, 'headers': CORS_HEADERS, 'body': json.dumps({'error': 'Не авторизован'})}

    body = {}
    if event.get('body'):
        body = json.loads(event['body'])

    action = body.get('action') or (event.get('queryStringParameters') or {}).get('action', '')

    conn = get_conn()
    cur = conn.cursor()

    if action == 'save':
        save_data = body.get('save_data')
        if save_data is None:
            conn.close()
            return {'statusCode': 400, 'headers': CORS_HEADERS, 'body': json.dumps({'error': 'Нет данных для сохранения'})}

        save_json = json.dumps(save_data)
        cur.execute(
            f"INSERT INTO {SCHEMA}.game_saves (user_id, save_data, saved_at) "
            f"VALUES ({user_id}, '{save_json.replace(chr(39), chr(39)*2)}', NOW()) "
            f"ON CONFLICT (user_id) DO UPDATE SET save_data = EXCLUDED.save_data, saved_at = NOW()"
        )
        conn.commit()
        conn.close()
        return {'statusCode': 200, 'headers': CORS_HEADERS, 'body': json.dumps({'ok': True})}

    if action == 'load':
        cur.execute(f"SELECT save_data, saved_at FROM {SCHEMA}.game_saves WHERE user_id = {user_id}")
        row = cur.fetchone()
        conn.close()
        if not row:
            return {'statusCode': 200, 'headers': CORS_HEADERS, 'body': json.dumps({'save_data': None})}
        return {'statusCode': 200, 'headers': CORS_HEADERS, 'body': json.dumps({'save_data': row[0], 'saved_at': str(row[1])})}

    conn.close()
    return {'statusCode': 400, 'headers': CORS_HEADERS, 'body': json.dumps({'error': 'Неизвестное действие'})}
