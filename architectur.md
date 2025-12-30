# Architecture Phonologie (Phoneme, PhonemeGrid)

Ce document décrit précisément l’architecture mise en place autour du système phonémique, de la grille des phonèmes, et de l’éditeur de phonologie. Il couvre les types, les données statiques, les services utilitaires, les composants UI, le flux utilisateur, ainsi que les intégrations connexes.

## Vue d’ensemble

- Objectif: séparer nettement la couche données (types + constantes IPA) de la logique UI (sélection, édition, rendu) pour une refactor complète sans legacy.
- Modèle: chaque phonème manipulé dans l’UI est un `PhonemeInstance` contenant un `PhonemeType` et, à terme, des diacritiques (tous à `None` pour le moment).
- Grille: `PhonemeGrid` affiche plusieurs `PhonemeInstance` par case, avec ajout/suppression et passage en mode édition via `PhonologyEditor`.
- Sélecteur: `PhonemeSelector`/`PhonemeDropdown` présente les options avec badge IPA puis nom du phonème.

## Modèle de données

- Types source: [src/types.ts](src/types.ts)
  - `PhonemeType`: union exhaustive de types (consonnes et voyelles) standardisés.
  - Diacritiques: types de modifications (articulation, arrondi, position de la langue, phonation, etc.) posés pour usage futur.
  - `PhonemeInstance`: unité éditable (id, `phoneme`, champs de diacritiques optionnels, par défaut à `None`).
  - `PhonologyConfig`: inventaire (consonants/vowels en `PhonemeInstance[]`), structure syllabique et combinaisons interdites.

## Données statiques

- Mappings IPA/nom/rareté: [src/constants/phonemeData.ts](src/constants/phonemeData.ts)
  - `PHONEME_TO_IPA`: correspondance `PhonemeType → IPA` (source IPA Wikipédia).
  - `PHONEME_TO_NAME`: étiquette lisible `PhonemeType → Nom humain`.
  - `PHONEME_TO_RARITY`: rareté (placeholder 0 pour tous, à compléter avec PHOIBLE/params).

## Services phonémiques

- Outils: [src/services/phonemeService.ts](src/services/phonemeService.ts)
  - Grilles de validité:
    - `CONSONANT_GRID_MAP`: clés "Place-Manner" → phonèmes admissibles.
    - `VOWEL_GRID_MAP`: clés "Height-Backness-Roundedness" → phonèmes admissibles.
  - Sélection par case:
    - `getPhonemesForConsonantCell(place, manner)`
    - `getPhonemesForVowelCell(height, backness, rounded)`
  - Métadonnées:
    - `getPhonemeIPA(phoneme)` / `getPhonemeName(phoneme)` / `getPhonemeRarity(phoneme)`
  - Instances:
    - `generatePhonemeId()` → id unique.
    - `createPhonemeInstance(phoneme)` → instance avec diacritiques à `None`.
    - `arePhonemeInstancesEqual(a, b)` → prévention stricte des doublons.
    - `getFullIPA(instance)` → rendu IPA (actuellement base IPA, diacritiques à venir).

## Composants UI

- Sélecteur:
  - [src/components/PhonemeSelector.tsx](src/components/PhonemeSelector.tsx)
    - `PhonemeSelector` (select natif) et `PhonemeDropdown` (menu personnalisé).
    - Affichage: badge IPA (accent) suivi du nom du phonème, conforme à la demande.
    - Pourquoi deux variantes ?
      - `PhonemeSelector` sert de fallback accessible et minimaliste (natif, ARIA et navigation clavier prises en charge par le navigateur).
      - `PhonemeDropdown` propose une UI enrichie (badge IPA puis nom, interactions et styles avancés). Il nécessite une gestion explicite du focus et des rôles ARIA si utilisé seul.
      - Stratégie actuelle: progressive enhancement. On garde le natif pour robustesse tout en privilégiant le dropdown dans l’éditeur. Une consolidation est possible plus tard si l’accessibilité custom est complète.
- Grille:
  - [src/components/PhonemeGrid.tsx](src/components/PhonemeGrid.tsx)
    - Composant générique paramétré par `isVowels`, `getPhonemes(row,col)`, `onCellClick(row,col)`, `onRemove(instance)`, et `renderPhoneme(instance)`.
    - Affiche plusieurs `PhonemeInstance` par case; montre un `+` lorsqu’aucun élément n’est présent.
    - `gridData` mémoïsé pour éviter des recalculs.
    - Section `unclassified` optionnelle (placeholder) pour items hors-grille.
- Éditeur de phonologie:
  - [src/components/PhonologyEditor.tsx](src/components/PhonologyEditor.tsx)
    - Flux principal: clic sur une case → ouverture d’un modal (création ou édition selon contenu de la case).
    - Ajout "Save as New": crée une `PhonemeInstance` et vérifie l’absence de doublon via `arePhonemeInstancesEqual`.
    - Mise à jour: modifie `phoneme` de l’instance sélectionnée.
    - Suppression: enlève l’instance de la liste; ferme le modal si la case devient vide.
    - Sélecteur lié à la case: `getAvailablePhonemes()` limite aux phonèmes valides pour la case.
    - Rendu: `getFullIPA(instance)` dans la grille et la prévisualisation.
    - Vowels: agrégation des variantes arrondies/non-arrondies par `(height, backness)`.

## Flux de données et interactions

1. L’inventaire vit dans `PhonologyConfig` (consonants/vowels).
2. `PhonemeGrid` demande à l’éditeur la liste des instances par case (`getPhonemes(row,col)`).
3. Sur clic d’une case, `PhonologyEditor` construit un `EditingState` (place/manner ou height/backness) et ouvre le modal.
4. Le dropdown charge `PhonemeType[]` via `getPhonemesForConsonantCell` / `getPhonemesForVowelCell`.
5. Enregistrement "Save as New" ajoute une instance et ferme le modal; "Update" remplace le `phoneme` de l’instance éditée.
6. Suppression enlève l’instance et met à jour la case; si vide, fermeture.

## Intégrations connexes

- Lexicon:
  - [src/components/Lexicon.tsx](src/components/Lexicon.tsx)
  - Détection C/V et motifs CV basés sur l’inventaire courant via `getFullIPA(instance) === char`.
- Génération IA (Gemini):
  - [src/services/geminiService.ts](src/services/geminiService.ts)
  - Les prompts Phonologie/GenWord listent `getFullIPA()` des inventaires pour guider l’IA.
  - Parsing Phonologie: `safeParsePhonologyConfig` / `parseFreeformPhonology` renvoient actuellement des tableaux vides pour `consonants`/`vowels` (stubs à compléter).

## Décisions de conception

- Séparation nette types/données/services/UI pour maintenabilité et extensibilité (diacritiques, IA).
- Prévention stricte des doublons par égalité sur tous les champs d’instance (y compris diacritiques lorsqu’ils seront actifs).
- Multi-phonèmes par case pour permettre une granularité fine.
- Rareté statique à 0 en attendant une source fiable.

## Points à terminer / améliorer

- Normalisation des clés de case (incohérence de casse):
  - `PhonemeGrid` utilise des clés en minuscule (ex. `"plosive"`, `"bilabial"`),
  - `phonemeService` mappe avec des clés en Titres (ex. `"Bilabial-Plosive"`).
  - Impact: `getPhonemesForConsonantCell`/`getPhonemesForVowelCell` retournent vide si la casse ne correspond pas.
  - Action: définir une convention interne (p. ex. minuscule) et normaliser les clés côté service OU convertir systématiquement inputs `row/col` depuis la grille.

- Diacritiques dans `getFullIPA(instance)`:
  - Actuellement: retourne uniquement l’IPA de base.
  - Action: composer l’IPA avec diacritiques selon champs d’instance (ordre, symboles IPA, règles d’affichage).

- Parsing IA vers `PhonemeInstance[]`:
  - `safeParsePhonologyConfig` / `parseFreeformPhonology` sont des stubs.
  - Action: implémenter la conversion JSON/texte → `PhonemeType` via correspondance IPA (`PHONEME_TO_IPA`), créer des `PhonemeInstance` et remplir structure syllabique/combinaisons.

- Rareté:
  - `PHONEME_TO_RARITY` = 0 pour tous.
  - Action: intégrer des valeurs documentées (PHOIBLE/paramètres linguistiques) et exposer UI si utile.

- UI diacritiques (modal):
  - Placeholder comment dans l’éditeur.
  - Action: ajouter un sous-formulaire diacritiques avec contrainte de cohérence et aperçu live via `getFullIPA`.

- Sélecteur unique:
  - Deux implémentations (`select` natif et dropdown personnalisé).
  - Action: choisir et factoriser une seule variante avec focus/ARIA et navigation clavier.

- Tests unitaires:
  - Action: ajouter des tests sur `arePhonemeInstancesEqual`, mapping cellules → phonèmes, parsing IA et rendu diacritiques.

- Documentation des conventions:
  - Action: consigner la convention de casse, les clés i18n pour labels et la cartographie place/manner/height/backness.

## Conclusion

L’architecture phonologique est désormais propre, modulaire et extensible: les types et données sont séparés, les services couvrent mapping et métadonnées, et l’UI supporte l’édition multi-phonèmes par case avec prévention stricte des doublons et affichage IPA. Il reste à normaliser la casse des clés de case, à implémenter la composition des diacritiques dans `getFullIPA`, à compléter le parsing IA pour produire de vrais `PhonemeInstance[]`, à renseigner la rareté, et à enrichir l’UI du modal (diacritiques) et l’accessibilité du dropdown. Ces améliorations verrouilleront la cohérence interne et ouvriront la voie à une expérience plus riche et fiable.
