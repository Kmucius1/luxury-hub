import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { CheckboxField } from "@/components/ui/checkbox-field";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import {
  CATEGORIES,
  CATEGORY_LABELS,
  OFFER_TYPES,
  OFFER_TYPE_LABELS,
  PIPELINE_STATUSES,
  PIPELINE_STATUS_LABELS,
  FULFILLMENT_TYPES,
  FULFILLMENT_TYPE_LABELS,
} from "@/lib/utils";
import type { SampleOpportunity } from "@/lib/types";

interface OpportunityFormProps {
  action: (formData: FormData) => void;
  defaultValues?: Partial<SampleOpportunity>;
  submitLabel: string;
}

function Field({ label, htmlFor, children }: { label: string; htmlFor: string; children: React.ReactNode }) {
  return (
    <div className="flex flex-col gap-1.5">
      <Label htmlFor={htmlFor}>{label}</Label>
      {children}
    </div>
  );
}

export function OpportunityForm({ action, defaultValues: d = {}, submitLabel }: OpportunityFormProps) {
  return (
    <form action={action} className="flex flex-col gap-6">
      <Card>
        <CardHeader>
          <CardTitle>Basics</CardTitle>
        </CardHeader>
        <CardContent className="grid gap-4 sm:grid-cols-2">
          <Field label="Brand *" htmlFor="brand">
            <Input id="brand" name="brand" required defaultValue={d.brand ?? ""} placeholder="e.g. Maison Francis Kurkdjian" />
          </Field>
          <Field label="Product *" htmlFor="product">
            <Input id="product" name="product" required defaultValue={d.product ?? ""} placeholder="e.g. Baccarat Rouge 540 sample" />
          </Field>
          <Field label="Category *" htmlFor="category">
            <Select id="category" name="category" defaultValue={d.category ?? "fragrance"} required>
              {CATEGORIES.map((c) => (
                <option key={c} value={c}>
                  {CATEGORY_LABELS[c]}
                </option>
              ))}
            </Select>
          </Field>
          <Field label="Brand Tier" htmlFor="brand_tier">
            <Select id="brand_tier" name="brand_tier" defaultValue={d.brand_tier ?? "luxury"}>
              <option value="luxury">Luxury</option>
              <option value="premium">Premium</option>
              <option value="unverified">Unverified</option>
            </Select>
          </Field>
          <Field label="Brand Logo URL" htmlFor="brand_logo_url">
            <Input id="brand_logo_url" name="brand_logo_url" defaultValue={d.brand_logo_url ?? ""} />
          </Field>
          <Field label="Product Image URL" htmlFor="product_image_url">
            <Input id="product_image_url" name="product_image_url" defaultValue={d.product_image_url ?? ""} />
          </Field>
          <Field label="Estimated Retail Value ($)" htmlFor="estimated_value">
            <Input id="estimated_value" name="estimated_value" type="number" min={0} step="1" defaultValue={d.estimated_value ?? ""} />
          </Field>
          <Field label="Offer Type" htmlFor="offer_type">
            <Select id="offer_type" name="offer_type" defaultValue={d.offer_type ?? ""}>
              <option value="">— Select —</option>
              {OFFER_TYPES.map((t) => (
                <option key={t} value={t}>
                  {OFFER_TYPE_LABELS[t]}
                </option>
              ))}
            </Select>
          </Field>
          <Field label="Pipeline Status" htmlFor="status">
            <Select id="status" name="status" defaultValue={d.status ?? "found"}>
              {PIPELINE_STATUSES.map((s) => (
                <option key={s} value={s}>
                  {PIPELINE_STATUS_LABELS[s]}
                </option>
              ))}
            </Select>
          </Field>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Fulfillment &amp; Sizing (Clothing/Shoes)</CardTitle>
        </CardHeader>
        <CardContent className="grid gap-4 sm:grid-cols-2">
          <p className="col-span-full text-xs text-muted-foreground">
            A loan/showroom pull must be returned — it is never counted as a kept free product on the dashboard.
          </p>
          <Field label="Fulfillment Type" htmlFor="fulfillment_type">
            <Select id="fulfillment_type" name="fulfillment_type" defaultValue={d.fulfillment_type ?? "gift"}>
              {FULFILLMENT_TYPES.map((f) => (
                <option key={f} value={f}>
                  {FULFILLMENT_TYPE_LABELS[f]}
                </option>
              ))}
            </Select>
          </Field>
          <Field label="Full Product or Sample" htmlFor="full_product_or_sample">
            <Select id="full_product_or_sample" name="full_product_or_sample" defaultValue={d.full_product_or_sample ?? ""}>
              <option value="">— Select —</option>
              <option value="full_product">Full Product</option>
              <option value="sample">Sample</option>
            </Select>
          </Field>
          <Field label="Available Sizes" htmlFor="available_sizes">
            <Input id="available_sizes" name="available_sizes" defaultValue={d.available_sizes ?? ""} placeholder="e.g. XS-L, or 6-10" />
          </Field>
          <Field label="Zoe's Required Size" htmlFor="required_size">
            <Input id="required_size" name="required_size" defaultValue={d.required_size ?? ""} placeholder="Pulled from Settings sizing profile" />
          </Field>
          <Field label="Color" htmlFor="color">
            <Input id="color" name="color" defaultValue={d.color ?? ""} />
          </Field>
          <Field label="Product URL" htmlFor="product_url">
            <Input id="product_url" name="product_url" defaultValue={d.product_url ?? ""} />
          </Field>
          <CheckboxField
            name="return_required"
            label="Return Required"
            hint="Check for any loan/showroom pull — shows a prominent RETURN REQUIRED badge."
            defaultChecked={d.return_required ?? false}
          />
          <Field label="Return Shipping Responsibility" htmlFor="return_shipping_responsibility">
            <Input id="return_shipping_responsibility" name="return_shipping_responsibility" defaultValue={d.return_shipping_responsibility ?? ""} placeholder="Brand covers / Zoe covers / unclear" />
          </Field>
          <Field label="Posts Required (count)" htmlFor="posts_required_count">
            <Input id="posts_required_count" name="posts_required_count" type="number" min={0} defaultValue={d.posts_required_count ?? ""} />
          </Field>
          <Field label="Estimated Delivery" htmlFor="estimated_delivery">
            <Input id="estimated_delivery" name="estimated_delivery" type="date" defaultValue={d.estimated_delivery ?? ""} />
          </Field>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Source &amp; Contact</CardTitle>
        </CardHeader>
        <CardContent className="grid gap-4 sm:grid-cols-2">
          <Field label="Source" htmlFor="source">
            <Input id="source" name="source" defaultValue={d.source ?? ""} placeholder="Official brand site, IG post, email, etc." />
          </Field>
          <Field label="Official Website" htmlFor="official_website">
            <Input id="official_website" name="official_website" defaultValue={d.official_website ?? ""} placeholder="https://brand.com" />
          </Field>
          <Field label="Official Social Profile" htmlFor="official_social">
            <Input id="official_social" name="official_social" defaultValue={d.official_social ?? ""} />
          </Field>
          <Field label="Application Link" htmlFor="application_link">
            <Input id="application_link" name="application_link" defaultValue={d.application_link ?? ""} />
          </Field>
          <Field label="Contact Name" htmlFor="contact_name">
            <Input id="contact_name" name="contact_name" defaultValue={d.contact_name ?? ""} />
          </Field>
          <Field label="Contact Email" htmlFor="contact_email">
            <Input id="contact_email" name="contact_email" type="email" defaultValue={d.contact_email ?? ""} />
          </Field>
          <Field label="PR Agency" htmlFor="pr_agency">
            <Input id="pr_agency" name="pr_agency" defaultValue={d.pr_agency ?? ""} />
          </Field>
          <Field label="Date Found" htmlFor="date_found">
            <Input id="date_found" name="date_found" type="date" defaultValue={d.date_found ?? new Date().toISOString().slice(0, 10)} />
          </Field>
          <Field label="Deadline" htmlFor="deadline">
            <Input id="deadline" name="deadline" type="date" defaultValue={d.deadline ?? ""} />
          </Field>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Requirements &amp; Posting Obligation</CardTitle>
        </CardHeader>
        <CardContent className="grid gap-4">
          <Field label="Requirements" htmlFor="requirements">
            <Textarea id="requirements" name="requirements" defaultValue={d.requirements ?? ""} />
          </Field>
          <Field label="Social Requirements" htmlFor="social_requirements">
            <Textarea id="social_requirements" name="social_requirements" defaultValue={d.social_requirements ?? ""} />
          </Field>
          <CheckboxField
            name="posting_required"
            label="Posting Required"
            hint="If unchecked, this opportunity shows as 'No Posting Required'."
            defaultChecked={d.posting_required ?? false}
          />
          <div className="grid gap-4 sm:grid-cols-2">
            <Field label="Posting Platform" htmlFor="posting_platform">
              <Input id="posting_platform" name="posting_platform" defaultValue={d.posting_platform ?? ""} placeholder="Instagram, TikTok, both" />
            </Field>
            <Field label="Post Count" htmlFor="posting_count">
              <Input id="posting_count" name="posting_count" type="number" min={0} defaultValue={d.posting_count ?? ""} />
            </Field>
            <Field label="Posting Deadline" htmlFor="posting_deadline">
              <Input id="posting_deadline" name="posting_deadline" type="date" defaultValue={d.posting_deadline ?? ""} />
            </Field>
            <Field label="Tags Required" htmlFor="posting_tags">
              <Input id="posting_tags" name="posting_tags" defaultValue={d.posting_tags ?? ""} placeholder="@Brand #gifted" />
            </Field>
            <Field label="FTC Disclosure Type" htmlFor="disclosure_type">
              <Select id="disclosure_type" name="disclosure_type" defaultValue={d.disclosure_type ?? ""}>
                <option value="">— Select —</option>
                <option value="gifted">Gifted</option>
                <option value="pr">PR</option>
                <option value="brand_gift">Brand Gift</option>
                <option value="ad">Ad (when applicable)</option>
              </Select>
            </Field>
            <Field label="Shipping Responsibility" htmlFor="shipping_responsibility">
              <Select id="shipping_responsibility" name="shipping_responsibility" defaultValue={d.shipping_responsibility ?? "unclear"}>
                <option value="brand_covers">Brand Covers Shipping</option>
                <option value="zoe_covers">Zoe Covers Shipping</option>
                <option value="unclear">Unclear / Not Yet Confirmed</option>
              </Select>
            </Field>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Safety Check (spec §1, §9)</CardTitle>
        </CardHeader>
        <CardContent className="grid gap-3 sm:grid-cols-2">
          <p className="col-span-full text-xs text-muted-foreground">
            Any payment-shaped checkbox below automatically rejects this opportunity as &ldquo;not actually free&rdquo; and blocks it from
            advancing.
          </p>
          <CheckboxField name="payment_required" label="Payment Required" defaultChecked={d.payment_required ?? false} />
          <CheckboxField name="card_required" label="Card Required" defaultChecked={d.card_required ?? false} />
          <CheckboxField name="purchase_required" label="Purchase Required First" defaultChecked={d.purchase_required ?? false} />
          <CheckboxField name="deposit_required" label="Deposit Required" defaultChecked={d.deposit_required ?? false} />
          <CheckboxField name="gift_card_requested" label="Gift Card Requested" defaultChecked={d.gift_card_requested ?? false} />
          <CheckboxField name="crypto_requested" label="Crypto Requested" defaultChecked={d.crypto_requested ?? false} />
          <CheckboxField name="reimbursement_first" label="Reimbursement-First Scheme" defaultChecked={d.reimbursement_first ?? false} />
          <CheckboxField name="membership_fee_required" label="Membership/Subscription Fee" defaultChecked={d.membership_fee_required ?? false} />
          <Separator className="col-span-full my-1" />
          <CheckboxField name="telegram_only" label="Telegram-Only Contact" defaultChecked={d.telegram_only ?? false} />
          <CheckboxField name="whatsapp_only" label="WhatsApp-Only Contact" defaultChecked={d.whatsapp_only ?? false} />
          <CheckboxField name="urgent_pressure_language" label="Urgent / Pressure Language" defaultChecked={d.urgent_pressure_language ?? false} />
          <CheckboxField name="suspicious_attachment" label="Suspicious Attachment" defaultChecked={d.suspicious_attachment ?? false} />
          <CheckboxField name="requests_ssn_or_id" label="Requests SSN / Government ID" defaultChecked={d.requests_ssn_or_id ?? false} />
          <CheckboxField name="requests_banking_early" label="Requests Banking Info Early" defaultChecked={d.requests_banking_early ?? false} />
          <CheckboxField name="brand_verified" label="Brand Identity Verified" defaultChecked={d.brand_verified ?? false} />
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Verification &amp; Tracking</CardTitle>
        </CardHeader>
        <CardContent className="grid gap-4 sm:grid-cols-2">
          <Field label="Verification Status" htmlFor="verification_status">
            <Select id="verification_status" name="verification_status" defaultValue={d.verification_status ?? "unverified"}>
              <option value="unverified">Unverified</option>
              <option value="in_progress">In Progress</option>
              <option value="verified">Verified</option>
            </Select>
          </Field>
          <Field label="Request Date" htmlFor="request_date">
            <Input id="request_date" name="request_date" type="date" defaultValue={d.request_date ?? ""} />
          </Field>
          <Field label="Approval Date" htmlFor="approval_date">
            <Input id="approval_date" name="approval_date" type="date" defaultValue={d.approval_date ?? ""} />
          </Field>
          <Field label="Shipment Date" htmlFor="shipment_date">
            <Input id="shipment_date" name="shipment_date" type="date" defaultValue={d.shipment_date ?? ""} />
          </Field>
          <Field label="Tracking Number" htmlFor="tracking_number">
            <Input id="tracking_number" name="tracking_number" defaultValue={d.tracking_number ?? ""} />
          </Field>
          <Field label="Delivery Date" htmlFor="delivery_date">
            <Input id="delivery_date" name="delivery_date" type="date" defaultValue={d.delivery_date ?? ""} />
          </Field>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Notes</CardTitle>
        </CardHeader>
        <CardContent>
          <Textarea id="notes" name="notes" rows={4} defaultValue={d.notes ?? ""} />
        </CardContent>
      </Card>

      <div className="flex justify-end gap-2">
        <Button type="submit" variant="gold" size="lg">
          {submitLabel}
        </Button>
      </div>
    </form>
  );
}
