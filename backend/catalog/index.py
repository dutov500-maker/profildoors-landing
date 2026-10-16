import json
import os
import psycopg2
import psycopg2.extras

CORS = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Methods': 'GET, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type',
    'Access-Control-Max-Age': '86400',
}


def parse_finishes(raw: str) -> list:
    try:
        data = json.loads(raw or '[]')
    except ValueError:
        return []
    if not isinstance(data, list):
        return []
    return [f for f in data if isinstance(f, dict) and f.get('name')][:12]


def handler(event: dict, context) -> dict:
    """Публичная витрина: опубликованные модели и категории. ?section=main — основной каталог, ?section=orange — коллекция Orange."""
    if event.get('httpMethod') == 'OPTIONS':
        return {'statusCode': 200, 'headers': CORS, 'body': ''}
    if event.get('httpMethod') != 'GET':
        return {'statusCode': 405, 'headers': CORS, 'body': json.dumps({'error': 'Метод не поддерживается'})}

    section = (event.get('queryStringParameters') or {}).get('section', 'main')
    flag = 'in_orange' if section == 'orange' else 'in_main'

    schema = os.environ.get('MAIN_DB_SCHEMA', 'public')
    conn = psycopg2.connect(os.environ['DATABASE_URL'])
    cur = conn.cursor(cursor_factory=psycopg2.extras.RealDictCursor)
    cur.execute(f'SELECT id, slug, name, quiz_type FROM {schema}.categories ORDER BY sort_order, id')
    categories = cur.fetchall()
    cur.execute(
        f"SELECT p.id, p.name, p.series, p.badge, p.description, p.price, p.image_url, p.category_id, "
        f"p.finishes, p.finishes_label "
        f"FROM {schema}.products p WHERE p.status = 'published' AND p.{flag} = TRUE ORDER BY p.sort_order, p.id"
    )
    products = cur.fetchall()
    conn.close()

    for p in products:
        p['finishes'] = parse_finishes(p['finishes'])

    used = {p['category_id'] for p in products}
    categories = [c for c in categories if c['id'] in used]

    return {
        'statusCode': 200,
        'headers': {**CORS, 'Content-Type': 'application/json', 'Cache-Control': 'public, max-age=60'},
        'body': json.dumps({'categories': categories, 'products': products}, ensure_ascii=False),
    }
