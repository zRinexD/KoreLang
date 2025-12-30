module.exports = {
  input: ['src/**/*.{js,jsx,ts,tsx}'],
  options: {
    debug: false,
    removeUnusedKeys: false,
    sort: true,

    // Recognize our hook-based usage (t from useTranslation in ../i18n)
    func: {
      list: ['t'],
      extensions: ['.js', '.jsx', '.ts', '.tsx']
    },

    // Ensure TS/TSX files are parsed for JSX and hook usage
    lexers: {
      js: ['JsxLexer'],
      jsx: ['JsxLexer'],
      ts: ['JsxLexer'],
      tsx: ['JsxLexer']
    },

    lngs: [
      'en','es','ar','bn','de','fa','fi','fr','ha','hi','id','it','ja','ko',
      'nl','pcm','pl','ru','sr','sv','ta','te','tl','tr','ur','vi','wuu',
      'yue','zh','pt','gu','mr','pa','kn','ml','sw','ms','jv','uk','el',
      'ro','cs','hu','he','th','zh-tw'
    ],

    defaultLng: 'en',
    ns: ['translation'],
    defaultNs: 'translation',

    resource: {
      loadPath: 'src/locales/{{lng}}.json',
      savePath: 'src/locales/{{lng}}.json'
    },

    keySeparator: '.',
    nsSeparator: false
  }
};
