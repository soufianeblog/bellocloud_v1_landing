import en from '../i18n/en.json';
import fr from '../i18n/fr.json';
import ar from '../i18n/ar.json';

export const languages = {
  en: 'English',
  fr: 'Français',
  ar: 'العربية',
} as const;

export const defaultLang = 'en';
export const rtlLangs = ['ar'];

export const ui = { en, fr, ar } as const;

export type Lang = keyof typeof ui;

/** Base path — empty for root domain deployment, set to /repo-name for GitHub Pages project sites. */
export const basePath = '';

/** Returns a translator `t(key)` for the given language, falling back to EN then the key itself. */
export function useTranslations(lang: Lang) {
  const dict = ui[lang] as Record<string, string>;
  const fallback = ui[defaultLang] as Record<string, string>;
  return function t(key: string): string {
    return dict[key] ?? fallback[key] ?? key;
  };
}

export function getDir(lang: Lang): 'rtl' | 'ltr' {
  return rtlLangs.includes(lang) ? 'rtl' : 'ltr';
}

/** Build a language-prefixed path, e.g. localizePath('en', '#pricing'). */
export function localizePath(lang: Lang, hash = ''): string {
  return `${basePath}/${lang}/${hash}`;
}

/** Prefix an asset path with the base, e.g. assetPath('/bello-logo.svg'). */
export function assetPath(path: string): string {
  return `${basePath}${path}`;
}
