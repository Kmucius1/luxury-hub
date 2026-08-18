-- Draft-only requests for every ready_to_request opportunity (Zoe asked to
-- "complete all applications" — this stages every request for her review
-- and manual send/signup; nothing is auto-sent or auto-submitted anywhere).

-- Email pitch opportunities: real verified contact, generic pitch template
-- per spec §11 with [specific product/launch] and [why this fits] left as
-- explicit brackets for Zoe to personalize before sending — never fabricated.

insert into sample_requests (opportunity_id, priority, contact_email, method, subject, message, status)
select id, 'high', 'collaborate@amouage.com', 'email',
  'PR / Creator Sample Consideration — Zoe Taylor | @Zoettaylor14 (re: Amouage)',
  E'Hi,\n\nI''m Zoe Taylor, @lifeaszoetaylor on Instagram and @Zoettaylor14 on TikTok.\n\nI came across [specific product/launch] from Amouage and would love to be considered for sampling, gifting, or your creator PR list.\n\nI create lifestyle-focused content with a strong interest in fragrance, and [why this specific product fits my content].\n\nIf you are currently offering creator samples or PR gifting for this launch, I''d love to be considered.\n\nI''m happy to send over my creator profile or social links if helpful.\n\nThank you,\nZoe',
  'draft'
from sample_opportunities where id = 'c98e1267-8906-46a6-84d2-a8b71c930478';

insert into sample_requests (opportunity_id, priority, contact_email, method, subject, message, status)
select id, 'medium', 'pr@oribe.com', 'email',
  'PR / Creator Sample Consideration — Zoe Taylor | @Zoettaylor14 (re: Oribe)',
  E'Hi,\n\nI''m Zoe Taylor, @lifeaszoetaylor on Instagram and @Zoettaylor14 on TikTok.\n\nI came across [specific product/launch] from Oribe and would love to be considered for sampling, gifting, or your creator PR list.\n\nI create lifestyle-focused content with a strong interest in beauty, and [why this specific product fits my content].\n\nIf you are currently offering creator samples or PR gifting for this launch, I''d love to be considered.\n\nI''m happy to send over my creator profile or social links if helpful.\n\nThank you,\nZoe',
  'draft'
from sample_opportunities where id = '4a35d9c3-b02d-401f-8c7a-2726d3118129';

insert into sample_requests (opportunity_id, priority, contact_email, method, subject, message, status)
select id, 'medium', 'press@rails.com', 'email',
  'PR / Creator Sample Consideration — Zoe Taylor | @Zoettaylor14 (re: Rails)',
  E'Hi,\n\nI''m Zoe Taylor, @lifeaszoetaylor on Instagram and @Zoettaylor14 on TikTok.\n\nI came across [specific product/launch] from Rails and would love to be considered for sampling, gifting, or your creator PR list.\n\nI create lifestyle-focused content with a strong interest in clothing, and [why this specific product fits my content].\n\nIf you are currently offering creator samples or PR gifting for this launch, I''d love to be considered.\n\nI''m happy to send over my creator profile or social links if helpful.\n\nThank you,\nZoe',
  'draft'
from sample_opportunities where id = '546d7d94-01cb-47ec-b38f-62d29ef0f490';

insert into sample_requests (opportunity_id, priority, contact_email, method, subject, message, status)
select id, 'medium', 'press@goldengoose.com', 'email',
  'PR / Creator Sample Consideration — Zoe Taylor | @Zoettaylor14 (re: Golden Goose)',
  E'Hi,\n\nI''m Zoe Taylor, @lifeaszoetaylor on Instagram and @Zoettaylor14 on TikTok.\n\nI came across [specific product/launch] from Golden Goose and would love to be considered for sampling, gifting, or your creator PR list.\n\nI create lifestyle-focused content with a strong interest in shoes, and [why this specific product fits my content].\n\nIf you are currently offering creator samples or PR gifting for this launch, I''d love to be considered.\n\nI''m happy to send over my creator profile or social links if helpful.\n\nThank you,\nZoe',
  'draft'
from sample_opportunities where id = 'e444f705-8e5d-4117-9703-fc9dfcc06e35';

insert into sample_requests (opportunity_id, priority, contact_email, method, subject, message, status)
select id, 'high', 'Influencer@charlottetilbury.com', 'email',
  'PR / Creator Sample Consideration — Zoe Taylor | @Zoettaylor14 (re: Charlotte Tilbury)',
  E'Hi,\n\nI''m Zoe Taylor, @lifeaszoetaylor on Instagram and @Zoettaylor14 on TikTok.\n\nI came across [specific product/launch] from Charlotte Tilbury and would love to be considered for sampling, gifting, or your creator PR list.\n\nI create lifestyle-focused content with a strong interest in beauty, and [why this specific product fits my content].\n\nIf you are currently offering creator samples or PR gifting for this launch, I''d love to be considered.\n\nI''m happy to send over my creator profile or social links if helpful.\n\nThank you,\nZoe',
  'draft'
from sample_opportunities where id = 'cef71544-ac44-4c48-8478-b9e5f930eef3';

insert into sample_requests (opportunity_id, priority, contact_email, method, subject, message, status)
select id, 'medium', 'contact@westman-atelier.com', 'email',
  'PR / Creator Sample Consideration — Zoe Taylor | @Zoettaylor14 (re: Westman Atelier)',
  E'Hi,\n\nI''m Zoe Taylor, @lifeaszoetaylor on Instagram and @Zoettaylor14 on TikTok.\n\nI came across [specific product/launch] from Westman Atelier and would love to be considered for sampling, gifting, or your creator PR list.\n\nI create lifestyle-focused content with a strong interest in beauty, and [why this specific product fits my content].\n\nIf you are currently offering creator samples or PR gifting for this launch, I''d love to be considered.\n\nI''m happy to send over my creator profile or social links if helpful.\n\nThank you,\nZoe',
  'draft'
from sample_opportunities where id = 'a37681e0-e7dd-471f-9dbd-bffdf334338d';

-- Platform signups: no email to send — these need Zoe to create a free
-- creator account herself (account creation is never done on her behalf).
-- method='application' with a plain instructional note instead of a pitch.

insert into sample_requests (opportunity_id, priority, method, subject, message, status)
select id, 'high', 'application', 'ShopMy creator account setup',
  E'No email needed — this is a platform signup.\n\n1. Create a free creator account at https://shopmy.us/home/creators\n2. Complete your profile: name Zoe Taylor, @lifeaszoetaylor (Instagram), @Zoettaylor14 (TikTok), categories fashion/beauty/fragrance/home\n3. Browse and apply to open brand gifting campaigns as they appear — availability varies, nothing is guaranteed.\n\n(Same account covers both the fashion and shoes campaign categories.)',
  'draft'
from sample_opportunities where id = '013a575f-14ec-40f4-92dd-b24396f734d2';

insert into sample_requests (opportunity_id, priority, method, subject, message, status)
select id, 'medium', 'application', 'Fohr (FohrGifted) creator account setup',
  E'No email needed — this is a platform signup.\n\n1. Create a free creator account at https://www.fohrgifted.com\n2. Complete your profile: name Zoe Taylor, @lifeaszoetaylor (Instagram), @Zoettaylor14 (TikTok), categories beauty/fragrance\n3. Fohr explicitly states posting is NOT required to receive gifted product — browse open campaigns once your profile is live.',
  'draft'
from sample_opportunities where id = 'e66f3612-840d-4a4d-a1c9-19c1eae81b50';

insert into sample_requests (opportunity_id, priority, method, subject, message, status)
select id, 'high', 'application', 'LTK creator account setup',
  E'No email needed — this is a platform signup.\n\n1. Create a free creator account at https://company.shopltk.com/en/creator\n2. Complete your profile: name Zoe Taylor, @lifeaszoetaylor (Instagram), @Zoettaylor14 (TikTok), categories fashion/beauty\n3. LTK Connect gifting is explicitly no-obligation — browse open brand gifts once your profile is live.\n\n(Same account covers both the fashion and footwear campaign categories.)',
  'draft'
from sample_opportunities where id = '7a8a0742-f2d8-4386-bddf-5fa9ca04566b';

insert into sample_requests (opportunity_id, priority, method, subject, message, status)
select id, 'medium', 'application', 'ShopMy — already have an account from the fashion opportunity',
  E'Same platform/account as the ShopMy fashion opportunity above — no separate signup needed. Just browse shoes/footwear campaigns once your profile is live.',
  'draft'
from sample_opportunities where id = 'f161c687-1f04-4738-b88c-53340e47a16b';

insert into sample_requests (opportunity_id, priority, method, subject, message, status)
select id, 'medium', 'application', 'LTK — already have an account from the fashion opportunity',
  E'Same platform/account as the LTK fashion opportunity above — no separate signup needed. Just browse footwear campaigns once your profile is live.',
  'draft'
from sample_opportunities where id = 'a03d3c83-eb17-4afa-8c20-2bb2edf721b8';
