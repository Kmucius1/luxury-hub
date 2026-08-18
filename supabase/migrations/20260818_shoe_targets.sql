-- Dedicated luxury shoe gifting support + target brands.
-- Safe to run after 20260818_clothing_shoes.sql.

alter table sample_opportunities drop constraint if exists sample_opportunities_offer_type_check;
alter table sample_opportunities add constraint sample_opportunities_offer_type_check
  check (offer_type in (
    'official_free_sample', 'pr_sample', 'pr_mailer', 'creator_gifting',
    'product_seeding', 'no_obligation_gifting', 'launch_mailer', 'press_sample',
    'creator_sample', 'review_sample', 'event_gift', 'luxury_gift',
    'full_size_product', 'miniature', 'discovery_sample', 'fragrance_vial',
    'clothing_gift', 'shoe_gift', 'home_product_gift'
  ));

insert into luxury_brands (name, category, luxury_tier, website, relationship_stage)
select * from (values
  ('Christian Louboutin', 'shoes', 'luxury', 'https://us.christianlouboutin.com', 'target'),
  ('Jimmy Choo', 'shoes', 'luxury', 'https://www.jimmychoo.com', 'target'),
  ('Manolo Blahnik', 'shoes', 'luxury', 'https://www.manoloblahnik.com', 'target'),
  ('Valentino Garavani', 'shoes', 'luxury', 'https://www.valentino.com', 'target'),
  ('Gianvito Rossi', 'shoes', 'luxury', 'https://www.gianvitorossi.com', 'target'),
  ('Aquazzura', 'shoes', 'luxury', 'https://www.aquazzura.com', 'target'),
  ('Amina Muaddi', 'shoes', 'luxury', 'https://www.aminamuaddi.com', 'target'),
  ('Golden Goose', 'shoes', 'premium', 'https://www.goldengoose.com', 'target'),
  ('Stuart Weitzman', 'shoes', 'premium', 'https://www.stuartweitzman.com', 'target'),
  ('Schutz', 'shoes', 'premium', 'https://schutz-shoes.com', 'target'),
  ('Tory Burch', 'shoes', 'premium', 'https://www.toryburch.com', 'target'),
  ('Coach', 'shoes', 'premium', 'https://www.coach.com', 'target'),
  ('Reformation', 'clothing', 'premium', 'https://www.thereformation.com', 'target'),
  ('Aritzia', 'clothing', 'premium', 'https://www.aritzia.com', 'target'),
  ('Retrofête', 'clothing', 'premium', 'https://retrofete.com', 'target'),
  ('Staud', 'clothing', 'premium', 'https://staud.clothing', 'target'),
  ('Alice + Olivia', 'clothing', 'premium', 'https://www.aliceandolivia.com', 'target'),
  ('Veronica Beard', 'clothing', 'premium', 'https://veronicabeard.com', 'target'),
  ('Rag & Bone', 'clothing', 'premium', 'https://www.rag-bone.com', 'target'),
  ('Good American', 'clothing', 'premium', 'https://www.goodamerican.com', 'target')
) as v(name, category, luxury_tier, website, relationship_stage)
where not exists (
  select 1 from luxury_brands b where lower(b.name) = lower(v.name)
);
