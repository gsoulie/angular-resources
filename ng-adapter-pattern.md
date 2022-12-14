[< Back to main Menu](https://github.com/gsoulie/angular-resources/blob/master/ng-sheet.md)    

# Adapter pattern

* [Adapter pattern](#adapter-pattern)     
* [loadFromJson](#loadfromjson)     
* [Exemple concret](#exemple-avec-une-api-retournant-la-liste-des-pays)     


## Adapter pattern 
Le Model Adapter Pattern permet de simplifier le code des retours d'observable et aussi de respecter la pratique du DRY (Don't repeat yourself)

https://florimond.dev/blog/articles/2018/09/consuming-apis-in-angular-the-model-adapter-pattern/

Le but est de simplifier le code suivant : 

*course.model.ts*
````typescript
export class Course {
  constructor(
    public id: number,
    public code: string,
    public name: string,
    public created: Date
  ) {}
}
````

*course.service.ts*
````typescript
export class CourseService {
  private baseUrl = "http://api.myapp.com/courses";

  constructor(private http: HttpClient) {}

  // return list of courses
  list(): Observable<Course[]> {
    const url = `${this.baseUrl}/`;
    return this.http
      .get(url)
      .pipe(
        map((data: any[]) =>
          data.map(
            (item: any) =>
              new Course(item.id, item.code, item.name, new Date(item.created))
          )
        )
      );
  }
}
````

### En utilisant un Adapter : 

*app/core/adapter.ts*
````typescript
export interface Adapter<T> {
  adapt(item: any): T;
}
````

*course.model.ts*
````typescript
import { Injectable } from "@angular/core";
import { Adapter } from "./adapter";

export class Course {
  // ...
}

@Injectable({
  providedIn: "root",
})
export class CourseAdapter implements Adapter<Course> {
  adapt(item: any): Course {
    return new Course(item.id, item.code, item.name, new Date(item.created));
  }
}
````

*course.service.ts*
````typescript
export class CourseService {
  private baseUrl = "http://api.myapp.com/courses";

  constructor(private http: HttpClient, private adapter: CourseAdapter) {}

  list(): Observable<Course[]> {
    const url = `${this.baseUrl}/`;
    return this.http.get(url).pipe(
      // Adapt each item in the raw data array
      map((data: any[]) => data.map((item) => this.adapter.adapt(item)))
    );
  }
}
````

Ceci permet de rendre le code plus adaptable si le backend venait à être modifié (ex : renommage d'un paramètre, changement de type etc...)

Ex : Côté backend on renomme le paramètre "name" par "label". Il y a juste à modifier l'adapter sans changer la classe initiale sans rien changer d'autre dans le code.

*course.model.ts*
````typescript
@Injectable({
  providedIn: 'root'
})
export class CourseAdapter implements Adapter<Course> {

  adapt(item: any): Course {
    return new Course(
      item.id,
      item.code,
-     item.name,
+     item.label,
      new Date(item.created),
    );
  }
}
````
## LoadFromJson
[Back to top](#adapter-pattern)

Une autre méthode 

### Version simplifiée 

*class.ts*

````typescript
export class Article {
    public static fromJson(json: Object): Article {
        return new Article(
            json['author'],
            json['title'],
            json['body'],
            new Date(json['published'])
        );
    }

    constructor(public author: string,
                public title: string,
                public body: string,
                public published: Date) {
    }
}
````

*service.ts*

````typescript
export class DataService {
  constructor(protected http: HttpClient) {}

  public getArticles(): Observable<Article[]> {
    return this.http.get('http://localhost:3000/articles/').pipe(
      map(
        (jsonArray: Object[]) => jsonArray.map(jsonItem => Article.fromJson(jsonItem))
      )
    );
  }
}
````

### Version plus complexe (structurée)

*class.model.ts*
````typescript
export class OrderSummary extends ApiMessage {

  constructor(
    public uid?: number,
    public orderCode?: string,
    public orderName?: string,
    public status?: number,
    ) {
      super();
  }

  public loadFromJson(json: Object): this {
    this.uid = json['Uid'];
    this.orderCode = json['OrderCode'];
    this.orderName = json['OrderName'];
    this.status = json['StatusUid'];
    return this;
  }
}
````

*api-message.model.d.ts*
````typescript
export declare abstract class ApiMessage {
    fromHub: boolean;
    abstract loadFromJson(json: object): this;
    constructor();
}
export declare function createApiMessageInstance<T extends ApiMessage>(c: new () => T): T;
````

*service.ts*

````typescript
// récupérer un tableau d'objet
fetchData(): Observable<T[]> {
  return this.http.getFromBacterioBusinessApi(url)
    .pipe(
      map((jsonArray: Object[]) =>
        jsonArray.map((jsonItem) =>
          createApiMessageInstance(OrderSummary).loadFromJson(jsonItem)
        )
      )
    );
}


fetchDetail(): Observable<T> {
  return this.http
      .getFromPlanningApi(url)
      .pipe(map((jsonItem) => createApiMessageInstance(Ressource).loadFromJson(jsonItem)));
}
````

[Back to top](#adapter-pattern)

### Exemple avec une api retournant la liste des pays

*country.model.ts*

````typescript
export interface Adapter<T> {
  adapt(item: any): T
}

export class Country {
  constructor(
    public name?: string,
    public code?: string
  ) { }
}

````

*country-adapter.service.ts*

````typescript
import { Adapter, Country } from './../../models/country.model';
import { Injectable } from "@angular/core";

@Injectable({
  providedIn: "root"
})

export class CountryAdapter implements Adapter<Country> {
  adapt(item: any): Country {
    return new Country(item?.name?.common, item?.cca2);
  }
}
````

*country-helper.service.ts*

````typescript
import { CountryAdapter } from './country-adapter.service';
import { BehaviorSubject, map, tap, Observable } from 'rxjs';
import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Country } from '../../models/country.model';

const API_ENDPOINT = 'https://restcountries.com/v3.1/all';

@Injectable({
  providedIn: 'root'
})

export class CountryHelperService {

  private countries$ = new BehaviorSubject<Country[]>([]);

  constructor(
    private http: HttpClient,
    private adapter: CountryAdapter) { }

  get countries(): Observable<Country[]> {
    return this.countries$.value.length > 0 ? this.countries$.asObservable() : this.fetchCountries();
  }

  private fetchCountries(): Observable<Country[]> {
    return this.http.get<any[]>(API_ENDPOINT)
      .pipe(
        map((data: any[]) =>
          data.map((item) => this.adapter.adapt(item))
        ),
        tap(countries => this.countries$.next(countries)
      ));
  }
}
````
[Back to top](#adapter-pattern)
