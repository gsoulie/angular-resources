# Référence sécurité

Toujours lue. Elle donne, pour chaque référentiel, **ce qu'un audit statique peut réellement vérifier** et ce qui reste `Non auditable` sans test dynamique. Un statut ✅ ne signifie jamais « conforme » : il signifie « aucun écart trouvé dans le périmètre lu ».

## Sommaire
1. Règles de traitement des secrets
2. OWASP Top 10:2025
3. OWASP API Security Top 10 (2023)
4. Supply chain et dépendances
5. CI/CD
6. Conteneurs

---

## 1. Règles de traitement des secrets

- Ne lis jamais le contenu des fichiers `.env`, des clés ou des credentials. La collecte fournit les noms de clés, le statut git et les emplacements, et c'est suffisant pour conclure.
- Dans le rapport : `fichier:ligne` + nom de la variable ou type de secret (ex. « clé AWS ») + valeur masquée (`AKIA****`). Jamais la valeur.
- Barème :
  - Secret réel versionné dans le dépôt, ou présent dans l'historique git → `CRITICAL`. La recommandation inclut **la rotation du secret** : le supprimer du code ne suffit pas, il reste dans l'historique et dans les clones.
  - `.env` réel non ignoré par `.gitignore` mais non versionné → `HIGH` (un commit accidentel suffit).
  - Secret dans une variable exposée au client (`NEXT_PUBLIC_`, `runtimeConfig.public`, `environment.ts` Angular) → `CRITICAL`.
  - Valeur en dur ressemblant à un secret mais probablement factice (tests, fixtures, exemples) → `LOW` ou ignorer, avec la mention.

## 2. OWASP Top 10:2025

| ID | Catégorie | Vérifications statiques possibles |
| --- | --- | --- |
| A01 | Broken Access Control (inclut désormais la SSRF) | Autorisation vérifiée côté serveur sur chaque route, action ou handler ; contrôle de propriété des ressources (IDOR) ; guards front non considérés comme une protection ; CORS ; `fetch`/requêtes HTTP vers des URL fournies par l'utilisateur sans liste blanche (SSRF) ; redirections ouvertes |
| A02 | Security Misconfiguration | Mode debug, pages d'erreur détaillées, en-têtes de sécurité et CSP, cookies, Actuator/consoles d'admin exposées, `ignoreBuildErrors`, permissions par défaut, fonctionnalités inutiles activées |
| A03 | Software Supply Chain Failures | Résultat de l'audit de dépendances, lockfile versionné, versions épinglées, scripts d'installation, dépendances abandonnées ou typosquattées, actions CI non épinglées, images de base non épinglées, provenance et SBOM (bonus) |
| A04 | Cryptographic Failures | Algorithmes faibles (MD5/SHA1 pour des mots de passe, DES, ECB), hachage de mots de passe (bcrypt/scrypt/argon2 attendus), aléa non cryptographique pour les jetons, TLS désactivé, données sensibles stockées en clair |
| A05 | Injection | SQL/NoSQL/commande/LDAP par concaténation ou interpolation, XSS via les contournements des frameworks (`bypassSecurityTrust`, `dangerouslySetInnerHTML`, `v-html`, `{@html}`, `mark_safe`), `eval`, templates côté serveur construits à partir d'entrées |
| A06 | Insecure Design | Absence de rate limiting sur l'authentification, la réinitialisation de mot de passe ou les OTP ; flux métier contournables (paiement, validation côté client seulement) ; absence de limites (taille d'upload, pagination). Souvent `Non auditable` en statique : dis-le |
| A07 | Authentication Failures | Stockage des mots de passe, politique de session (expiration, rotation, invalidation au logout), JWT (`alg`, vérification, durée), MFA disponible (indice seulement), messages d'erreur énumérant les comptes |
| A08 | Software or Data Integrity Failures | Désérialisation non sûre, mises à jour ou plugins non signés, SRI sur les scripts CDN, intégrité des artefacts de build, webhooks sans vérification de signature |
| A09 | Security Logging & Alerting Failures | Journalisation des événements d'authentification et d'autorisation ; absence de données sensibles dans les logs (mots de passe, jetons, PII) ; présence d'un mécanisme d'alerte ou d'observabilité (Sentry, OpenTelemetry…). L'alerting effectif est souvent `Non auditable` |
| A10 | Mishandling of Exceptional Conditions | Catch vides, `except: pass`, erreurs avalées ; « fail open » (autorisation accordée en cas d'exception) ; stack traces renvoyées au client ; absence de timeouts ; états partiels après une erreur (transactions) ; `unwrap()` en Rust sur des entrées |

La collecte fournit les indices (patterns, CORS, TLS, crypto, catch vides) ; la lecture du code les confirme ou les écarte.

## 3. OWASP API Security Top 10 (2023)

Uniquement si le projet expose une API (y compris les Route Handlers et Server Actions Next.js).

| ID | Catégorie | Vérifications statiques |
| --- | --- | --- |
| API1 | Broken Object Level Authorization | Chaque accès par identifiant vérifie l'appartenance ou le droit (`where id = ? AND owner_id = ?` ou policy) |
| API2 | Broken Authentication | Voir A07 ; endpoints d'authentification protégés contre la force brute |
| API3 | Broken Object Property Level Authorization | Réponses filtrées par DTO ou schéma (pas d'entité complète sérialisée) ; mass assignment empêché (whitelist des champs) |
| API4 | Unrestricted Resource Consumption | Pagination bornée, limites de taille, rate limiting, timeouts, complexité GraphQL limitée |
| API5 | Broken Function Level Authorization | Endpoints d'administration protégés par rôle, pas seulement « authentifié » |
| API6 | Unrestricted Access to Sensitive Business Flows | Anti-automatisation sur les flux sensibles (achat, inscription, envoi de messages). Souvent `Non auditable` |
| API7 | Server Side Request Forgery | URL externes fournies par le client → liste blanche, blocage des IP internes et metadata |
| API8 | Security Misconfiguration | Voir A02 ; méthodes HTTP inutiles, verbosité des erreurs |
| API9 | Improper Inventory Management | Versions d'API obsolètes toujours exposées, endpoints de debug, documentation OpenAPI à jour |
| API10 | Unsafe Consumption of APIs | Réponses d'API tierces validées, timeouts, TLS vérifié |

## 4. Supply chain et dépendances

- **Audit obligatoire** avec l'outil de l'écosystème ou `osv-scanner` (qui couvre tous les lockfiles d'un monorepo polyglotte). Rapporte l'outil, la date et les compteurs par sévérité.
- Ne recopie pas 200 vulnérabilités : regroupe par paquet direct responsable et indique si un correctif existe (mise à jour mineure ou majeure).
- Distingue les dépendances de production et de développement : une vulnérabilité dans un outil de build est généralement moins grave qu'à l'exécution (mais pas nulle).
- **Lockfile absent** ou non versionné pour une application → `HIGH` (builds non reproductibles, porte ouverte aux substitutions).
- Versions flottantes (`*`, `latest`) → `MEDIUM`.
- Framework principal ou runtime hors support → `HIGH`.
- Dépendance non maintenue (dernier release très ancien, dépôt archivé) sur un chemin critique → `MEDIUM`, **uniquement si c'est vérifiable** (métadonnées du registre accessibles) ; sinon ne pas affirmer.
- Automatisation des mises à jour (Renovate/Dependabot) : son absence → `LOW`.

## 5. CI/CD

- Actions GitHub tierces non épinglées par SHA → `MEDIUM` (les tags sont mutables ; plusieurs compromissions réelles l'ont exploité). Les actions `actions/*` officielles restent un risque moindre, à mentionner.
- `permissions:` absent (jeton par défaut potentiellement en écriture) → `MEDIUM` ; attendu : `permissions: contents: read` au niveau du workflow, élargi par job.
- `pull_request_target` avec checkout du code de la PR → `CRITICAL` (exécution de code non fiable avec des secrets).
- Interpolation `${{ github.event.* }}` directement dans `run:` → injection de commande (`HIGH`) ; passer par une variable d'environnement.
- Secrets affichés dans les logs ou passés en argument de ligne de commande.
- Pipeline sans lint, typage, tests ni audit → `MEDIUM` (qualité non garantie à chaque merge).

## 6. Conteneurs

- Exécution en root (pas de `USER`) → `MEDIUM`.
- Image `:latest` ou sans tag → `MEDIUM` (non reproductible) ; épinglage par digest = bonne pratique.
- Build mono-étape embarquant les outils de build et les dépendances de dev → `LOW`/`MEDIUM` (taille, surface d'attaque).
- `COPY . .` sans `.dockerignore` → `HIGH` si `.env` ou `.git` peuvent se retrouver dans l'image.
- Secrets passés via `ARG`/`ENV` → `HIGH` (visibles dans l'historique des couches) ; attendu : secrets de build (`--mount=type=secret`).
- `HEALTHCHECK` absent → `LOW` (selon l'orchestrateur).
- Si `trivy` est disponible, `trivy fs --scanners vuln,misconfig,secret .` (lecture seule) apporte des données fiables.
