[< Back to main menu](https://github.com/gsoulie/angular-resources/blob/master/ai-prompt.md)    

# Workflow type pour migration et réécriture 1 pour 1

1. Discovery 
2. Reverse engineering
3. Plan
4. Code
5. Kaizen (Amélioration continue)
6. Validation

## 1. Agent Discovery

- Cartographie du code : graphe de dépendances de chaque touch point
- Analyse des dépendances

*touch point = endpoint api, page front, cron...

## 2. Agent Reverse engineering

Pour chaque touch point, cet agent va rédiger une documentation complète fonctionnelle et technique (contrats d'api, architecture, bdd etc...).

## 3. Agent Plan

Utilise le framework speckit. L'agent architect va écrire les specs nécessaires pour l'agent codeur.

Pour écrire ces specs, l'agent architect a besoin de :
- description du legacy
- code existant
- guidelines (qui s'affinent au fur et à mesure du projet)

Ensuite l'agent pose des questions (clarify) qui seront tracées dans des ADR.

Enfin l'agent crée le plan de migration

## 4. Agent Codeur

Cet agent va prendre le plan de migration et le développer. On fait du pair programming avec lui, on ne le configure pas en auto-accept, on doit contrôler, comprendre le métier (très important) et valider chaque étape.

> Avec l'évolution des IA, cette phase de pair programming pourra petit à petit être automatisée complètement sans nécessité de review humaine. Cela dépendra des contextes métier, techniques, et stack de réécriture.

Agent QA va jouer les tests automatisés et d'intégration

Review : un agent storyteller vient réécrire l'historique git en fonction des informations que l'on souhaite mettre en évidence, de manière à découper une PR de 7000 lignes en plein de petits commit atomiques contenant un texte descriptif, permettant ainsi une review plus digeste.

Exemple de réécriture :
- un commit documentation
- un commit core
- un commit service
- un commit présentation
- un commit tests

## 5. Agent Kaizen 

1. Cet agent se connecte à github (via l'api) 
2. récupère tous les commentaires du TL sur la PR
3. les analyses, les recroises avec toutes les données à disposition des agents
4. et cherche les causes racines des problèmes.
5. Catégorise les problèmes remontés
6. Propose des correctifs
7. Mets à jour les guidelines en fonction des problèmes corrigés

> Source : [https://www.youtube.com/watch?v=2wUycT1Kis4](https://www.youtube.com/watch?v=2wUycT1Kis4)     
