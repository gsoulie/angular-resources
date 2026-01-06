[< Back to main Menu](https://github.com/gsoulie/Mobile-App-Development)    

# AI Prompting

* [Collection de prompts](#collection-de-prompts)    


# 1. Changer de mentalité : du prompt à l’interface

Un prompt avancé n’est pas une question, c’est :

> 👉 une interface entre ton intention d’ingénieur et un moteur probabiliste

Donc :

* tu spécifies
* tu contraints
* tu évalues
* tu itères

Pense “API”, pas “chat”.

# 2. La structure canonique d’un prompt avancé (à maîtriser)

Voici une structure réutilisable partout :

* RÔLE
* CONTEXTE
* OBJECTIF
* CONTRAINTES
* CRITÈRES DE QUALITÉ
* FORMAT DE SORTIE
* PROCESSUS (optionnel)

Exemple simple (baseline)

❌ Mauvais prompt :     

> "Corrige ce code Angular"

✅ Prompt avancé :     

````
Tu es un expert Angular senior (10+ ans).

CONTEXTE :
- Application Angular 17
- OnPush, standalone components
- Contraintes performance fortes
- Code existant en production

OBJECTIF :
Refactoriser le code pour améliorer lisibilité et maintenabilité
sans modifier le comportement fonctionnel.

CONTRAINTES :
- Pas de breaking change
- Pas de nouvelle dépendance
- Respect strict des conventions Angular

CRITÈRES DE QUALITÉ :
- Code plus lisible
- Complexité réduite
- Typage strict
- Pas de logique dupliquée

FORMAT DE SORTIE :
1. Code refactorisé
2. Liste des améliorations
3. Points de vigilance
````

👉 Tu obtiens moins de surprises, plus de constance.

# 3. Patterns de prompting avancé pour développeurs
## 3.1 Prompt “Reviewer strict” (essentiel)

Utilise l’IA contre elle-même.
````
Agis comme un reviewer technique senior, très critique.

Analyse le code ci-dessous et identifie :
- Problèmes de conception
- Bugs potentiels
- Problèmes de performance
- Problèmes de sécurité
- Dettes techniques cachées

Sois précis, factuel et justifié.
Ne propose pas de solution dans un premier temps.
````

👉 Excellent pour détecter les hallucinations plus tard.

## 3.2 Prompt “Double passe” (qualité ++)
### Passe 1 – Production
````
Génère une implémentation répondant aux contraintes suivantes...
````
### Passe 2 – Audit
````
Analyse ta propre réponse précédente comme si tu faisais
une revue de code bloquante en production.
Liste tout ce qui pourrait poser problème.
````

👉 Réduction drastique des erreurs.

## 3.3 Prompt “Hypothèses explicites” (clé pour seniors)
````
Avant de répondre :
1. Liste toutes les hypothèses que tu fais
2. Indique celles qui sont incertaines
3. Pose des questions uniquement si elles sont bloquantes
````

👉 Tu reprends le contrôle sur les zones floues.

## 3.4 Prompt “Arbitrage technique”
````
Compare les approches A et B pour ce contexte précis.

Critères :
- Performance
- Maintenabilité
- Scalabilité
- Courbe d’apprentissage
- Risques à long terme

Conclue par une recommandation argumentée,
avec les trade-offs assumés.
````

👉 Parfait pour décisions d’architecture.

# 4. Prompting orienté code : règles d’or
## Règle n°1 : jamais “écris-moi du code” sans garde-fous

Toujours préciser :

* version
* contraintes runtime
* conventions
* limites

Rè## gle n°2 : découper les prompts

❌ Un gros prompt fourre-tout      
✅ Une séquence :     

1. Analyse
2. Proposition
3. Validation
4. Raffinement

## Règle n°3 : forcer l’IA à expliquer ses choix
````
Justifie chaque décision technique importante en 1 phrase.
````

# 5. Prompting pour cas concrets de dev logiciel
## 5.1 Debug avancé
````
Agis comme un ingénieur support niveau 3.

Analyse ce bug en te basant uniquement sur :
- le code
- le stack trace
- le contexte fourni

Ne fais aucune supposition non justifiée.
Liste les causes probables par ordre de confiance,
avec le raisonnement associé.
````

## 5.2 Génération de tests (très efficace)
````
Génère uniquement des tests unitaires pour ce code.

Contraintes :
- Test des cas limites
- Pas de mocks inutiles
- Lisibilité prioritaire
- Coverage fonctionnelle, pas artificielle

Indique ce qui n’est pas testable et pourquoi.
````

## 5.3 Documentation fiable
````
Documente ce module comme si :
- un nouveau développeur arrivait
- le code devait vivre 5 ans

Inclure :
- responsabilités
- invariants
- anti-patterns à éviter
````

# 6. Anti-patterns fréquents (à éviter absolument)

❌ Prompt trop vague     
❌ Trop de contexte inutile    
❌ Faire confiance au premier résultat      
❌ Ne pas challenger les réponses     
❌ Mélanger analyse et génération sans contrôle     

# 7. Entraînement pratique (important)

1. Prends un code réel
2. Fais générer une solution
3. Détruis-la avec un prompt reviewer
4. Améliore le prompt, pas le code

👉 Tu progresses plus vite que par simple usage.

# 8. Niveau expert : méta-prompting

Créer tes prompts templates personnels :

* Revue de code
* Architecture
* Debug
* Tests
* Refactor

# Collection de prompts

## Analyse projet

<details>
  <summary>Analyse globale du projet</summary>

````
Agis comme un reviewer technique senior, très critique. Analyses tout le code du projet et génères un rapport détaillé sous forme de fichier markdown (project-analyze-report.md) en ciblant en priorité les points suivants :
 - qualité du code (formattage, bonnes pratiques, découpage logique des éléments, respect  des principes SOLID, KISS, DRY...)
 - problèmes de conceptions
 - bugs potentiels
 - problèmes de performance
 - problèmes de sécurité : niveau de risque 
 - dette technique éventuelle
 - points à améliorer / corriger
 - autres recommandations pertinentes de ta part pour améliorer la qualité / sécurité
 
Sois précis, factuel et justifié.
Ne propose pas de solution dans un premier temps.
````
  
</details>

<details>
  <summary>Audit accessibilité</summary>

````
List every accessibility issue in the project. Don't forget taking into account component properties. Make a comprehensive file (in markdown format) to sum up your findings
````
  
</details>

## Code review

## Architecture

## Debug

## Test

## Refactor



