-- Add Clothing + Shoes as a full major category, sizing profile, and
-- GIFT vs LOAN/showroom-pull distinction.

alter table sample_opportunities drop constraint if exists sample_opportunities_category_check;
alter table sample_opportunities add constraint sample_opportunities_category_check
  check (category in ('fragrance', 'beauty', 'fashion', 'accessories', 'home', 'clothing', 'shoes'));

alter table received_products drop constraint if exists received_products_category_check;
alter table received_products add constraint received_products_category_check
  check (category in ('fragrance', 'beauty', 'fashion', 'accessories', 'home', 'clothing', 'shoes'));

alter table wish_list drop constraint if exists wish_list_category_check;
alter table wish_list add constraint wish_list_category_check
  check (category in ('fragrance', 'beauty', 'fashion', 'accessories', 'home', 'clothing', 'shoes'));

alter table wish_list add column if not exists size text;
alter table wish_list add column if not exists color text;

-- Private sizing profile — never guessed, filled in only by Zoe.
alter table creator_profile add column if not exists dress_size text;
alter table creator_profile add column if not exists top_size text;
alter table creator_profile add column if not exists bottom_size text;
alter table creator_profile add column if not exists denim_size text;
alter table creator_profile add column if not exists bra_size text;
alter table creator_profile add column if not exists swim_size text;
alter table creator_profile add column if not exists shoe_size text;
alter table creator_profile add column if not exists height text;
alter table creator_profile add column if not exists measurements text;
alter table creator_profile add column if not exists preferred_fit text;
alter table creator_profile add column if not exists preferred_heel_height text;
alter table creator_profile add column if not exists preferred_colors text[] default '{}';
alter table creator_profile add column if not exists preferred_styles text[] default '{}';

-- Clothing/shoe-specific opportunity fields.
alter table sample_opportunities add column if not exists fulfillment_type text default 'gift'
  check (fulfillment_type in ('gift', 'loan_showroom_pull'));
alter table sample_opportunities add column if not exists available_sizes text;
alter table sample_opportunities add column if not exists required_size text;
alter table sample_opportunities add column if not exists color text;
alter table sample_opportunities add column if not exists product_url text;
alter table sample_opportunities add column if not exists full_product_or_sample text
  check (full_product_or_sample in ('full_product', 'sample'));
alter table sample_opportunities add column if not exists posts_required_count integer;
alter table sample_opportunities add column if not exists return_required boolean default false;
alter table sample_opportunities add column if not exists return_shipping_responsibility text;
alter table sample_opportunities add column if not exists estimated_delivery date;

create index if not exists sample_opportunities_fulfillment_type_idx on sample_opportunities (fulfillment_type);

alter table received_products add column if not exists fulfillment_type text default 'gift'
  check (fulfillment_type in ('gift', 'loan_showroom_pull'));
