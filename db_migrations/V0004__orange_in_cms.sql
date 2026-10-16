ALTER TABLE t_p43870329_profildoors_landing.products ADD COLUMN in_main BOOLEAN NOT NULL DEFAULT TRUE;
ALTER TABLE t_p43870329_profildoors_landing.products ADD COLUMN in_orange BOOLEAN NOT NULL DEFAULT FALSE;
ALTER TABLE t_p43870329_profildoors_landing.products ADD COLUMN finishes TEXT NOT NULL DEFAULT '[]';
ALTER TABLE t_p43870329_profildoors_landing.products ADD COLUMN finishes_label VARCHAR(40) NOT NULL DEFAULT 'Отделки';

INSERT INTO t_p43870329_profildoors_landing.categories (slug, name, quiz_type, sort_order) VALUES
  ('orange-design', 'Дизайнерские & Эмаль', 'interior', 60),
  ('orange-relief', 'Фактурные & Рельеф', 'interior', 70),
  ('orange-classic', 'Классика', 'interior', 80),
  ('orange-glass', 'Стекло & Алюминий', 'glass', 90)
ON CONFLICT (slug) DO NOTHING;

INSERT INTO t_p43870329_profildoors_landing.products
  (category_id, name, series, badge, description, price, image_url, status, sort_order, in_main, in_orange, finishes, finishes_label)
SELECT c.id, v.name, v.series, v.badge, v.description, v.price, v.image_url, 'published', v.sort_order, FALSE, TRUE, v.finishes, v.flabel
FROM (VALUES
  ('orange-design', 'ProfilDoors Серия «Графика»', 'Модель с радиусной фрезеровкой', 'Новинка 2026',
   'Премиальная матовая эмаль с объёмной радиусной 3D-гравировкой. Чёрная матовая фурнитура, скрытые петли.',
   24500, '/img/orange-design-3.webp', 110,
   '[{"name":"Вайт","color":"#F4F3EF"},{"name":"Кашемир","color":"#D6C8B4"},{"name":"Тёплый шёлк","color":"#E8DFD0"},{"name":"Графит","color":"#3E3F41"}]', 'Отделки'),
  ('orange-design', 'ProfilDoors Серия «Вертикаль»', 'Светлое полотно у стеллажа', 'Хит продаж',
   'Каркасно-щитовое полотно с вертикальной линейной фрезеровкой. Идеально для современных минималистичных интерьеров.',
   22900, '/img/orange-design-9.webp', 120,
   '[{"name":"Вайт","color":"#F4F3EF"},{"name":"Капучино","color":"#CDBBA5"},{"name":"Агат","color":"#8E8A85"}]', 'Отделки'),
  ('orange-relief', 'ProfilDoors Серия «Рельеф / Вельвет»', 'Тёмная реечная дверь', 'Трендовая рейка',
   'Объёмный вертикальный реечный фасад в глубоком оттенке Dark Oak. Высокая устойчивость к механическим повреждениям.',
   26800, '/img/orange-design-4.webp', 130,
   '[{"name":"Венге","color":"#2F2520"},{"name":"Тёмный орех","color":"#4A3226"},{"name":"Мокко","color":"#6E5646"},{"name":"Графит","color":"#3E3F41"}]', 'Отделки'),
  ('orange-classic', 'ProfilDoors Классика', 'Серия P.O / PM', 'Неоклассика',
   'Элегантные пропорции, объёмный классический багет, шелковистая матовая эмаль.',
   19800, '/img/orange-design-6.webp', 140,
   '[{"name":"Вайт","color":"#F4F3EF"},{"name":"Крем","color":"#EDE3CF"},{"name":"Жемчуг","color":"#E2DDD4"}]', 'Отделки'),
  ('orange-glass', 'ProfilDoors Серия AV.O', 'Двустворчатая стеклянная система', 'Архитектурный стиль',
   'Распашная конструкция из закалённого триплекса в узком алюминиевом профиле Black Muar. Зонирование гостиных и холлов.',
   68000, '/img/orange-design-15.webp', 150,
   '[{"name":"Чёрный муар","color":"#232325"},{"name":"Шампань","color":"#CDB58C"},{"name":"Никель","color":"#B9BCC0"}]', 'Профиль')
) AS v(slug, name, series, badge, description, price, image_url, sort_order, finishes, flabel)
JOIN t_p43870329_profildoors_landing.categories c ON c.slug = v.slug;