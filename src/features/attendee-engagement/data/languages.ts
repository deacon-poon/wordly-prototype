/**
 * Wordly's supported attend languages — [English name, native label] — ported from the
 * Claude Design "Current version" source so the language picker matches the real list.
 */
export const LANGS: [string, string][] = [
  ["Afrikaans", "Afrikaans"],
  ["Albanian", "Shqip"],
  ["Arabic", "العربية"],
  ["Armenian", "հայերեն"],
  ["Bengali", "বাংলা"],
  ["Bosnian", "Bosanski"],
  ["Bulgarian", "Български"],
  ["Cantonese", "廣東話"],
  ["Catalan", "Català"],
  ["Chinese (Simplified)", "普通话"],
  ["Chinese (Traditional)", "國語"],
  ["Croatian", "Hrvatski"],
  ["Czech", "Čeština"],
  ["Danish", "Dansk"],
  ["Dutch", "Nederlands"],
  ["English (US)", "English (US)"],
  ["English (UK)", "English (UK)"],
  ["English (AU)", "English (AU)"],
  ["Estonian", "Eesti keel"],
  ["Finnish", "Suomi"],
  ["French (FR)", "Français (FR)"],
  ["French (CA)", "Français (CA)"],
  ["Georgian", "ქართული ენა"],
  ["German", "Deutsch"],
  ["Greek", "Ελληνικά"],
  ["Gujarati", "ગુજરાતી"],
  ["Haitian Creole", "Kreyòl"],
  ["Hebrew", "עברית"],
  ["Hindi", "हिन्दी"],
  ["Hungarian", "Magyar"],
  ["Icelandic", "Íslenska"],
  ["Indonesian", "Bahasa Indonesia"],
  ["Irish", "Gaeilge"],
  ["Italian", "Italiano"],
  ["Japanese", "日本語"],
  ["Kannada", "ಕನ್ನಡ"],
  ["Korean", "한국어"],
  ["Lao", "ລາວ"],
  ["Latvian", "Latviešu valoda"],
  ["Lithuanian", "Lietuvių kalba"],
  ["Macedonian", "македонски"],
  ["Malay", "Bahasa Melayu"],
  ["Maltese", "Malti"],
  ["Norwegian", "Norsk bokmål"],
  ["Persian", "فارسی"],
  ["Polish", "Język polski"],
  ["Portuguese (PT)", "Português (PT)"],
  ["Portuguese (BR)", "Português (BR)"],
  ["Punjabi", "ਪੰਜਾਬੀ"],
  ["Romanian", "Română"],
  ["Russian", "Русский"],
  ["Serbian", "Српски"],
  ["Slovak", "Slovenčina"],
  ["Slovenian", "Slovenščina"],
  ["Spanish (ES)", "Español (ES)"],
  ["Spanish (LatAm)", "Español (LatAm)"],
  ["Swahili", "Kiswahili"],
  ["Swedish", "Svenska"],
  ["Tagalog", "Tagalog"],
  ["Tamil", "தமிழ்"],
  ["Thai", "ไทย"],
  ["Turkish", "Türkçe"],
  ["Ukrainian", "Українська"],
  ["Urdu", "اردو"],
  ["Welsh", "Cymraeg"],
  ["Vietnamese", "Tiếng Việt"],
  ["Zulu", "IsiZulu"],
];

/** Right-to-left attend languages (MVP spec: designs must account for RTL layouts). */
export const RTL_LANGS = new Set(["Arabic", "Hebrew", "Urdu"]);
export const isRTLLang = (name: string) => RTL_LANGS.has(name);
/** Same check for a wordly language code (live bubbles carry the code, not the name). */
export const isRTLCode = (code?: string) =>
  !!code && /^(ar|fa|he|iw|ps|sd|ur)(-|$)/.test(code);

/**
 * Which caption script the demo feed has for a language. Arabic and Hebrew have
 * full translated transcripts; other picks fall back to the English script
 * (the real feed would serve any language).
 */
export const captionLangFor = (name: string): "en" | "ar" | "he" =>
  name === "Arabic" ? "ar" : name === "Hebrew" ? "he" : "en";

/**
 * Wordly language codes for the live `/attend` feed, mapped from the picker's
 * display names by base language (regional variants share a code). Subset —
 * verify additions against help.wordly.ai/about-languages-supported.
 */
const WORDLY_CODES: Record<string, string> = {
  afrikaans: "af",
  albanian: "sq",
  arabic: "ar",
  armenian: "hy",
  bengali: "bn",
  bosnian: "bs",
  bulgarian: "bg",
  cantonese: "yue",
  catalan: "ca",
  chinese: "zh",
  croatian: "hr",
  czech: "cs",
  danish: "da",
  dutch: "nl",
  english: "en",
  estonian: "et",
  finnish: "fi",
  french: "fr",
  georgian: "ka",
  german: "de",
  greek: "el",
  gujarati: "gu",
  haitian: "ht",
  hebrew: "he",
  hindi: "hi",
  hungarian: "hu",
  icelandic: "is",
  indonesian: "id",
  irish: "ga",
  italian: "it",
  japanese: "ja",
  korean: "ko",
  latvian: "lv",
  lithuanian: "lt",
  norwegian: "no",
  polish: "pl",
  portuguese: "pt",
  romanian: "ro",
  russian: "ru",
  serbian: "sr",
  slovak: "sk",
  slovenian: "sl",
  spanish: "es",
  swahili: "sw",
  swedish: "sv",
  tagalog: "tl",
  tamil: "ta",
  thai: "th",
  turkish: "tr",
  ukrainian: "uk",
  urdu: "ur",
  vietnamese: "vi",
  welsh: "cy",
  zulu: "zu",
};
export const wordlyCodeFor = (name: string): string =>
  WORDLY_CODES[name.split(" ")[0].toLowerCase()] ?? "en";
