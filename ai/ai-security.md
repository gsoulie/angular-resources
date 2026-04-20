[< Back to menu](https://github.com/gsoulie/angular-resources/blob/master/ai-prompt.md)    


# Sécurisation de l'environnement Claude

## Sécurisation des variables d'environnement

Eviter à Claude de lire les fichier contenants les variables d'environnement

.claude/settings.json

````json
{
	"permissions": {
		"deny": [
			"Read(.env*)",
			"Edit(.env*)",
			"Bash(cat *.env*)",
			"Bash(head *.env*)",
			"Bash(tail *.env*)",
			"Bash(less *.env*)",
			"Bash(more *.env*)",
		]
	}
}
````
