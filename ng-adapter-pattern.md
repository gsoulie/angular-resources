[< Back to main Menu](https://github.com/gsoulie/Mobile-App-Development/blob/master/angular-formation.md)    

# Adapter pattern

Le Model Adapter Pattern permet de simplifier le code des retours d'observable et aussi de respecter la pratique du DRY (Don't repeat yourself)

https://florimond.dev/blog/articles/2018/09/consuming-apis-in-angular-the-model-adapter-pattern/

Le but est de simplifier le code suivant : 

*course.model.ts*
````
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
````
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

En utilisant un Adapter : 


*course.model.ts*
````
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
````
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
````
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

[Back to top](#adapter-pattern)
