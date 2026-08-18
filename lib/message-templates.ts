// Draft outreach message (spec §11-12). "Draft Only" mode — this only ever
// produces text for Zoe to review/copy/send herself. No auto-send.

export interface RequestMessageInput {
  contactName?: string | null;
  brand: string;
  product: string;
  category: string; // fragrance/fashion/beauty/home/accessories
  reasonFits: string; // why the product fits Zoe's content — she fills this in, never fabricated generically
}

export function buildRequestSubject(brand: string): string {
  return `PR / Creator Sample Consideration — Zoe Taylor | @Zoettaylor14 (re: ${brand})`;
}

export function buildRequestMessage(input: RequestMessageInput): string {
  const greeting = input.contactName ? `Hi ${input.contactName},` : "Hi,";
  const reason = input.reasonFits?.trim() || "[why this specific product fits my content]";

  return `${greeting}

I'm Zoe Taylor, @lifeaszoetaylor on Instagram and @Zoettaylor14 on TikTok.

I came across ${input.product} from ${input.brand} and would love to be considered for sampling, gifting, or your creator PR list.

I create lifestyle-focused content with a strong interest in ${input.category}, and ${reason}.

If you are currently offering creator samples or PR gifting for this launch, I'd love to be considered.

I'm happy to send over my creator profile or social links if helpful.

Thank you,
Zoe`;
}
