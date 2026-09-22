# Référence accessibilité

À lire si le projet est un frontend web (hors mode `--quick`). Référentiels : **WCAG 2.2 niveau AA** (recommandation W3C depuis octobre 2023), **RGAA 4.1.2** (déclinaison française, 106 critères en 13 thématiques), et les motifs de conception **ARIA APG**. Contexte réglementaire : l'European Accessibility Act s'applique depuis le 28 juin 2025 à de nombreux services numériques B2C dans l'UE, ce qui en fait un sujet de conformité et pas seulement de qualité.

## Ce que l'audit statique peut et ne peut pas dire

L'analyse statique ne permet **pas** de déclarer un taux de conformité RGAA ou WCAG. Une grande partie des critères exige un rendu réel : contrastes calculés, ordre de lecture, restitution par lecteur d'écran, zoom à 200 %, reflow à 320 px, gestion du focus au clavier. Le rapport doit donc :

- parler d'**indices** et de **non-conformités détectées**, jamais d'un pourcentage de conformité ;
- recommander un audit outillé et manuel pour conclure (axe-core / Lighthouse / pa11y, puis tests clavier et lecteur d'écran NVDA/VoiceOver) ;
- si un outil a11y est exécutable dans l'environnement (Playwright + axe déjà configurés dans le projet), l'utiliser et citer ses résultats.

## Vérifications statiques utiles

| Thème (RGAA) | À vérifier dans le code | Criticité indicative |
| --- | --- | --- |
| Images (1) | `alt` présent sur les `<img>` ; `alt=""` pour les images décoratives ; SVG informatifs avec `role="img"` + titre accessible | Image informative sans alternative → `MEDIUM` ; sur un contrôle (bouton-image, lien-image) → `HIGH` |
| Couleurs (3) | Information transmise uniquement par la couleur (états d'erreur, statuts) ; tokens de couleur manifestement faibles | Contrastes → `Non auditable` statiquement sauf tokens évidents |
| Scripts / composants (7) | Éléments non natifs cliquables (`div`/`span` avec `(click)`/`onClick`) sans `role`, `tabindex="0"` ni gestion clavier ; composants custom (menus, onglets, modales, combobox) conformes aux motifs APG | Contrôle inaccessible au clavier → `HIGH` |
| Éléments obligatoires (8) | `lang` sur `<html>` ; `<title>` pertinent par page/route (titre de route Angular, `metadata` Next) ; changement de langue balisé | `lang` absent → `MEDIUM` |
| Structuration (9) | Hiérarchie de titres, landmarks (`header`, `nav`, `main`, `footer`), listes sémantiques | `MEDIUM` si structure absente |
| Présentation (10) | `outline: none` sans style de focus de remplacement ; contenu caché visuellement mais lisible (et inversement) ; unités fixes empêchant le zoom | Focus invisible → `HIGH` |
| Formulaires (11) | Chaque champ a une étiquette associée (`<label for>`, `aria-labelledby`) — un placeholder n'est pas une étiquette ; erreurs liées au champ (`aria-describedby`, `aria-invalid`) ; `autocomplete` sur les données personnelles | Champ sans étiquette → `HIGH` |
| Navigation (12) | Lien d'évitement ; ordre de tabulation (`tabindex` positif = anti-pattern) ; gestion du focus au changement de route dans une SPA et à l'ouverture/fermeture des modales | `tabindex` > 0 → `MEDIUM` ; focus perdu dans une modale → `HIGH` |
| Consultation (13) | Délais sans possibilité de prolongation ; contenus en mouvement sans pause ; `prefers-reduced-motion` respecté | `MEDIUM` |

## Critères WCAG 2.2 nouveaux à surveiller

- **2.4.11 Focus Not Obscured (AA)** : éléments sticky (header, bannière cookies) masquant l'élément focalisé.
- **2.5.7 Dragging Movements (AA)** : toute interaction de glisser-déposer a une alternative au clic ou au clavier.
- **2.5.8 Target Size Minimum (AA)** : cibles d'au moins 24×24 px CSS (ou espacement suffisant).
- **3.2.6 Consistent Help (A)** : mécanismes d'aide au même endroit d'une page à l'autre.
- **3.3.7 Redundant Entry (A)** : ne pas redemander une information déjà saisie dans le même processus.
- **3.3.8 Accessible Authentication Minimum (AA)** : pas de test cognitif obligatoire (copier-coller autorisé dans les champs de mot de passe et d'OTP, gestionnaires de mots de passe non bloqués).

Note : le critère 4.1.1 Parsing est obsolète en WCAG 2.2 ; ne le cite pas.

## Outillage à recommander (si absent)

- Angular : règles d'accessibilité de template d'`angular-eslint`, Angular CDK a11y (`FocusTrap`, `LiveAnnouncer`).
- React/Next : `eslint-plugin-jsx-a11y` (inclus en partie dans `eslint-config-next`).
- Tests : `@axe-core/playwright` dans les tests E2E, `jest-axe`/`vitest-axe` pour les composants.
- L'absence de tout outillage a11y sur un frontend public → `MEDIUM`.

## Dans le rapport

Tableau par thème RGAA avec les statuts `❌ Non-conformité détectée` / `⚠️ Indice à vérifier` / `✅ Aucun écart détecté (statique)` / `Non auditable (nécessite un rendu)`, puis les findings `A11Y-xx`. Termine par la recommandation d'un audit dynamique et, si le projet est concerné par l'EAA ou le RGAA légal (secteur public français), la mention de la déclaration d'accessibilité.
