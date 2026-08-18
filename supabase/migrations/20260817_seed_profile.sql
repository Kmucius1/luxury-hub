-- Seed Zoe's creator profile. Only real, known facts — no fabricated
-- follower counts or engagement metrics (spec §35). Add those later from
-- Settings once real numbers are available.

insert into creator_profile (
  name, creator_handle, email, instagram_handle, tiktok_handle,
  location, categories
)
select
  'Zoe Taylor',
  'Zoettaylor14',
  'Zoettaylor14@gmail.com',
  'lifeaszoetaylor',
  'Zoettaylor14',
  'Tampa Bay, Florida',
  array['fragrance', 'fashion', 'beauty', 'home', 'accessories', 'lifestyle']
where not exists (select 1 from creator_profile);
