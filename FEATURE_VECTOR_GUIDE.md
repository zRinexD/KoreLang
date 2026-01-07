# Feature Vector System - Documentation

## Overview

The Feature Vector System provides a 32-bit phonetic feature encoding for all phonemes in your language inventory. It enables:

- **Allophonic rules** - Quickly determine if a phoneme belongs to a natural class (e.g., [+voice, +coronal])
- **Rule writing** - Efficiently write phonological and allophonic rules based on distinctive features
- **Phoneme analysis** - Understand the feature composition of any phoneme

## Architecture

### 1. Feature Definitions (`src/types/phoneticFeatures.ts`)

32-bit feature vector with organized categories:

| Bits | Category | Examples |
|------|----------|----------|
| 0-5 | Major Class | consonantal, syllabic, sonorant, voice, continuant, nasal |
| 6-10 | Place of Articulation | labial, coronal, dorsal, anterior, distributed |
| 11-14 | Laryngeal | spread glottis, constricted glottis, stiff/slack vocal cords |
| 15-18 | Manner | strident, lateral, delayed release, trill |
| 19-24 | Vowel | high, low, back, round, ATR, tense |
| 25-29 | Tone | tone-high, tone-low, tone-rising, tone-falling, tone-contour |
| 30-31 | Suprasegmental | stress, long |

### 2. Feature Calculation (`PhonemeDataService.computeFeatureVector`)

Features are computed from:

1. **Base features** from manner/place (consonants) or height/backness (vowels)
2. **Voicing** extracted from phoneme name
3. **Diacritic modifications** (e.g., aspiration adds `SpreadGlottis`)
4. **Tone features** from tone diacritics

```typescript
const instance: PhonemeInstance = {
  id: "p#...",
  phoneme: PhonemeType.VoicelessBilabialPlosive,
  type: "consonant",
  manner: "plosive",
  place: "bilabial",
  diacritics: ["Aspirated"],
  features: {
    displaySymbol: "pʰ",
    flags: "0",
    featureVector: 2147483653  // Computed automatically
  }
};
```

### 3. Feature Storage

Feature vectors are stored in `PhonemeInstance.features.featureVector` when phonemes are created/edited:

- **AddPhonemeModal** - Automatically computes when adding phonemes
- **EditPhonemModal** - Updates when editing existing phonemes
- **Console commands** - Computed when using `addPhoneme` command

## Usage

### Method 1: Debug Modal UI

Open the "Debug Features" button in the Phonology Editor toolbar:

- **Search** phonemes by symbol or name
- **View** detailed feature breakdown by category
- **See** binary/hex representations
- **Expand** sections to see absent features

### Method 2: Console Command

```bash
showFeatures --hash `<phoneme_id>`
```

Example output:
```
═══ Phonetic Features for [pʰ] ═══
ID: VoicelessBilabialPlosive#hash...
Type: consonant
Feature Vector: 00000000000000000000000000000101 (binary)
Feature Vector: 0x5 (hex)

Distinctive Features:
  +consonantal
  +labial
  +anterior
  +spread glottis
═════════════════════════════════
```

### Method 3: Programmatic Access

```typescript
import { PhonemeDataService } from '../services/PhonemeDataService';
import { PhoneticFeature } from '../types/phoneticFeatures';

// Get feature vector
const vector = phoneme.features?.featureVector || 0;

// Check single feature
if (PhonemeDataService.hasFeature(vector, PhoneticFeature.Voice)) {
  console.log('Phoneme is voiced');
}

// Check natural class
if (PhonemeDataService.matchesAllFeatures(vector, [
  PhoneticFeature.Coronal,
  PhoneticFeature.Voice,
])) {
  console.log('Phoneme is a voiced coronal');
}

// Get human-readable features
const features = PhonemeDataService.describeFeatures(vector);
console.log(features); // ["+voice", "+coronal", "+anterior", ...]

// Find all phonemes matching a pattern
const voicedFricatives = PhonemeDataService.findPhonemesWithFeatures(
  inventory,
  [PhoneticFeature.Voice, PhoneticFeature.Continuant, PhoneticFeature.Strident]
);
```

## Feature Mappings

### Consonants

Base features from **manner × place**:

| Manner | Bilabial | Alveolar | Velar | Examples |
|--------|----------|----------|-------|----------|
| Plosive | [+cons, -cont] | [+cons, -cont] | [+cons, -cont] | p, t, k |
| Nasal | [+cons, +nasal, +son] | [+cons, +nasal, +son] | [+cons, +nasal, +son] | m, n, ŋ |
| Fricative | [+cons, +cont] | [+cons, +cont, +strid] | [+cons, +cont] | f, s, x |
| Approximant | [+cons, +cont, +son] | [+cons, +cont, +son] | [+cons, +cont, +son] | w, ɹ, j |

All consonants are `[-syllabic, -voice]` by default (voice is added from phoneme name).

### Vowels

Base features from **height × backness**:

| Height | Front | Central | Back |
|--------|-------|---------|------|
| Close | [+high] | [+high] | [+high, +back] |
| Close-mid | [+high] | [] | [+back] |
| Open-mid | [] | [] | [+back] |
| Open | [+low] | [+low] | [+low, +back] |

All vowels are `[-consonantal, +syllabic, +sonorant, +voice]`.

### Diacritics

Modify features when applied to phonemes:

| Diacritic | Effect |
|-----------|--------|
| Aspirated | add `SpreadGlottis` |
| Glottalized | add `ConstrictedGlottis` |
| Voiced | add `Voice` |
| Voiceless | add `SpreadGlottis` |
| Nasalized | add `Nasal` |
| Labialized | add `Labial + Round` |
| Palatalized | add `Dorsal + High` |
| MoreRounded | add `Round` |
| long | add `Long` |

## Example: Implementing Allophonic Rules

```typescript
/**
 * Spanish: /d/ → [ð] after vowels (lenition)
 * English: /t/ → [ɾ] in intervocalic position (flapping)
 */
class AllophonyEngine {
  applyRules(phoneme: PhonemeInstance, context: Context): PhonemeInstance {
    const vector = phoneme.features?.featureVector || 0;

    // Rule 1: Voiced stops lenite to fricatives after vowels
    if (
      PhonemeDataService.matchesAllFeatures(vector, [
        PhoneticFeature.Voice,
        PhoneticFeature.Consonantal,
        PhoneticFeature.Dorsal  // velars don't lenite in Spanish
      ]) === false &&
      context.precedingIsVowel
    ) {
      return this.applyLenition(phoneme);
    }

    // Rule 2: Voiceless alveolar stop becomes tap between vowels
    if (
      PhonemeDataService.matchesAllFeatures(vector, [
        PhoneticFeature.Coronal,
        PhoneticFeature.Anterior,
        PhoneticFeature.SpreadGlottis
      ]) &&
      context.precedingIsVowel &&
      context.followingIsVowel
    ) {
      return this.applyFlapping(phoneme);
    }

    return phoneme;
  }
}
```

## Technical Details

### Feature Vector Layout (32 bits)

```
Bit:  31 30 29 28 27 26 25 24 23 22 21 20 19 18 17 16 15 14 13 12 11 10 9  8  7  6  5  4  3  2  1  0
      |L |St |Tc |Tf |Tr |Tl |Th |Te |AT|Rd|Ba|Lo|Hi|Tr|Dr|La|St|Sl|Sj|Cg|Sg|Ds|An|Do|Co|La|Na|Co|So|Sy|Co|
      └──────┬─────┘ └────────┬─────────┘ └─────┬────┘ └──┬──┘ └─────┬─────┘ └──┬──┘ └────┬────┘ └─────┬─────┘
         Supra       Tone           Vowel       Manner    Laryngeal    Place   Major
```

Legend:
- Co = Consonantal, Sy = Syllabic, So = Sonorant, Co = Continuant, Na = Nasal
- La = Labial, Co = Coronal, Do = Dorsal, An = Anterior, Ds = Distributed
- Sg = SpreadGlottis, Cg = ConstrictedGlottis, Sj = StiffVocalCords, Sl = SlackVocalCords
- St = Strident, La = Lateral, Dr = DelayedRelease, Tr = Trill
- Hi = High, Lo = Low, Ba = Back, Rd = Round, AT = ATR, Te = Tense
- Th = ToneHigh, Tl = ToneLow, Tr = ToneRising, Tf = ToneFalling, Tc = ToneContour
- St = Stress, L = Long

### Computation Complexity

- **Computing vector for single phoneme**: O(n) where n = number of diacritics (~5-10 typically)
- **Matching natural class**: O(1) bitwise operation
- **Finding phonemes in class**: O(m) where m = inventory size (~50-200 typically)
- **Storage overhead**: 4 bytes per phoneme instance

## Future Extensions

- [ ] Add vowel features (height/backness handling)
- [ ] Add tone feature generation
- [ ] UI tooltips showing features on phoneme hover
- [ ] Rule builder with visual natural class editor
- [ ] Feature matrix visualization
- [ ] Export allophonic rules as structured data

## See Also

- `PhonemeDataService` - Feature vector operations
- `PhonemeFeatureDebug` - UI component for feature display
- `FeatureDebugModal` - Interactive feature debugger
- `phoneticFeatures.ts` - Feature definitions and mappings
