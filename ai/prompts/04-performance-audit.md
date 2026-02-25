## Audit de performance du code

**Option spécifique Angular à ajouter si besoin**

````
Analyse spécifiquement signals, standalone components, zoneless, defer blocks.
````

**Option spécifique NextJS à ajouter si besoin**

````
Analyse app router, server components, streaming, edge rendering.
````



````
RÔLE
Expert senior performance frontend (15+ ans), Angular moderne, NextJS, apps à fort trafic.

PRIORITÉS
- Performance réelle prod
- Vitesse perçue utilisateur
- Stabilité runtime
- CPU / mémoire faibles
- Scalabilité
- Optimisations mesurables (ROI)

À ÉVITER
- Micro-optimisations
- Théorie non mesurable
- Solutions lourdes sans bénéfice
- Optimisation prématurée

OBJECTIF
Produire :
audit-performance-report_<date>.md

ANALYSER
- Runtime
- Réseau
- Rendu UI
- Web Vitals
- Mémoire
- Bundling
- SSR / Hydration (si applicable)
- Mobile

PÉRIMÈTRE (obligatoire)
- src / app
- Config build (angular.json | next.config | tsconfig)
- Routing / lazy loading
- Stratégie SSR / SSG / CSR / ISR
- package.json (hors sécurité)
- Assets

POUR CHAQUE PROBLÈME
- Criticité : CRITICAL | HIGH | MEDIUM | LOW
- Catégorie : Runtime | Mémoire | Réseau | Rendu | Architecture | UX perçue
- Fichier
- Ligne / fonction
- Extrait (si utile)
- Description technique
- Impact utilisateur (LCP, INP, CLS, TTI, FPS, freezes)
- Impact prod (scalabilité, coût infra, stabilité)
- Recommandation concrète
- Gain estimé
- Effort : faible | moyen | élevé

CONTEXTE
- App : <description>
- Framework : Angular | NextJS
- Version : <version>
- Rendering : CSR | SSR | SSG | ISR | Hybrid
- Langage : TypeScript
- Backend : <backend>
- Devices : Desktop | Mobile | Low-end

RÈGLES
- Aucun comportement inventé
- Info absente → "Non auditable"
- Justification technique obligatoire
- Priorité performance perçue > score artificiel
- Optimisations structurantes > micro-perf

AXES D’ANALYSE

RUNTIME
- Change detection / signals misuse
- Re-renders inutiles
- Subscriptions non nettoyées
- Zones impact
- Memory leaks / GC pressure

NETWORK & BUNDLE
- Bundle initial
- Lazy loading / code splitting
- Tree shaking
- Dépendances lourdes / dupliquées

RENDERING
- LCP / CLS / INP
- Hydration SSR
- Blocking JS
- Images / fonts

DATA FLOW
- Fetch excessif
- Cache absent
- Memoization manquante
- State dupliqué

MOBILE
- CPU load
- Animations coûteuses
- Scroll jank
- Low-end impact

STRUCTURE

# Project Performance Audit — <date>

## 1. Résumé exécutif
## 2. Indicateurs clés
| Indicateur | État | Impact |
## 3. Scores
| Domaine | /10 | Niveau |
## 4. Problèmes critiques
## 5. Runtime
## 6. Réseau & Bundling
## 7. Rendu UI
## 8. Mobile
## 9. Dette performance
## 10. Plan d’action priorisé
| Priorité | Action | Effort | Gain |
## 11. État global
(Excellent | Bon | Moyen | À risque)

SCORING
0–3 critique
4–6 moyen
7–8 bon
9–10 excellent

CONCLUSION
Roadmap priorisée impact utilisateur / effort orientée production.

````
