[< Back](https://github.com/gsoulie/angular-resources/blob/master/ai-prompt.md)       

## Exemples de prompts à donner à Claude Code pour implémenter des features en mode TDD

*Ajouter une feature*
````
je veux ajouter un système de notres à cette application:
Fonctionnalités :

Ajouter une note avec un titre et un contenu.
Voir la liste de toutes les notes
Supprimer une note
Les notes sont persistées dans localStorage

On va travailler en TDD: les test d'abord, puis l'implémentation.
Proposes-moi un plan d'implémentation détaillé. Liste les fichiers à créer dans l'ordre, en précisant pour chaque fichier si c'est un test ou une implémentation.
````

*Ecrire les tests du service*
````
Créé les tests pour le service noteStorage dans src/services/tests/noteStorage.test.ts.

Tests à écrire :

getAllNotes retourne un tableau vide si rien n'est stocké
getAllNotes retourne les notes stockées dans localStorag
saveNote sauvegarde une note avec un id généré et une date createdAt
deleteNote supprime la note correspondate par son id
getNoteById retourne une note par son id ou null si elle n'existe pas

utilises Vitest. Mock le localStorage. Le service n'existe pas encore, c'est normal, on fait du TDD.
````

-> Lancer les tests pour s'assurer qu'ils sont bien tous en erreur

*Implémente le service*
````
Implémente src/services/noteStorage.ts pour faire passer tous les tests.

Fonctions : getAllNotes, saveNote, deleteNote, getNoteById.
````

-> Lancer les tests pour s'assurer que les tests sont bien tous valides

*Ecrire les tests pour le hook useNote*
````
Créé les tests pour le hook useNotes dans src/hooks/tests/useNotes.test.tsx.

Tests à écrire :
Le hook initialise avec les notes du localStorage au montage
addNote ajoute une nouvelle note et met à jour le state
deleteNote supprime une note et met à jour le state
La synchronisation avec localStorage fonctionne

Utilise Vitests et React Testing Library avec renderHook. Le hook n'existe pas encore
````

-> Lancer les tests pour s'assurer qu'ils sont bien tous en erreur

*Implémente le hook*
````
Implémente src/hooks/useNote.ts pour faire passer tous les tests.
Le hook utilise noteStorage et expose notes, addNote et deleteNote
````

-> Lancer les tests pour s'assurer que les tests sont bien tous valides

*Création composant avec ses tests*
````
Créé le composant NoteForm avec ses tests :
D'abord src/components/tests/NoteForm.test.tsx avec les tests :

Affiche les champs titre et contenu
Le bouton submit est présent
Appelle onAdd avec les bonnes valeurs à la soumission
Réinitialise les champs après soumission

Puis src/components/NoteForm.tsx : formulaire avec titre, contenu (textarea), bouton Ajouter. Prop onAdd appellée à la soumission.
Style avec Tailwind.
````
