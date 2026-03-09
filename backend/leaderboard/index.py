"""
Таблица лидеров: топ игроков по всего собранному золоту.
GET /?action=top — топ-50 игроков
"""
import json
import os
import psycopg2

SCHEMA = os.environ.get('MAIN_DB_SCHEMA', 't_p29755359_epic_clicker_game')

CORS_HEADERS = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type, X-Auth-Token',
    'Content-Type': 'application/json',
}

def get_conn():
    return psycopg2.connect(os.environ['DATABASE_URL'])

def handler(event: dict, context) -> dict:
    if event.get('httpMethod') == 'OPTIONS':
        return {'statusCode': 200, 'headers': CORS_HEADERS, 'body': ''}

    conn = get_conn()
    cur = conn.cursor()
    cur.execute(f"""
        SELECT
            u.username,
            (gs.save_data->>'totalGold')::float AS total_gold,
            (gs.save_data->>'level')::int AS level,
            (gs.save_data->>'prestige')::int AS prestige,
            gs.saved_at
        FROM {SCHEMA}.game_saves gs
        JOIN {SCHEMA}.users u ON u.id = gs.user_id
        WHERE gs.save_data->>'totalGold' IS NOT NULL
        ORDER BY total_gold DESC
        LIMIT 50
    """)
    rows = cur.fetchall()
    conn.close()

    leaders = [
        {
            'rank': i + 1,
            'username': row[0],
            'totalGold': row[1] or 0,
            'level': row[2] or 1,
            'prestige': row[3] or 0,
        }
        for i, row in enumerate(rows)
    ]

    return {
        'statusCode': 200,
        'headers': CORS_HEADERS,
        'body': json.dumps({'leaders': leaders})
    }
