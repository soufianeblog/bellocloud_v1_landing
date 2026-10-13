/** Legal identity of the company behind the site. Single source for the footer,
 *  contact page, legal pages and structured data. */
export const COMPANY = {
  legalName: 'BelloCloud LLC',
  entityId: '0008115796',
  street: '1209 Mountain Road Pl NE, Ste R',
  city: 'Albuquerque',
  region: 'NM',
  postalCode: '87110',
  country: 'United States',
  countryCode: 'US',
  email: 'contact@bellocloud.com',
  phoneDisplay: '+1 (505) 528-3844',
  phoneE164: '+15055283844',
} as const;

/** Address lines as printed: street, then "City, ST ZIP", then country. */
export const addressLines = [
  COMPANY.street,
  `${COMPANY.city}, ${COMPANY.region} ${COMPANY.postalCode}`,
  COMPANY.country,
];

/** BelloCloud's official partner: Rankaya Media LLC owns and operates BelloPOS
 *  jointly with BelloCloud LLC and is the merchant of record for its payments.
 *  Same details as bellopos.app's legal pages (lib/legalRefund.ts there). */
export const PARTNER = {
  legalName: 'Rankaya Media LLC',
  street: '1209 Mountain Road PL NE, STE R',
  city: 'Albuquerque',
  region: 'NM',
  postalCode: '87110',
  country: 'United States',
  email: 'contact@rankaya.com',
  phoneDisplay: '+1 (612) 930-1231',
  phoneE164: '+16129301231',
} as const;
