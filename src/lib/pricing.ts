import type { Lang } from './i18n';

/**
 * Public prices of the products BelloCloud LLC sells, as published on each
 * product's own pricing page. Shown on the home page and on /pricing/ so a
 * visitor (or a payment-provider review) sees what is sold, for how much and
 * in which currency, without leaving bellocloud.com.
 *
 * Copied from the live sites on 2026-11-06. When a product changes its prices,
 * update them here too:
 *   - BelloPOS:  https://bellopos.app/en/pricing (international USD prices)
 *   - BelloSend: https://bellosend.net/api/public/plans (EUR)
 */

export type Currency = 'USD' | 'EUR';

export interface PosPlan {
  key: 'lite' | 'go' | 'pro' | 'plus';
  name: string;
  /** null = free. */
  monthly: number | null;
  yearly: number | null;
  lifetime: number | null;
}

export interface SendPlan {
  key: 'starter' | 'growth' | 'pro' | 'max';
  name: string;
  monthly: number;
  yearly: number;
}

export const bellopos = {
  currency: 'USD' as Currency,
  pricingUrl: (lang: Lang) => `https://bellopos.app/${lang}/pricing/`,
  plans: [
    { key: 'lite', name: 'BelloPOS Lite', monthly: null, yearly: null, lifetime: null },
    { key: 'go', name: 'BelloPOS Go', monthly: 45, yearly: 447, lifetime: 771 },
    { key: 'pro', name: 'BelloPOS Pro', monthly: 78, yearly: 782, lifetime: 1441 },
    { key: 'plus', name: 'BelloPOS Pro+', monthly: 101, yearly: 1005, lifetime: 2112 },
  ] satisfies PosPlan[],
};

export const bellosend = {
  currency: 'EUR' as Currency,
  pricingUrl: (lang: Lang) => `https://bellosend.net/${lang}#pricing`,
  plans: [
    { key: 'starter', name: 'Starter', monthly: 9, yearly: 86.4 },
    { key: 'growth', name: 'Growth', monthly: 32, yearly: 307.2 },
    { key: 'pro', name: 'Pro', monthly: 72, yearly: 691.2 },
    { key: 'max', name: 'Max', monthly: 162, yearly: 1555.2 },
  ] satisfies SendPlan[],
  /** "Build your own plan" unit prices, per month. */
  units: { channel: 9, extraUser: 4, automation: 6, unlimitedHistory: 10 },
};

/**
 * "$1,441", "€86.40" in English and Arabic (Western digits, as on invoices);
 * "1 441 $US", "86,40 €" in French. Whole amounts drop the cents.
 */
export function formatPrice(amount: number, currency: Currency, lang: Lang): string {
  const whole = Number.isInteger(amount);
  return new Intl.NumberFormat(lang === 'fr' ? 'fr-FR' : 'en-US', {
    style: 'currency',
    currency,
    minimumFractionDigits: whole ? 0 : 2,
    maximumFractionDigits: whole ? 0 : 2,
  }).format(amount);
}
