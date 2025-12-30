import i18n from 'i18next';
import { initReactI18next, useTranslation, I18nextProvider } from 'react-i18next';

// Import translations
import en from './locales/en.json';
import es from './locales/es.json';
import ar from './locales/ar.json';
import bn from './locales/bn.json';
import de from './locales/de.json';
import fa from './locales/fa.json';
import fi from './locales/fi.json';
import fr from './locales/fr.json';
import ha from './locales/ha.json';
import hi from './locales/hi.json';
import id from './locales/id.json';
import it from './locales/it.json';
import ja from './locales/ja.json';
import ko from './locales/ko.json';
import nl from './locales/nl.json';
import pcm from './locales/pcm.json';
import pl from './locales/pl.json';
import ru from './locales/ru.json';
import sr from './locales/sr.json';
import sv from './locales/sv.json';
import ta from './locales/ta.json';
import te from './locales/te.json';
import tl from './locales/tl.json';
import tr from './locales/tr.json';
import ur from './locales/ur.json';
import vi from './locales/vi.json';
import wuu from './locales/wuu.json';
import yue from './locales/yue.json';
import zh from './locales/zh.json';
import pt from './locales/pt.json';
import gu from './locales/gu.json';
import mr from './locales/mr.json';
import pa from './locales/pa.json';
import kn from './locales/kn.json';
import ml from './locales/ml.json';
import sw from './locales/sw.json';
import ms from './locales/ms.json';
import jv from './locales/jv.json';
import uk from './locales/uk.json';
import el from './locales/el.json';
import ro from './locales/ro.json';
import cs from './locales/cs.json';
import hu from './locales/hu.json';
import he from './locales/he.json';
import th from './locales/th.json';
import zhtw from './locales/zh-tw.json';

const resources = {
  en: { translation: en },
  es: { translation: es },
  ar: { translation: ar },
  bn: { translation: bn },
  de: { translation: de },
  fa: { translation: fa },
  fi: { translation: fi },
  fr: { translation: fr },
  ha: { translation: ha },
  hi: { translation: hi },
  id: { translation: id },
  it: { translation: it },
  ja: { translation: ja },
  ko: { translation: ko },
  nl: { translation: nl },
  pcm: { translation: pcm },
  pl: { translation: pl },
  ru: { translation: ru },
  sr: { translation: sr },
  sv: { translation: sv },
  ta: { translation: ta },
  te: { translation: te },
  tl: { translation: tl },
  tr: { translation: tr },
  ur: { translation: ur },
  vi: { translation: vi },
  wuu: { translation: wuu },
  yue: { translation: yue },
  zh: { translation: zh },
  pt: { translation: pt },
  gu: { translation: gu },
  mr: { translation: mr },
  pa: { translation: pa },
  kn: { translation: kn },
  ml: { translation: ml },
  sw: { translation: sw },
  ms: { translation: ms },
  jv: { translation: jv },
  uk: { translation: uk },
  el: { translation: el },
  ro: { translation: ro },
  cs: { translation: cs },
  hu: { translation: hu },
  he: { translation: he },
  th: { translation: th },
  'zh-tw': { translation: zhtw }
};

const rtlLanguages = ['ar', 'fa', 'ha', 'ur', 'he'];

i18n
  .use(initReactI18next)
  .init({
    resources,
    lng: 'en',
    fallbackLng: 'en',
    interpolation: {
      escapeValue: false
    }
  });

// Handle direction
i18n.on('languageChanged', (lng) => {
  const dir = rtlLanguages.includes(lng) ? 'rtl' : 'ltr';
  document.documentElement.dir = dir;
  document.documentElement.lang = lng;
});

export const languages = [
  { code: 'ar', label: 'العربية' },
  { code: 'bn', label: 'বাংলা' },
  { code: 'de', label: 'Deutsch' },
  { code: 'en', label: 'English' },
  { code: 'es', label: 'Español' },
  { code: 'fa', label: 'فارسی' },
  { code: 'fi', label: 'Suomi' },
  { code: 'fr', label: 'Français' },
  { code: 'ha', label: 'Hausa' },
  { code: 'hi', label: 'हिन्दी' },
  { code: 'id', label: 'Bahasa Indonesia' },
  { code: 'it', label: 'Italiano' },
  { code: 'ja', label: '日本語' },
  { code: 'ko', label: '한국어' },
  { code: 'nl', label: 'Nederlands' },
  { code: 'pcm', label: 'Naijá' },
  { code: 'pl', label: 'Polski' },
  { code: 'ru', label: 'Русский' },
  { code: 'sr', label: 'Српски' },
  { code: 'sv', label: 'Svenska' },
  { code: 'ta', label: 'தமிழ்' },
  { code: 'te', label: 'తెలుగు' },
  { code: 'tl', label: 'Tagalog' },
  { code: 'tr', label: 'Türkçe' },
  { code: 'ur', label: 'اردو' },
  { code: 'vi', label: 'Tiếng Việt' },
  { code: 'wuu', label: '吴语' },
  { code: 'yue', label: '粵語' },
  { code: 'zh', label: '简体中文' },
  { code: 'pt', label: 'Português' },
  { code: 'gu', label: 'ગુજરાતી' },
  { code: 'mr', label: 'मराठी' },
  { code: 'pa', label: 'ਪੰਜਾਬੀ' },
  { code: 'kn', label: 'ಕನ್ನಡ' },
  { code: 'ml', label: 'മലയാളം' },
  { code: 'sw', label: 'Kiswahili' },
  { code: 'ms', label: 'Bahasa Melayu' },
  { code: 'jv', label: 'Basa Jawa' },
  { code: 'uk', label: 'Українська' },
  { code: 'el', label: 'Ελληνικά' },
  { code: 'ro', label: 'Română' },
  { code: 'cs', label: 'Čeština' },
  { code: 'hu', label: 'Magyar' },
  { code: 'he', label: 'עברית' },
  { code: 'th', label: 'ไทย' },
  { code: 'zh-tw', label: '繁體中文' }
] as const;

export type LanguageCode = typeof languages[number]['code'];

export { i18n, useTranslation, I18nextProvider as LanguageProvider };

