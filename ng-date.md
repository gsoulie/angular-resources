[< Back to main Menu](https://github.com/gsoulie/angular-resources/blob/master/ng-sheet.md)    

# Date

* [Cheat sheet](#cheat-sheet)     
* [dayjs](#dayjs)    

## Cheat sheet

| Catégorie              | Code                                                     | Description                                   |
|-------------------------|----------------------------------------------------------|-----------------------------------------------|
| Créer une Date          | `dayjs()`                                                | Date et heure actuelles                       |
|                         | `dayjs('2024-09-19')`                                    | Date spécifique                               |
|                         | `dayjs('2024-09-19 12:00:00')`                           | Date et heure spécifiques                     |
| Formater les Dates      | `dayjs().format()`                                       | Format ISO par défaut                         |
|                         | `dayjs().format('YYYY-MM-DD')`                           | Format personnalisé                           |
|                         | `dayjs().format('DD/MM/YYYY')`                           | Format personnalisé                           |
|                         | `dayjs().format('HH:mm:ss')`                             | Heure uniquement                              |
| Analyser et Afficher    | `dayjs('2024-09-19').format('MMMM D, YYYY')`             | Affichage personnalisé (ex: September 19, 2024) |
| Manipuler les Dates     | `dayjs().add(1, 'day')`                                  | Ajouter 1 jour                                |
|                         | `dayjs().subtract(1, 'month')`                           | Soustraire 1 mois                             |
|                         | `dayjs().startOf('month')`                               | Début du mois actuel                          |
|                         | `dayjs().endOf('year')`                                  | Fin de l'année actuelle                       |
| Comparer les Dates      | `dayjs('2024-09-19').isBefore(dayjs())`                  | Vérifier si une date est avant aujourd'hui    |
|                         | `dayjs('2024-09-19').isAfter(dayjs())`                   | Vérifier si une date est après aujourd'hui    |
|                         | `dayjs('2024-09-19').isSame('2024-09-19')`               | Vérifier si deux dates sont identiques        |
| Différences de Dates    | `dayjs('2024-09-19').diff(dayjs('2023-09-19'), 'year')`  | Différence en années                          |
|                         | `dayjs('2024-09-19').diff(dayjs(), 'day')`               | Différence en jours                           |
| Travailler avec l'Heure | `dayjs().hour()`                                         | Obtenir l'heure actuelle                      |
|                         | `dayjs().minute()`                                       | Obtenir la minute actuelle                    |
|                         | `dayjs().second()`                                       | Obtenir la seconde actuelle                   |
| Obtenir des Parties     | `dayjs().year()`                                         | Obtenir l'année actuelle                      |
|                         | `dayjs().month()`                                        | Obtenir le mois actuel (0-indexé)             |
|                         | `dayjs().date()`                                         | Obtenir le jour du mois actuel                |
| Gérer les Dates UTC     | `dayjs().utc().format()`                                 | Date actuelle en UTC                          |
|                         | `dayjs().utcOffset(0).format()`                          | Définir un décalage UTC spécifique            |
| Durée et Temps Entre    | `dayjs.duration(1, 'day')`                               | Durée d'un jour                               |
|                         | `dayjs.duration(2, 'hours').asMinutes()`                 | Convertir 2 heures en minutes                 |
| Temps Relatif           | `dayjs().to(dayjs('2024-09-19'))`                        | Temps restant jusqu'à une date                |
|                         | `dayjs().from(dayjs('2023-09-19'))`                      | Temps écoulé depuis une date                  |


## Dayjs

La librairie **Dayjs** (https://day.js.org/) remplace **moment.js** qui est maintenant dépréciée.

### Installation et configuration

````npm i dayjs````

Gestion des locales (optionnel)

*app.module.ts*

````typescript
import localeFr from '@angular/common/locales/fr';
registerLocaleData(localeFr, 'fr');
import { LOCALE_ID } from '@angular/core';

...
 providers: [
    {provide: LOCALE_ID, useValue: 'fr' }
  ],
  
````

### Utilisation

*controler.ts*

````typescript
import * as dayjs from 'dayjs';

// facultatif - import des modules spécifiques
import 'dayjs/locale/fr' // import locale
import * as weekOfYear from 'dayjs/plugin/weekOfYear';
import * as weekday from 'dayjs/plugin/weekday';

dayjs.extend(weekOfYear);
dayjs.extend(weekday);
dayjs.locale('fr');


private today = dayjs(new Date());

/**
   * Créer un datetime de type YYYY-MM-DDTHH:MM à partir d'une date et d'une heure passées en paramètres
   * @param date au format 'YYYY-MM-DD'
   * @param hour au format 'HH:MM'
   * @returns
   */
  convertHourToDatetime(date: string, hour: string): string {

    let tempDate = dayjs(dayjs(date).format('YYYY-MM-DD') + ' ' + hour);

    const hourWithoutMinutes = parseInt(hour.split(':')[0]);
    if (hourWithoutMinutes >= 0 && hourWithoutMinutes <= 5) {
      // passage au jour suivant
      tempDate = tempDate.add(1, 'day');
    }
    tempDate = tempDate.set('minute', 0); // Forcer les minutes à 0
    return tempDate.format();
  }
````

### Manipulation objet date

Lors de la manipulation de la date (ajout / suppression jour, mois, anndée etc...) Attention à bien faire une réaffectation de l'objet :

````typescript
//ajouter un jour 
let today = dayjs(new Date());

today.set('day', 15); // <--- NE FONCTIONNE PAS 

// ---> Syntaxe acceptée :
today = today.add(1, 'month');
today = today.set('day', 15);
````
