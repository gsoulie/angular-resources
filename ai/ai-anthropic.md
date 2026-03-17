[< Back to menu](https://github.com/gsoulie/angular-resources/blob/master/ai-prompt.md)     


# Tools with Claude Code

| Name           | Purpose                                      |
|----------------|----------------------------------------------|
| Agent          | Launch a subagent to handle a task           |
| Bash           | Run a shell command                          |
| Edit           | Edit a file                                  |
| Glob           | Find files based upon a pattern              |
| Grep           | Search the contents of a file                |
| LS             | List files and directories                   |
| MultiEdit      | Make several edits at the same time          |
| NotebookEdit   | Write to a cell in a Jupyter notebook        |
| NotebookRead   | Read a cell                                  |
| Read          | Read a file                                  |
| TodoRead      | Read one of the created to-do's              |
| TodoWrite     | Update the list of to-do's                   |
| WebFetch      | Fetch from a URL                             |
| WebSearch     | Search the web                               |
| Write         | Write to a file                              |

# CLAUDE.md

Le fichier ````CLAUDE.md```` est **inclut par la suite dans toutes les requêtes faites à claude**. Ce fichier inclut le **contexte projet**, soit un résumé du projet, 
liste les commandes importantes, l'architecture du projet et les règles de codage etc... On peut modifier ce fichier à souhait.

Ce fichier est commité, donc partagé à tous les membres du projet. 

On peut créer ce fichier à la main, ou bien utiliser la commande :
````/init```` => initialise le fichier CLAUDE.md

Il est aussi possible de créer un fichier ````CLAUDE.local.md```` qui ne sera pas commit et permet d'ajouter des instructions et personnalidations privées

Enfin un fichier ````~/.claude/CLAUDE.md```` peut être créé pour être utilisé dans **tous** les projets présents sur la machine. Il contient des instructions que l'on souhaite appliquer à l'ensemble des projets

**En résumé**
|Fichier|Description|
|-|-|
|````CLAUDE.md````|Fichier de contexte d'un projet, partagé à l'équipe. Contient les instructions / bonnes pratiques à appliquer au projet|
|````CLAUDE.local.md````|Fichier de contexte local non partagé|
|````~/.claude/CLAUDE.md````|Fichier de contexte global à la machine. Contient les instructions à appliquer à l'ensemble des projets sur la machine|


# Modes de raisonnement

## plan mode

dans le cas d'exécution de tâche complexe, il est recommandé de basculer en *plan mode*. Cette fonctionnalité permet à Claude d'epxlorer le projet en profondeur avant d'y apporter des modifications.

Ceci aura pour effet de : 
* Consulter d'autres fichiers dans le projet 
* Créer un plan de mise en œuvre détaillé 
* Montrer précisément ce que le plan vise à faire 
* Attend votre approbation avant de poursuivre

## thinking mode

Claude propose différent niveau de raisonnement "thinking". Ces niveaux permette à claude de passer plus ou moins de temps de raisonnement en fonction de la complexité de la tâche avant de fourninr une solutions.

Bien entendu, plus le niveau de thinking est grand et plus il est consommateur de tokens

* "Think" - Basic reasoning
* "Think more" - Extended reasoning
* "Think a lot" - Comprehensive reasoning
* "Think longer" - Extended time reasoning
* "Ultrathink" - Maximum reasoning capability

Le mode **plan** est recommandé pour :

* Tâches nécessitant une compréhension approfondie de votre base de code
* Implémentation en plusieurs étapes
* Changements qui affectent plusieurs fichiers ou composants 

Le mode **thinking** est conseillé pour :

* Résolution de problèmes complexes
* Debugger des cas complexes
* Algorithmes complexes


# Hooks

Les *Hooks* permettent d'exécuter une commande **avant** (preToolUse) ou **après** (postToolUse) que Claude face quelque chose.

* Exécuter un *code formatter* après que Claude est édité un fichier
* Exécuter des tests automatiquement après qu'un fichier ait été modifié
* Bloquer l'éutilisation d'une fonction dépréciée
* Vérifier les commentaires TODO ajoutés dans le code par Claude et les ajouter dans un fichier de log
* Empêcher Claude de lire ou éditer un fichier particulier

On peut créer un hook manuellement ou utiliser la commande ````/hooks````

Les hooks sont définis dans :
|||
|-|-|
|**Global**|````~/.claude/settings.json````|
|**Project**|````.claude/settings.json````|
|**Project (not committed)**|````.claude/settings.local.json````|

Un hook prend la forme suivante :

````json
{
	"hooks": {
		"PreToolUse": [
			"matcher": "Read",	// tool name
			"hooks": [
				{"type": "command", "command": "node /home/hooks/read_hook.ts"}
			]
		],
		"PostToolUse": [...]
	}
}
````

*Explication* : Dans cet exemple, le hook va exécuter la commande définie **Avant** que Claude n'utilise le tool **Read**

Liste des hooks existants :

|Hook|Description|
|-|-|
|PreToolUse||
|PostToolUse||
|Notification|Exécuté lorsque Claude envoi une notification|
|Stop|Exécuté lorsque Claude a terminé de répondre|
|SubagentStop|Exécuté lorsqu'un subagent a terminé son travail|
|PreCompact|Exécuté avant qu'une opération de compactage intervienne|
|UserPromptSubmit|Exécuté lorsque l'utilisateur soumet son prompt|
|SessionStart||
|SessionEnd||
