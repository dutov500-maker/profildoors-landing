CREATE TABLE t_p43870329_profildoors_landing.categories (
  id SERIAL PRIMARY KEY,
  slug VARCHAR(60) NOT NULL UNIQUE,
  name VARCHAR(120) NOT NULL,
  quiz_type VARCHAR(20) NOT NULL DEFAULT 'interior',
  sort_order INTEGER NOT NULL DEFAULT 0,
  created_at TIMESTAMP NOT NULL DEFAULT NOW()
);

CREATE TABLE t_p43870329_profildoors_landing.products (
  id SERIAL PRIMARY KEY,
  category_id INTEGER REFERENCES t_p43870329_profildoors_landing.categories(id),
  name VARCHAR(160) NOT NULL,
  series VARCHAR(160) NOT NULL DEFAULT '',
  badge VARCHAR(60) NOT NULL DEFAULT '',
  description TEXT NOT NULL DEFAULT '',
  price INTEGER NOT NULL DEFAULT 0,
  image_url TEXT NOT NULL DEFAULT '',
  status VARCHAR(20) NOT NULL DEFAULT 'draft',
  sort_order INTEGER NOT NULL DEFAULT 0,
  created_at TIMESTAMP NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMP NOT NULL DEFAULT NOW()
);
CREATE INDEX products_status_idx ON t_p43870329_profildoors_landing.products(status, sort_order);

CREATE TABLE t_p43870329_profildoors_landing.admins (
  id SERIAL PRIMARY KEY,
  login VARCHAR(80) NOT NULL UNIQUE,
  password_hash VARCHAR(100) NOT NULL,
  created_at TIMESTAMP NOT NULL DEFAULT NOW()
);

CREATE TABLE t_p43870329_profildoors_landing.admin_sessions (
  id SERIAL PRIMARY KEY,
  admin_id INTEGER NOT NULL REFERENCES t_p43870329_profildoors_landing.admins(id),
  token_hash CHAR(64) NOT NULL UNIQUE,
  expires_at TIMESTAMP NOT NULL,
  created_at TIMESTAMP NOT NULL DEFAULT NOW()
);

CREATE TABLE t_p43870329_profildoors_landing.login_attempts (
  id SERIAL PRIMARY KEY,
  ip VARCHAR(64) NOT NULL,
  login VARCHAR(80) NOT NULL DEFAULT '',
  success BOOLEAN NOT NULL DEFAULT FALSE,
  created_at TIMESTAMP NOT NULL DEFAULT NOW()
);
CREATE INDEX login_attempts_ip_idx ON t_p43870329_profildoors_landing.login_attempts(ip, created_at);

INSERT INTO t_p43870329_profildoors_landing.categories (slug, name, quiz_type, sort_order) VALUES
  ('invisible', 'Invisible', 'invisible', 10),
  ('veneer', 'Шпон', 'interior', 20),
  ('enamel', 'Эмаль', 'interior', 30),
  ('partitions', 'Перегородки', 'glass', 40),
  ('entry', 'Входные', 'entry', 50);

INSERT INTO t_p43870329_profildoors_landing.products (category_id, name, series, badge, description, price, image_url, status, sort_order)
SELECT c.id, v.name, v.series, v.badge, v.description, v.price, v.image_url, 'published', v.sort_order
FROM (VALUES
  ('veneer', 'Натуральный шпон', 'Серии VE · VA · VT', 'Премиум', 'Сложные текстуры Duna и Albero, руст 5 мм, диагональное и радиальное направление волокон.', 48500, '/img/door-veneer.webp', 10),
  ('enamel', 'Шелковистая эмаль', 'Серии SE · SA', 'Хит Roomer', 'Многослойная эмаль с бархатистой поверхностью, кромка в цвет полотна, колеровка RAL/NCS.', 32700, '/img/door-white.webp', 20),
  ('invisible', 'Скрытый алюминиевый короб', 'Короб INVISIBLE ALU', 'Скрытый монтаж', 'Анодированный короб под отделку стены, скрытые петли и магнитный замок. Высота полотна до 4 000 мм.', 26900, '/img/showroom-invisible.webp', 30),
  ('partitions', 'Беспороговые раздвижные перегородки', 'Серия AG', 'Экспозиция в Roomer', 'Перегородки в потолок без порога, профиль Black Matte, скрытые доводчики.', 68000, '/img/showroom-glass.webp', 40)
) AS v(slug, name, series, badge, description, price, image_url, sort_order)
JOIN t_p43870329_profildoors_landing.categories c ON c.slug = v.slug;