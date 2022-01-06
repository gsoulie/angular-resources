[< Back to main Menu](https://github.com/gsoulie/angular-resources/blob/master/ng-sheet.md)    

# Date

* [dayjs](#dayjs)    


## dayjs

La librairie **Dayjs** (https://day.js.org/) remplace **moment.js** qui est maintenant dépréciée.

### installation et configuration

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

### utilisation

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

#### manipulation

Lors de la manipulation de la date (ajout / suppression jour, mois, anndée etc...) Attention à bien faire une réaffectation de l'objet :

````typescript
//ajouter un jour 
let today = dayjs(new Date());

today.set('day', 15); // <--- NE FONCTIONNE PAS 

// ---> Syntaxe acceptée :
today = today.add(1, 'month');
today = today.set('day', 15);
````
