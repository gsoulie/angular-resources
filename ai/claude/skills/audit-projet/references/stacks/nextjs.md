# Référence Next.js / React

À lire si `next` est détecté (ou `react` seul : applique alors les §5 à §7). Cible : Next.js 15/16 avec App Router et React 19. **Juge toujours selon la version installée** : plusieurs API de cache et de routage ont changé entre les majeures 14, 15 et 16.

## Sommaire
1. Version, support et vulnérabilités connues
2. Frontière serveur / client
3. Sécurité spécifique
4. Données, cache et rendu
5. Qualité React
6. Performance
7. Tests et outillage
8. Interpréter les métriques de la collecte

---

## 1. Version, support et vulnérabilités connues

- Next.js et React ont connu des vulnérabilités critiques récentes. Exemples : contournement d'autorisation via le middleware (CVE-2025-29927, 2025), RCE dans le protocole des React Server Components (« React2Shell », CVE-2025-55182, décembre 2025). **Ne code pas de numéros de versions en dur dans ton raisonnement** : c'est l'audit de dépendances (`npm audit` / `osv-scanner`) qui fait foi. Si l'outil est indisponible et que la version est antérieure à la correction connue de ces CVE, signale-le comme `HIGH — À vérifier`.
- Une majeure hors support → `HIGH`. Les pages de support et de migration sur nextjs.org font référence.
- **Next 16** : Turbopack par défaut, `middleware.ts` renommé en `proxy.ts` (l'ancien nom est déprécié), API de requête (`params`, `searchParams`, `cookies()`, `headers()`) exclusivement asynchrones, modèle « Cache Components » avec `"use cache"`. Un projet 16 qui conserve `middleware.ts` → `LOW`.
- **Next 15** : `fetch` n'est plus mis en cache par défaut. Du code écrit pour 14 qui suppose ce cache implicite peut provoquer une régression de performance silencieuse.

## 2. Frontière serveur / client

Le point d'architecture le plus important d'une application App Router.

- Les composants sont serveur par défaut. `"use client"` doit être placé **le plus bas possible** dans l'arbre, sur des feuilles interactives. Un `"use client"` dans un `layout.tsx` ou une `page.tsx` rend tout le sous-arbre client → `MEDIUM` (JS inutile envoyé, perte du streaming serveur).
- Ne juge pas un pourcentage de fichiers `"use client"` : un design system peut légitimement être majoritairement client. Regarde **où** se trouvent les frontières et **ce qu'elles importent**.
- Le code serveur sensible (accès base, secrets, SDK admin) doit importer `server-only`. Sinon, un import accidentel depuis un composant client l'embarque dans le bundle → `HIGH` si des secrets ou des clés admin sont concernés.
- Props passées d'un Server Component vers un Client Component : elles sont sérialisées et visibles côté navigateur. Passer un objet utilisateur complet (hash de mot de passe, rôles internes, jetons) → `HIGH`. Utilise des DTO minimaux.
- Préfère une **Data Access Layer** : un module serveur qui centralise l'accès aux données et la vérification d'autorisation, et renvoie des DTO.

## 3. Sécurité spécifique

- **Server Actions = endpoints HTTP publics.** Chaque fonction `"use server"` peut être appelée directement, hors de l'UI. Chacune doit : authentifier, **autoriser** (l'utilisateur a-t-il le droit sur *cette* ressource ?), valider ses arguments (zod/valibot). Une action sans contrôle d'autorisation → `CRITICAL` si elle modifie ou lit des données sensibles.
- **Route Handlers** (`app/**/route.ts`) : mêmes exigences qu'une API (voir `security.md`, OWASP API Top 10).
- **Middleware/proxy** : pratique pour les redirections et l'optimisation, **jamais la seule barrière d'autorisation**. L'autorisation doit être revérifiée au plus près de la donnée (DAL, action, handler). Une autorisation reposant uniquement sur le matcher du middleware → `HIGH`.
- **Variables d'environnement** : tout `NEXT_PUBLIC_*` finit dans le bundle client. Un secret préfixé `NEXT_PUBLIC_` (clé privée, secret d'API, service role key) → `CRITICAL`. Un `process.env.X` non public dans un fichier `"use client"` vaut `undefined` en production : bug fonctionnel `MEDIUM`, et indice d'une confusion de frontière.
- **`dangerouslySetInnerHTML`** avec du contenu non assaini (CMS, Markdown, entrée utilisateur) → `HIGH`/`CRITICAL`. Attendu : DOMPurify ou `sanitize-html` côté serveur.
- **En-têtes de sécurité** : CSP (idéalement avec nonce via le proxy), `Strict-Transport-Security`, `X-Content-Type-Options`, `Referrer-Policy`, `frame-ancestors`. Absence totale → `MEDIUM` (A02). `poweredByHeader: false` → `LOW`.
- **`images.remotePatterns`** trop permissif (`hostname: '**'`) → `MEDIUM`, car l'optimiseur d'images peut servir de proxy.
- **Redirections ouvertes** : `redirect(searchParams.next)` sans validation → `MEDIUM`.
- `typescript.ignoreBuildErrors` / `eslint.ignoreDuringBuilds` dans `next.config` → `MEDIUM`/`HIGH` : les garde-fous sont désactivés en production.

## 4. Données, cache et rendu

- Récupération de données dans les Server Components (async/await) plutôt que `useEffect` + `fetch` côté client. `useEffect` pour charger des données initiales dans une app App Router → `MEDIUM` (cascades, pas de SSR, états de chargement manuels). Côté client, TanStack Query ou SWR restent légitimes pour les données très interactives.
- **Cascades** (awaits séquentiels indépendants) → `MEDIUM` : `Promise.all` ou composants parallèles sous `<Suspense>`.
- **Cache** : cohérence avec la version.
  - En Next 16 avec Cache Components : `"use cache"`, `cacheLife()`, `cacheTag()`, `updateTag()`/`revalidateTag()`.
  - En Next 15 : options de `fetch`, `unstable_cache`, segment config (`export const revalidate`/`dynamic`).
  - Signale le mélange incohérent de ces modèles et les données utilisateur mises en cache de façon partagée (fuite inter-utilisateurs → `CRITICAL`).
- **Streaming** : `loading.tsx` et `<Suspense>` autour des parties lentes. Des `error.tsx` sont attendus aux niveaux pertinents, ainsi que `not-found.tsx`.
- **Mutations** : Server Actions + `revalidatePath`/`revalidateTag` (ou `updateTag`). Préfère `useActionState` et `useOptimistic` à la gestion manuelle.
- **Metadata** : API `metadata`/`generateMetadata` plutôt que des balises `<head>` manuelles.

## 5. Qualité React

- Règles des hooks respectées (`eslint-plugin-react-hooks` actif). Désactivations `exhaustive-deps` fréquentes → `MEDIUM` (bugs de closure).
- `useEffect` utilisé pour dériver un état (setState à partir de props) → `MEDIUM` : calcul direct pendant le rendu.
- Clés de liste stables (pas `key={index}` sur des listes dynamiques).
- React Compiler : s'il est activé, les `useMemo`/`useCallback` manuels deviennent en grande partie inutiles. S'il ne l'est pas, ne recommande la mémoïsation que sur des problèmes démontrés.
- Composants de plus de ~300 lignes, prop drilling sur plus de 3 niveaux, contextes globaux qui re-rendent tout l'arbre → `MEDIUM`.
- Formulaires : Server Actions + validation serveur ; la validation client est un confort, jamais une garantie.

## 6. Performance

- `next/image` pour les images de contenu (dimensions, formats modernes, lazy). `<img>` brut → `LOW`/`MEDIUM` selon le volume et l'impact LCP ; `priority` sur l'image LCP.
- `next/font` pour les polices (pas de requête bloquante ni de CLS).
- `next/script` avec la bonne stratégie pour les scripts tiers ; scripts tiers bloquants → `MEDIUM`.
- Imports lourds dans des composants client (librairies de graphiques, éditeurs) sans `next/dynamic` → `MEDIUM`.
- Barrel files massifs importés côté client → vérifie `optimizePackageImports`.
- Rendu statique chaque fois que possible. Une page devenue dynamique par un accès inutile à `cookies()`/`headers()` → `LOW`/`MEDIUM`.

## 7. Tests et outillage

- Vitest ou Jest avec React Testing Library ; Playwright pour l'E2E (recommandé pour les Server Components et Server Actions, peu testables unitairement).
- ESLint en flat config avec la configuration Next (`eslint-config-next`) ; Biome est une alternative valable. Absence de lint → `MEDIUM`.
- `tsc --noEmit` pour le typage ; `strict: true` attendu.

## 8. Interpréter les métriques de la collecte

| Métrique | Lecture |
| --- | --- |
| `"use client"` élevé | Vérifie l'emplacement des frontières (layouts/pages ?), pas le ratio |
| `"use server"` > 0 | Lecture **obligatoire** de chaque action : auth, autorisation, validation |
| `server-only` = 0 avec accès base ou secrets | Risque de fuite de code serveur, lecture ciblée |
| `process.env` non public dans un fichier client | Bug (valeur `undefined`) ou fuite, lecture ciblée |
| Noms `NEXT_PUBLIC_*` | Cherche des noms évoquant un secret (SECRET, PRIVATE, SERVICE_ROLE, ADMIN) |
| `middleware.ts` seul garde-fou | Vérifie que l'autorisation est redoublée côté données |
| `useEffect` + `fetch` | Candidat à une migration vers Server Components |
| `<img` vs `next/image` | Opportunité perf |
| CSP = 0 | Finding A02 `MEDIUM` si application publique |
