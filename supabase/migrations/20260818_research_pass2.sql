-- Second research pass. Only real, directly-verified-or-cited official
-- contacts. No platform signups this pass (Zoe wants direct-email pathways
-- prioritized). Scores/safety computed by hand from lib/safety.ts + lib/scoring.ts.

insert into sample_opportunities
  (brand, product, category, brand_tier, offer_type, official_website, contact_email,
   verification_status, safety_badge, safety_reasons, opportunity_score, status, source, notes)
values
  ('Khaite', 'Direct pitch to official press contact', 'clothing', 'premium', 'pr_sample',
   'https://khaite.com', 'press@khaite.com', 'verified', 'SAFE', '{"No risk signals found"}', 4.5,
   'ready_to_request', 'Official contact page (khaite.com/pages/contact-us), confirmed live 2026-08-18',
   'Verified 2026-08-18 via direct fetch of khaite.com contact page — "For Press Inquiries: press@khaite.com" quoted verbatim.'),

  ('Veronica Beard', 'Direct pitch to official press contact', 'clothing', 'premium', 'pr_sample',
   'https://veronicabeard.com', 'press@veronicabeard.com', 'verified', 'SAFE', '{"No risk signals found"}', 4.5,
   'ready_to_request', 'Official press page (veronicabeard.com/pages/press), confirmed live 2026-08-18',
   'Verified 2026-08-18 via direct fetch — "For Global Press Inquiries: press@veronicabeard.com" under "VB in the Press".'),

  ('Anine Bing', 'Direct pitch to official press contact', 'clothing', 'premium', 'pr_sample',
   'https://www.aninebing.com', 'press@aninebing.com', 'verified', 'SAFE', '{"No risk signals found"}', 4.5,
   'ready_to_request', 'Official contact page (aninebing.com/pages/contact), confirmed live 2026-08-18',
   'Verified 2026-08-18 via direct fetch — "FOR ALL PRESS INQUIRIES, EMAIL press@aninebing.com" quoted verbatim.'),

  ('Staud', 'Direct pitch to official contact (general, no dedicated press address found)', 'clothing', 'premium', 'pr_sample',
   'https://wearstaud.com', 'info@wearstaud.com', 'verified', 'SAFE', '{"No risk signals found","General contact, not a dedicated press address"}', 4.5,
   'ready_to_request', 'Official contact page (wearstaud.com/contact-us), confirmed live 2026-08-18',
   'Verified 2026-08-18 via direct fetch — general contact only (info@wearstaud.com), no separate press email found on the page.'),

  ('Ex Nihilo', 'Direct pitch to official press contact', 'fragrance', 'luxury', 'pr_sample',
   'https://www.ex-nihilo-paris.com', 'press@ex-nihilo-paris.com', 'in_progress', 'SAFE', '{"No risk signals found","Not independently confirmed via direct page fetch (site blocked automated fetch) — confirm before relying on it"}', 4.0,
   'ready_to_request', 'Found via web search citing official contact page us.ex-nihilo-paris.com/contact — direct fetch attempts failed (SSL/500 errors), not independently re-confirmed',
   'Search-engine-reported from the official contact page alongside contact@ and concierge@ addresses on the same domain (internally consistent), but I could not directly fetch the page myself to double-check — verify before use.'),

  ('Christian Louboutin', 'Direct pitch to official US press office', 'shoes', 'luxury', 'pr_sample',
   'https://us.christianlouboutin.com', 'pressofficeus@us.christianlouboutin.com', 'in_progress', 'SAFE', '{"No risk signals found","Not independently confirmed via direct page fetch (403 blocked) — confirm before relying on it"}', 4.0,
   'ready_to_request', 'Found via web search citing regional press office addresses on the official christianlouboutin.com domain — direct fetch blocked (403)',
   'Search results listed a full structured set of regional press office addresses (US/UK/China/etc.) on the brand''s own domain, which is a standard/expected pattern for a luxury house — but I could not directly fetch the page myself to confirm. Verify before use.'),

  ('Jimmy Choo', 'Direct pitch to official press office', 'shoes', 'luxury', 'pr_sample',
   'https://us.jimmychoo.com', 'pressinfo@jimmychoo.com', 'in_progress', 'SAFE', '{"No risk signals found","Not independently confirmed via direct page fetch (403 blocked) — confirm before relying on it"}', 4.0,
   'ready_to_request', 'Found via web search — direct fetch of the official page blocked (403), not independently re-confirmed',
   'Search-reported press office email on the jimmychoo.com domain. I could not directly fetch the page myself to confirm. Verify before use.');
