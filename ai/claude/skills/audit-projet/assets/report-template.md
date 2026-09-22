<!--
Gabarit du rapport /audit.
- Remplace chaque <…> ; supprime les sections marquées [conditionnel] si elles ne s'appliquent pas (et ne laisse aucun placeholder).
- Chaque finding n'apparaît qu'une fois, dans le §5 « Catalogue » ; les sections par domaine y renvoient par ID.
- Aucune valeur de secret, aucun chiffre non issu d'une sortie réelle.
-->

# Rapport d'audit technique — <nom du projet> — <YYYY-MM-DD>

| | |
| --- | --- |
| **Application** | <description en une phrase, déduite du code/README> |
| **Type** | <frontend web / API / full-stack / CLI / librairie / monorepo (n unités)> |
| **Langage(s)** | <…> |
| **Framework(s)** | <nom + version exacte issue du lockfile/manifest> |
| **Runtime / paquets** | <ex. Node 22.x / pnpm 10, Python 3.13 / uv> |
| **Backend / données** | <…ou N/A> |
| **Authentification** | <mécanisme identifié ou N/A / Non auditable> |
| **Commit audité** | <hash court> sur <branche> (<n> modifications non commitées) |
| **Mode** | <complet / quick> |
| **Auditeur** | Claude — audit automatisé assisté par LLM |

---

## 1. Résumé exécutif

<4 à 6 phrases : état général, risque principal, points forts vérifiés, recommandation stratégique. Lisible par un décideur non technique.>

**Score global : <X>/10 (<niveau>)** — <n> CRITICAL · <n> HIGH · <n> MEDIUM · <n> LOW

**Les 3 actions prioritaires**
1. <action> — <ID> — effort <S/M/L>
2. <…>
3. <…>

---

## 2. Méthodologie et limites

**Exécuté**

| Vérification | Commande / outil | Résultat |
| --- | --- | --- |
| Collecte | `collect.sh` (moteur : <rg/grep>) | ✅ |
| Typage | <`tsc --noEmit -p …`> | <✅ 0 erreur / ❌ n erreurs / Non exécuté — raison> |
| Lint | <…> | <…> |
| Audit de dépendances | <npm audit / osv-scanner / …> | <…> |
| Tests | <…> | <…> |
| Secrets | <gitleaks / heuristique regex> | <…> |

**Non couvert** : <ce qui n'a pas pu être vérifié et pourquoi — ex. tests nécessitant une base de données, contrastes, comportement à l'exécution, historique git absent>.

Les statuts ✅ signifient « aucun écart détecté dans le périmètre analysé », pas « conforme ».

---

## 3. Scores

| Domaine | Score | Niveau | Calcul |
| --- | --- | --- | --- |
| Sécurité | <X>/10 | <…> | <10 − 3 (SEC-01) − … = … ; plafond éventuel> |
| Qualité & Architecture | <…> | <…> | <…> |
| Maintenabilité | <…> | <…> | <…> |
| Performance | <…> | <…> | <…> |
| Tests | <…> | <…> | <…> |
| Accessibilité [conditionnel : frontend web] | <… ou N/É> | <…> | <…> |
| Typage [conditionnel : langage non statiquement typé par nature] | <…> | <…> | <…> |
| **Global** | **<X>/10** | **<…>** | <moyenne pondérée + plafonds appliqués> |

> Barème : `references/scoring.md` du skill. Légende : 0–3,5 critique · 4–6 moyen · 6,5–8 bon · 8,5–10 excellent. `N/É` = non évalué (couverture insuffisante).

---

## 4. Évolution depuis le dernier audit [conditionnel : rapport précédent trouvé]

| | Précédent (<date>) | Actuel |
| --- | --- | --- |
| Score global | <…> | <…> |
| CRITICAL / HIGH | <…> | <…> |

- **Résolus** : <IDs/titres>
- **Nouveaux** : <…>
- **Persistants** : <…>

---

## 5. Catalogue des findings

Trié par criticité, puis par domaine. Préfixes : `SEC` sécurité · `QUA` qualité/architecture · `MNT` maintenabilité · `PERF` performance · `TEST` tests · `A11Y` accessibilité · `DEP` dépendances · `OPS` CI/CD et conteneurs.

### <ID> — [<CRITICITÉ>] <Titre court et précis>

- **Domaine / référentiel** : <ex. Sécurité — OWASP A01:2025, API1>
- **Confiance** : <Confirmé / Probable / À vérifier>
- **Emplacement(s)** : `<chemin>:<ligne>` <(+ n autres occurrences : `…`, `…`)>
- **Constat** : <ce qui a été observé>

```<langage>
<extrait court du code fautif (≤ 10 lignes), sans secret>
```

- **Impact** : <conséquence concrète dans ce projet>
- **Recommandation** : <correction précise ; lien vers la doc officielle si utile>

```<langage>
<correction proposée (≤ 15 lignes), si pertinente>
```

- **Effort** : <S/M/L> <(migration automatisable : `<commande>` si applicable)>

<!-- répéter pour chaque finding -->

---

## 6. Sécurité

### 6.1 OWASP Top 10:2025

| Catégorie | Statut | Findings / remarques |
| --- | --- | --- |
| A01 Broken Access Control | <✅ / ⚠️ / ❌ / Non auditable> | <IDs ou justification> |
| A02 Security Misconfiguration | … | … |
| A03 Software Supply Chain Failures | … | … |
| A04 Cryptographic Failures | … | … |
| A05 Injection | … | … |
| A06 Insecure Design | … | … |
| A07 Authentication Failures | … | … |
| A08 Software or Data Integrity Failures | … | … |
| A09 Security Logging & Alerting Failures | … | … |
| A10 Mishandling of Exceptional Conditions | … | … |

### 6.2 OWASP API Security Top 10 (2023) [conditionnel : API exposée]

| Catégorie | Statut | Findings / remarques |
| --- | --- | --- |
| API1 Broken Object Level Authorization | … | … |
| API2 Broken Authentication | … | … |
| API3 Broken Object Property Level Authorization | … | … |
| API4 Unrestricted Resource Consumption | … | … |
| API5 Broken Function Level Authorization | … | … |
| API6 Unrestricted Access to Sensitive Business Flows | … | … |
| API7 Server Side Request Forgery | … | … |
| API8 Security Misconfiguration | … | … |
| API9 Improper Inventory Management | … | … |
| API10 Unsafe Consumption of APIs | … | … |

### 6.3 Dépendances vulnérables

Outil : <…> — exécuté le <date> — <résultat global>

| Sévérité | Nombre | Paquets directs responsables | Correctif disponible |
| --- | --- | --- | --- |
| critical | <n> | <…> | <mineur / majeur / aucun> |
| high | <n> | <…> | <…> |
| moderate | <n> | <…> | <…> |
| low | <n> | <…> | <…> |

### 6.4 Secrets, CI/CD et conteneurs

<synthèse courte renvoyant aux IDs SEC/OPS ; emplacements uniquement, jamais de valeur>

---

## 7. Qualité & architecture

**Structure** : <organisation, découpage par feature/couche, cohérence>
**Unités** : <taille, responsabilités, couplage — citer les plus gros fichiers et hotspots>
**Gestion d'état et des données** : <approche, adéquation à la complexité>
**Typage** : <mode strict, échappatoires (nombre), résultat du compilateur>

### Pratiques du framework — <Framework + version> [une sous-section par framework détecté]

| Pratique | Constat | Attendu (version installée) | Statut |
| --- | --- | --- | --- |
| <ex. Inputs signal> | <ex. 12 `input()` / 87 `@Input()`> | <input()/model()> | <✅/⚠️/❌> |

Findings : <IDs>

---

## 8. Performance

**Chargement** : <lazy loading, découpage, taille des dépendances, rendu serveur/statique>
**Exécution** : <détection de changements, rendus, requêtes N+1, concurrence>
**Assets et I/O** : <images, polices, cache, pooling>

Findings : <IDs>. Les constats de performance sont issus d'une analyse statique ; les mesurer (Lighthouse, profiler, APM) avant d'investir un effort L.

---

## 9. Accessibilité — WCAG 2.2 AA / RGAA 4.1.2 [conditionnel : frontend web]

| Thème RGAA | Statut | Remarques |
| --- | --- | --- |
| Images | <❌ Non-conformité détectée / ⚠️ Indice / ✅ Aucun écart (statique) / Non auditable> | <…> |
| Couleurs | … | … |
| Scripts et composants | … | … |
| Éléments obligatoires | … | … |
| Structuration | … | … |
| Présentation et focus | … | … |
| Formulaires | … | … |
| Navigation | … | … |
| Consultation | … | … |

Findings : <IDs>. Un taux de conformité ne peut être établi que par un audit dynamique (outillé + manuel).

---

## 10. Dette technique et maintenabilité

**Versions et support**

| Composant | Version | Statut de support | Action |
| --- | --- | --- | --- |
| <Framework> | <…> | <supporté / LTS / hors support / Non vérifié> | <…> |
| <Runtime> | <…> | <…> | <…> |

**Patterns relevés (hors tests)**

| Pattern | Occurrences | Commentaire |
| --- | --- | --- |
| Logs de debug | <n> | <…> |
| Échappatoires de typage (`any`, `@ts-ignore`…) | <n> | <…> |
| TODO/FIXME | <n> | <…> |
| Suppressions de lint | <n> | <…> |

**Hotspots** (modifiés le plus souvent sur 12 mois) : <top 5 et ce qu'ils révèlent>
**Tests** : <frameworks, nombre de fichiers, ratio approximatif, couverture si mesurée, tests E2E, tests désactivés>

---

## 11. Plan d'action

| # | Action | Findings | Effort | Délai |
| --- | --- | --- | --- | --- |
| 1 | <…> | <IDs> | <S/M/L> | Immédiat |
| 2 | <…> | <…> | <…> | Sprint courant |
| 3 | <…> | <…> | <…> | <…> |

**PRs suggérées, dans l'ordre**
1. <titre de PR> — <objectif vérifiable>
2. <…>

---

## Conclusion

<5 à 8 phrases : synthèse, estimation globale de l'effort de remédiation (somme approximative S/M/L), trajectoire recommandée, conditions pour un prochain audit.>

---

## Annexe — Commandes exécutées

```
<liste des commandes lancées avec leur code de sortie>
```

_Rapport généré par Claude (/audit) le <YYYY-MM-DD>. Analyse automatisée : une revue humaine est recommandée avant diffusion._
