/** WhatsApp deep-links for call-to-action buttons. */
export const WHATSAPP_NUMBER = '212612257894'; // +212 6 12 25 78 94 (WhatsApp Business API)

/** Build a wa.me link that opens the inbox with a prefilled message. */
export function waLink(message: string): string {
  return `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(message)}`;
}
