-- Real, individually web-verified pathways to free luxury PR/creator gifting
-- (researched 2026-08-18). Every row traces to a live official source cited
-- in `notes`. Nothing here is guessed — see [[feedback_no_fabricated_business_data]].
-- safety_badge/opportunity_score computed by hand using lib/safety.ts and
-- lib/scoring.ts logic so stored values match what the app itself computes.

-- ── PR agencies (real, verified via their own official sites / press coverage) ──
insert into pr_agencies (name, website, city, submission_process, relationship_stage, notes) values
('Karla Otto', 'https://www.karlaotto.com', 'Milan / Paris / London / New York / LA / Hong Kong / Shanghai / Dubai',
 'General contact form at karlaotto.com/contacts', 'target',
 'Full-service luxury brand-building agency (est. 1982). Publicly named clients include Simone Rocha, Rimowa, Berluti. Verified 2026-08-18 via karlaotto.com.'),
('Kaplow', 'https://www.kaplow.com', 'New York',
 'Contact form via kaplow.com "Get Started"', 'target',
 '30+ year NYC beauty/lifestyle/health PR firm. Publicly named beauty clients: Ralph Lauren Fragrances, Kiehl''s, Laura Mercier, Shiseido. Beauty PR agency of record for CEW 25+ years. Verified 2026-08-18 via kaplow.com/beauty.'),
('Purple PR', 'https://purplepr.com', 'London / New York / Los Angeles',
 'Via purplepr.com/work-with-us', 'target',
 'Luxury/fashion communications agency. Publicly named clients include Maison Francis Kurkdjian (already in your luxury_brands list), ILIA Cosmetics, Kevyn Aucoin, NOBLE PANACEA. Verified 2026-08-18 via purplepr.com and search coverage.'),
('5WPR', 'https://www.5wpr.com', 'New York',
 'Phone 212.999.5585 Mon-Fri 9-5 ET, or 5wpr.com/contactus — new business inquiries reviewed within 24 hours per their site', 'target',
 'Top-10 independent full-service PR agency; site explicitly states specialization in "bespoke fragrance sampling campaigns." Verified 2026-08-18 via 5wpr.com.'),
('BPCM', 'https://www.bpcm.com', 'New York / Los Angeles / London',
 'Email format {first}@bpcm.com per public sourcing; use general site contact to confirm', 'target',
 'Global luxury lifestyle/fashion/beauty communications agency (est. 1999). Publicly named clients include Hermès Beauty & Fragrance, Milk Makeup, Dom Pérignon, Kering. Verified 2026-08-18.'),
('POSH PR', 'https://poshpr.com', 'National (US)',
 'Direct email heydoll@poshpr.com or call/text 804-939-7674', 'target',
 'Boutique fashion/beauty/lifestyle PR + luxury event agency. Direct contact email publicly listed on poshpr.com/contact. Verified 2026-08-18.');

-- ── Sample opportunities (real, verified pathways — not guaranteed offers) ──

-- 1. ShopMy — real creator commerce/gifting platform (VC-backed, $1.5B valuation per public coverage)
insert into sample_opportunities (
  brand, product, category, brand_tier, offer_type, source, official_website, application_link,
  date_found, requirements, posting_required, shipping_responsibility,
  card_required, payment_required, purchase_required, brand_verified,
  verification_status, safety_badge, safety_reasons, opportunity_score, status, notes
) values (
  'ShopMy', 'Creator application — brand gifting via ShopMy platform', 'fashion', 'premium',
  'creator_gifting', 'platform', 'https://shopmy.us', 'https://shopmy.us/home/creators',
  current_date, 'Free creator application ("mutual fit" curated review, not guaranteed acceptance). No fee.', false, 'brand_covers',
  false, false, false, true,
  'verified', 'SAFE', array['No risk signals found'], 7.0, 'ready_to_request',
  'Real platform verified 2026-08-18 (shopmy.us/home/creators). Free for creators — no monthly fee. Listed luxury/fashion brands on the platform include Prada, Gucci, Khaite, Toteme, Anine Bing. "Gifting & Affiliates" is an explicit brand-side feature. Specific brand gifting campaigns vary and are not guaranteed by applying — apply, then watch for individual brand invites.'
);

-- 2. FohrGifted — Fohr's dedicated luxury beauty creator gifting network
insert into sample_opportunities (
  brand, product, category, brand_tier, offer_type, source, official_website, application_link,
  date_found, requirements, posting_required, shipping_responsibility,
  card_required, payment_required, purchase_required, brand_verified,
  verification_status, safety_badge, safety_reasons, opportunity_score, status, notes
) values (
  'FohrGifted (Fohr)', 'Creator application — luxury beauty brand gifting network', 'beauty', 'premium',
  'no_obligation_gifting', 'platform', 'https://www.fohrgifted.com', 'https://www.fohrgifted.com',
  current_date, 'Public Instagram/TikTok Business or Creator account with existing beauty-relevant content. Free to apply.', false, 'brand_covers',
  false, false, false, true,
  'verified', 'SAFE', array['No risk signals found'], 7.0, 'ready_to_request',
  'Real, free application verified 2026-08-18 (fohrgifted.com). Page explicitly states posting is NOT required to receive product ("no posting obligations" model): selected creators get gifted from Fohr''s luxury beauty client list; posting is encouraged but optional. Joining makes you eligible for selection, not an automatic guaranteed sample.'
);

-- 3. LTK — LTK Connect gifting-only program
insert into sample_opportunities (
  brand, product, category, brand_tier, offer_type, source, official_website, application_link,
  date_found, requirements, posting_required, shipping_responsibility,
  card_required, payment_required, purchase_required, brand_verified,
  verification_status, safety_badge, safety_reasons, opportunity_score, status, notes
) values (
  'LTK', 'Creator application — LTK Power Gifting / no-obligation brand gifts', 'fashion', 'premium',
  'no_obligation_gifting', 'platform', 'https://company.shopltk.com', 'https://company.shopltk.com/en/creator',
  current_date, 'Apply via LTK Creator app; platform is invite/vetting based, free to apply.', false, 'brand_covers',
  false, false, false, true,
  'verified', 'SAFE', array['No risk signals found'], 7.0, 'ready_to_request',
  'Real platform verified 2026-08-18 (company.shopltk.com/ltk-connect-gifting-only). Site explicitly states "no-obligation gifts and discount codes" via LTK Power Gifting — gifting is free for brands too, so no cost passed to creators. Vetted/invite-leaning, not guaranteed acceptance.'
);

-- 4. Charlotte Tilbury — verified official influencer/press contact
insert into sample_opportunities (
  brand, brand_id, product, category, brand_tier, offer_type, source, official_website,
  contact_email, date_found, requirements, posting_required, shipping_responsibility,
  card_required, payment_required, purchase_required, brand_verified,
  verification_status, safety_badge, safety_reasons, opportunity_score, status, notes
) values (
  'Charlotte Tilbury', (select id from luxury_brands where name = 'Charlotte Tilbury'),
  'Direct pitch to official influencer/press contact', 'beauty', 'premium',
  'pr_sample', 'official_brand', 'https://www.charlottetilbury.com',
  'Influencer@charlottetilbury.com', current_date,
  'No public application — this is a verified real contact address for personalized outreach, not a confirmed offer.', false, 'unclear',
  false, false, false, true,
  'verified', 'SAFE', array['No risk signals found'], 4.5, 'ready_to_request',
  'Real official contact verified 2026-08-18 via help.charlottetilbury.com (their own help center, "PR" article): Influencer@charlottetilbury.com for influencer inquiries, pressoffice@charlottetilbury.com for press/media. This confirms a real channel exists — it does NOT confirm an active sample offer. Next step is a personalized pitch via the Requests page, not an application form.'
);

-- 5. Westman Atelier — verified official press contact
insert into sample_opportunities (
  brand, brand_id, product, category, brand_tier, offer_type, source, official_website,
  contact_email, date_found, requirements, posting_required, shipping_responsibility,
  card_required, payment_required, purchase_required, brand_verified,
  verification_status, safety_badge, safety_reasons, opportunity_score, status, notes
) values (
  'Westman Atelier', (select id from luxury_brands where name = 'Westman Atelier'),
  'Direct pitch to official press contact', 'beauty', 'premium',
  'pr_sample', 'official_brand', 'https://www.westman-atelier.com',
  'contact@westman-atelier.com', current_date,
  'No public application — verified real contact for personalized outreach, not a confirmed offer.', false, 'unclear',
  false, false, false, true,
  'verified', 'SAFE', array['No risk signals found'], 4.5, 'ready_to_request',
  'Real official contact verified 2026-08-18 via westman-atelier.com/pages/contact-us: press inquiries directed to contact@westman-atelier.com. Confirms a real channel, not a guaranteed sample.'
);

-- 6. Oribe — verified official press contact
insert into sample_opportunities (
  brand, product, category, brand_tier, offer_type, source, official_website,
  contact_email, date_found, requirements, posting_required, shipping_responsibility,
  card_required, payment_required, purchase_required, brand_verified,
  verification_status, safety_badge, safety_reasons, opportunity_score, status, notes
) values (
  'Oribe', 'Direct pitch to official press contact', 'beauty', 'premium',
  'pr_sample', 'official_brand', 'https://www.oribe.com',
  'pr@oribe.com', current_date,
  'No public application — verified real contact for personalized outreach, not a confirmed offer.', false, 'unclear',
  false, false, false, true,
  'verified', 'SAFE', array['No risk signals found'], 4.5, 'ready_to_request',
  'Real official contact verified 2026-08-18 via support.oribe.com/hc/en-us/articles (their own help center article titled "Press Inquiries"): pr@oribe.com. Confirms a real channel, not a guaranteed sample. Note: not yet in your luxury_brands list — add it there if you want to track the relationship.'
);

-- 7. Amouage — verified official collaboration contact
insert into sample_opportunities (
  brand, brand_id, product, category, brand_tier, offer_type, source, official_website,
  contact_email, date_found, requirements, posting_required, shipping_responsibility,
  card_required, payment_required, purchase_required, brand_verified,
  verification_status, safety_badge, safety_reasons, opportunity_score, status, notes
) values (
  'Amouage', (select id from luxury_brands where name = 'Amouage'),
  'Direct pitch to official collaboration contact', 'fragrance', 'luxury',
  'pr_sample', 'official_brand', 'https://amouage.com',
  'collaborate@amouage.com', current_date,
  'No public application — verified real contact for personalized outreach, not a confirmed offer.', false, 'unclear',
  false, false, false, true,
  'verified', 'SAFE', array['No risk signals found'], 5.5, 'ready_to_request',
  'Real official contact verified 2026-08-18 via amouage.com contact page: collaborate@amouage.com is their dedicated collaboration-request address (separate from general info@ and sales@). Confirms a real channel, not a guaranteed sample.'
);
