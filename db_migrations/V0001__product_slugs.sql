ALTER TABLE t_p43870329_profildoors_landing.products ADD COLUMN slug VARCHAR(180) NOT NULL DEFAULT '';
UPDATE t_p43870329_profildoors_landing.products SET slug = 'naturalnyj-shpon' WHERE id = 1;
UPDATE t_p43870329_profildoors_landing.products SET slug = 'skrytyj-alyuminievyj-korob' WHERE id = 3;
UPDATE t_p43870329_profildoors_landing.products SET slug = 'besporogovye-razdvizhnye-peregorodki' WHERE id = 4;
UPDATE t_p43870329_profildoors_landing.products SET slug = '1ge' WHERE id = 13;
UPDATE t_p43870329_profildoors_landing.products SET slug = 'model-' || id WHERE slug = '';
CREATE UNIQUE INDEX products_slug_uniq ON t_p43870329_profildoors_landing.products (slug);