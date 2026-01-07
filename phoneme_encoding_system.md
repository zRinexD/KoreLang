# Système d’encodage des phonèmes (64 bits)

Ce document spécifie un encodage compact sur 64 bits qui regroupe :
- le vecteur de traits distinctifs (32 bits), tel que défini dans `src/types/phoneticFeatures.ts` ;
- un sous‑ensemble prioritaire de diacritiques (jusqu’à 32 bits) dérivés des drapeaux BigInt utilisés par `PhonemeDataService`.

Objectif : fournir un format d’échange binaire simple, compatible avec l’implémentation actuelle (calculs en 32 bits pour les traits + drapeaux BigInt pour diacritiques/ton/suprasegmentaux).

## Vue d’ensemble

- Représentation : entier non signé 64 bits (BigInt recommandé en JS/TS).
- Convention de bits : bit 0 = poids faible (LSB).
- Canoniques runtime :
  - `features.featureVector` (number 32 bits) = source de vérité pour les traits.
  - `features.flags` (string représentant un BigInt) = source de vérité pour l’ensemble des diacritiques/suprasegmentaux/ton (utilisé pour le rendu des symboles).
- Le paquet 64 bits est une projection « core » lossless pour les traits et pour un ensemble prioritaire de 30 diacritiques ; il omet volontairement certains marqueurs de groupement et encode le ton via les bits de traits (pas via diacritiques).

## Disposition des bits (64)

- Bits 0–31 : vecteur de traits (`PhoneticFeature`) — voir `src/types/phoneticFeatures.ts`.
- Bits 32–61 : diacritiques « core » (30 max, ordre fixe ci‑dessous).
- Bits 62–63 : réservés (future use / overflow / profil personnalisé).

### Détails — 0 → 31 : Traits

Correspond exactement à l’enum `PhoneticFeature` :
- 0–5 : Classe majeure — `Consonantal, Syllabic, Sonorant, Voice, Continuant, Nasal`
- 6–10 : Lieu — `Labial, Coronal, Dorsal, Anterior, Distributed`
- 11–14 : Laryngé — `SpreadGlottis, ConstrictedGlottis, StiffVocalCords, SlackVocalCords`
- 15–18 : Manière — `Strident, Lateral, DelayedRelease, Trill`
- 19–24 : Voyelles — `High, Low, Back, Round, ATR, Tense`
- 25–29 : Ton — `ToneHigh, ToneLow, ToneRising, ToneFalling, ToneContour`
- 30–31 : Suprasegmental — `Stress, Long`

Remarque : même si le ton peut aussi être signalé via des diacritiques, l’encodage 64 bits utilise exclusivement ces bits de traits pour le ton.

### Détails — 32 → 61 : Diacritiques « core »

Ordre et mapping indexés depuis l’implémentation (`diacriticOrder` dans `PhonemeDataService`) :

1. 32 : Dental
2. 33 : Apical
3. 34 : Laminal
4. 35 : Linguolabial
5. 36 : Labialized
6. 37 : Palatalized
7. 38 : Velarized
8. 39 : Pharyngealized
9. 40 : Glottalized
10. 41 : MoreRounded
11. 42 : LessRounded
12. 43 : Advanced
13. 44 : Retracted
14. 45 : Centralized
15. 46 : MidCentralized
16. 47 : Voiceless
17. 48 : Voiced
18. 49 : BreathyVoiced
19. 50 : CreakyVoiced
20. 51 : Raised
21. 52 : Lowered
22. 53 : AdvancedTongueRoot
23. 54 : RetractedTongueRoot
24. 55 : NasalRelease
25. 56 : LateralRelease
26. 57 : NoAudibleRelease
27. 58 : Syllabic
28. 59 : NonSyllabic
29. 60 : Aspirated
30. 61 : Nasalized

Exclus du pack 64 bits (gérés ailleurs ou déjà couverts) :
- Suprasegmentaux de groupement : `MinorGroup`, `MajorGroup`, `SyllableBreak`, `Linking` (non pertinents au niveau « par phonème »).
- Ton diacritique : géré via `PhoneticFeature` (bits 25–29), pas ré‑encodé ici.
- Variantes de longueur/stress spécifiques : déjà normalisées via `Long`/`Stress` dans les traits.

## Relation avec l’implémentation actuelle

- Vecteur de traits : calculé par `PhonemeDataService.computeFeatureVector(instance)` à partir de `manner/place` (consonnes) ou `height/backness` (voyelles), modifié par les diacritiques (`DIACRITIC_FEATURE_MODIFIERS`).
- Drapeaux de diacritiques : `features.flags` (BigInt sérialisé en string) pilotent le rendu (`buildPhonemSymbol()`), et servent de source pour projeter dans les bits 32–61.
- Ton : les diacritiques de ton servent au rendu ; l’intégration au vecteur de traits (25–29) est la représentation cible.

## Sérialisation / Désérialisation

### Pack (→ 64 bits)

```ts
import { PhoneticFeature } from "./src/types/phoneticFeatures";

// Ordre strict des diacritiques core, index 0..29 = bits 32..61
const CORE_DIACRITIC_ORDER = [
  "Dental","Apical","Laminal","Linguolabial","Labialized","Palatalized","Velarized","Pharyngealized",
  "Glottalized","MoreRounded","LessRounded","Advanced","Retracted","Centralized","MidCentralized",
  "Voiceless","Voiced","BreathyVoiced","CreakyVoiced","Raised","Lowered","AdvancedTongueRoot","RetractedTongueRoot",
  "NasalRelease","LateralRelease","NoAudibleRelease","Syllabic","NonSyllabic","Aspirated","Nasalized",
] as const;

type CoreDia = typeof CORE_DIACRITIC_ORDER[number];

type FlagsBigInt = bigint; // = BigInt( features.flags )

function pack64(featureVector32: number, flagsBig: FlagsBigInt, hasFlag: (name: CoreDia) => boolean): bigint {
  const low = BigInt(featureVector32 >>> 0); // 32 bits
  let highMask = 0n;
  CORE_DIACRITIC_ORDER.forEach((name, i) => {
    if (hasFlag(name)) {
      highMask |= (1n << BigInt(i)); // map to 0..29
    }
  });
  // positionner dans 32..61
  const high = (highMask & ((1n << 30n) - 1n)) << 32n;
  return (high | low) & ((1n << 64n) - 1n);
}
```

Notes :
- `hasFlag(name)` est une fonction adaptatrice qui interroge le BigInt `features.flags` selon les constantes réelles (`PhoneticModification`).
- Les bits 62–63 restent à 0 (réservés).

### Unpack (64 bits → champs)

```ts
function unpack64(packed: bigint) {
  const mask32 = (1n << 32n) - 1n;
  const featureVector32 = Number(packed & mask32); // 0..31
  const high30 = (packed >> 32n) & ((1n << 30n) - 1n); // 32..61

  const diacritics: string[] = [];
  CORE_DIACRITIC_ORDER.forEach((name, i) => {
    if ((high30 & (1n << BigInt(i))) !== 0n) diacritics.push(name);
  });

  const reserved = Number((packed >> 62n) & 0x3n); // 62..63
  return { featureVector32, diacritics, reserved };
}
```

## Exemples

- `pʰ` (plosive bilabiale non voisée aspirée) :
  - Traits (0–31) : `+Consonantal +Labial +Anterior` (et `+SpreadGlottis` si explicitement aspirée/voiceless)
  - Diacritiques (32–61) : bit « Aspirated » = 1
- `n` (nasale alvéolaire voisée) :
  - Traits (0–31) : `+Consonantal +Sonorant +Nasal +Voice +Coronal +Anterior`
  - Diacritiques (32–61) : aucun
- `i` (voyelle antérieure fermée non arrondie) :
  - Traits (0–31) : `+Syllabic +Sonorant +Voice +High`
  - Diacritiques (32–61) : aucun

## Limites et compatibilité

- Le pack 64 bits est une _projection_ : certains marqueurs (groupements, séparateurs, variantes fines) ne sont pas inclus mais restent disponibles via `features.flags` (BigInt) et le hash `base#flags`.
- Ton : encodez via les bits 25–29 (traits). Les diacritiques de ton restent pris en compte pour l’affichage.
- Overflow futur : les bits 62–63 peuvent signaler un profil étendu (p.ex. alternative de mapping) si besoin.

## Références de code

- `src/types/phoneticFeatures.ts` — définition des 32 bits de traits.
- `src/services/PhonemeDataService.ts` — calcul du vecteur, mapping des diacritiques, construction du symbole.
- `src/components/ui/PhonemeFeatureDebug.tsx` — visualisation débogage (binaire/hex/texte).

## Bonnes pratiques

- Conservez `features.featureVector` comme source de vérité pour les règles/allophonie (opérations bitwise O(1)).
- Utilisez le pack 64 bits pour des exports binaires, caches, index, ou interop.
- Gardez `features.flags` intégral pour le rendu exact des symboles et la compatibilité ascendante.
