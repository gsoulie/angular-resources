# Barème de notation

Toujours lu. Objectif : **deux audits du même dépôt au même commit doivent donner les mêmes notes**, et chaque note doit pouvoir être recalculée par un lecteur à partir du catalogue de findings. Une note sans justification n'apporte rien : elle crée une fausse précision.

## 1. Criticité — définitions et exemples

| Niveau | Définition | Exemples typiques |
| --- | --- | --- |
| `CRITICAL` | Exploitable ou avéré, avec un impact direct : compromission, fuite de données, perte de données, indisponibilité | Secret versionné ; Server Action sans autorisation modifiant des données ; injection SQL alimentée par l'utilisateur ; `pull_request_target` + checkout de la PR ; `debug=True` Flask exposé ; cache partagé de données utilisateur |
| `HIGH` | Risque sérieux, exploitable sous conditions, ou dette qui bloque l'évolution | Framework ou runtime hors support ; autorisation uniquement dans le middleware ; fuite de souscription dans un composant de route ; `.env` non ignoré ; contrôle inaccessible au clavier ; absence totale de validation d'entrées sur une API |
| `MEDIUM` | Mauvaise pratique avec un impact réel à moyen terme (maintenabilité, performance, sécurité en profondeur) | Absence de CSP ; actions CI non épinglées ; `"use client"` sur un layout ; composant de plus de 600 lignes mêlant les responsabilités ; `strict` désactivé ; aucun test sur la logique métier |
| `LOW` | Amélioration souhaitable, cohérence, modernisation non urgente | Décorateurs `@Input` restants ; `<img>` sur des images non critiques ; absence de Renovate ; incohérence de nommage |

Règles :
- Un finding `À vérifier` ne peut pas être `CRITICAL` : il est au plus `HIGH`, avec la mention de ce qu'il faut vérifier.
- La criticité reflète l'impact **dans ce projet** : une injection dans un script CLI local n'a pas la gravité d'une injection dans une API publique. Précise le contexte.
- Regroupe les occurrences d'un même problème en un seul finding (avec le nombre et 3 à 5 emplacements représentatifs) plutôt que de produire 40 findings identiques qui écrasent la note.

## 2. Calcul d'un score de domaine (/10)

Domaines : Sécurité, Qualité & Architecture, Maintenabilité (dette, dépendances, cohérence), Performance, Tests, Accessibilité (si frontend web), Typage.

```
score = 10 − Σ(pénalité × coefficient de confiance), borné à [0 ; 10], arrondi à 0,5
```

| Criticité | Pénalité |
| --- | --- |
| CRITICAL | 3 |
| HIGH | 1,5 |
| MEDIUM | 0,5 |
| LOW | 0,1 (total LOW plafonné à 1 point par domaine) |

| Confiance | Coefficient |
| --- | --- |
| Confirmé | 1 |
| Probable | 0,5 |
| À vérifier | 0 (listé dans le rapport, mais n'affecte pas la note) |

Chaque finding est rattaché à **un seul** domaine principal (pas de double pénalité).

**Ajustement qualitatif** : ±1 point maximum par domaine, uniquement avec une justification écrite (par exemple +1 si une pratique excellente est vérifiée, comme une couverture de tests élevée et mesurée ou une CSP stricte avec nonce ; −1 si un manque structurel n'a pas pu s'exprimer en findings individuels).

**Couverture insuffisante** : si un domaine n'a pas pu être évalué sérieusement (tests non exécutables et aucun fichier de test lisible, a11y en mode `--quick`…), la note est `N/É` avec la raison. Un domaine `N/É` est exclu de la moyenne globale.

## 3. Plafonds

Ils empêchent une bonne moyenne de masquer un risque majeur :
- Au moins un `CRITICAL` confirmé en sécurité → score Sécurité ≤ 3 **et** score global ≤ 5.
- Framework principal ou runtime hors support → score Maintenabilité ≤ 5.
- Aucun test automatisé sur une application en production → score Tests ≤ 2.
- `strict` désactivé en TypeScript (ou équivalent) → score Typage ≤ 6.

## 4. Score global

Moyenne pondérée des domaines évalués, pondérations renormalisées si un domaine est `N/É` ou non applicable :

| Domaine | Poids |
| --- | --- |
| Sécurité | 30 |
| Qualité & Architecture | 20 |
| Maintenabilité | 15 |
| Tests | 15 |
| Performance | 10 |
| Accessibilité (frontend web) | 10 |
| Typage | intégré à Qualité si le langage est typé statiquement par nature (Go, Rust, Java…) ; sinon poids 10 prélevé à parts égales sur Qualité et Maintenabilité |

Puis appliquer les plafonds (§3).

Légende : 0–3,5 critique · 4–6 moyen · 6,5–8 bon · 8,5–10 excellent.

Affiche dans le rapport le **détail du calcul** de chaque domaine en une ligne (ex. « 10 − 3 (SEC-01) − 1,5 (SEC-02) − 0,5×0,5 (SEC-04 probable) = 5,5 → plafond CRITICAL → 3 »). C'est ce qui rend la note vérifiable et comparable d'un audit à l'autre.

## 5. Effort et priorisation

| Effort | Définition |
| --- | --- |
| S | < 2 h, localisé, faible risque de régression |
| M | 2 h à 1 j, plusieurs fichiers ou besoin de tests |
| L | > 1 j, transverse, migration ou refonte |

Priorisation du plan d'action :
1. Tous les `CRITICAL` confirmés (délai : immédiat), en commençant par la rotation des secrets exposés.
2. Les `HIGH` à effort S/M (meilleur ratio impact/effort).
3. Les `HIGH` à effort L, découpés en étapes.
4. Les `MEDIUM` regroupés par thème (une PR par thème : « migration control flow », « en-têtes de sécurité »…).
5. Les `LOW` ne figurent dans le plan que s'ils sont automatisables (schematics, codemods, `--fix` de lint).

Propose 3 à 6 PRs atomiques ordonnées, chacune avec un objectif vérifiable (« CI verte + `npm audit` sans critical »).
