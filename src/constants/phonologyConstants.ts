export const MANNERS = ['plosive', 'nasal', 'trill', 'tap', 'fricative', 'lateral-fricative', 'approximant', 'lateral-approximant'];
export const PLACES = ['bilabial', 'labiodental', 'dental', 'alveolar', 'postalveolar', 'retroflex', 'palatal', 'velar', 'uvular', 'pharyngeal', 'glottal'];
export const HEIGHTS = ['close', 'near-close', 'close-mid', 'mid', 'open-mid', 'near-open', 'open'];
export const BACKNESS = ['front', 'central', 'back'];

// Détermination des cases impossibles selon la structure C#
// --- Voyelles ---
export const impossibleVowelCells: Record<string, Record<string, boolean>> = {
    'close': { front: false, central: false, back: false },
    'near-close': { front: false, central: true, back: false },
    'close-mid': { front: false, central: false, back: false },
    'mid': { front: true, central: false, back: true },
    'open-mid': { front: false, central: false, back: false },
    'near-open': { front: false, central: false, back: true },
    'open': { front: false, central: true, back: false },
};

// --- Consonnes ---
export const impossibleConsonantCells: Record<string, Record<string, boolean>> = {
    'plosive': {
        bilabial: false, labiodental: true, dental: true, alveolar: false, postalveolar: true, retroflex: false, palatal: false, velar: false, uvular: false, pharyngeal: true, glottal: false
    },
    'nasal': {
        bilabial: false, labiodental: false, dental: true, alveolar: false, postalveolar: true, retroflex: false, palatal: false, velar: false, uvular: false, pharyngeal: true, glottal: true
    },
    'trill': {
        bilabial: false, labiodental: true, dental: true, alveolar: false, postalveolar: true, retroflex: true, palatal: true, velar: true, uvular: false, pharyngeal: true, glottal: true
    },
    'tap': {
        bilabial: true, labiodental: false, dental: true, alveolar: false, postalveolar: true, retroflex: false, palatal: true, velar: true, uvular: true, pharyngeal: true, glottal: true
    },
    'fricative': {
        bilabial: false, labiodental: false, dental: false, alveolar: false, postalveolar: false, retroflex: false, palatal: false, velar: false, uvular: false, pharyngeal: false, glottal: false
    },
    'lateral-fricative': {
        bilabial: true, labiodental: true, dental: true, alveolar: false, postalveolar: true, retroflex: true, palatal: true, velar: true, uvular: true, pharyngeal: true, glottal: true
    },
    'approximant': {
        bilabial: true, labiodental: false, dental: true, alveolar: false, postalveolar: true, retroflex: false, palatal: false, velar: false, uvular: true, pharyngeal: true, glottal: true
    },
    'lateral-approximant': {
        bilabial: true, labiodental: true, dental: true, alveolar: false, postalveolar: true, retroflex: false, palatal: false, velar: false, uvular: true, pharyngeal: true, glottal: true
    },
};
