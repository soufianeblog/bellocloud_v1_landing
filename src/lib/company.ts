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
