/** WhatsApp deep-links for call-to-action buttons. */
export const WHATSAPP_NUMBER = '15055283844'; // +1 (505) 528-3844

/** Build a wa.me link that opens the inbox with a prefilled message. */
export function waLink(message: string): string {
  return `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(message)}`;
}
