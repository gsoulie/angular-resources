[< Back to main Menu](https://github.com/gsoulie/Mobile-App-Development/blob/master/angular-sheet.md)    

# Pipes    

* [Introduction](#introduction)     
* [Curstom Pipe](#custom-pipe)    
* [Using pipe with ngFor](#using-pipe-with-ngfor)    

## Introduction
[Back to top](#pipes) 

By default, many pipes are available with Angular, you can found them here : https://angular.io/api?type=pipe

Ex : UpperCase pipe : ```{{ myValue | uppercase }}```

### How to set a pipe

Ex : Set options to the Angular : https://angular.io/api/common/DatePipe

```
{{ myDate | datepipe:’fullDate’ }}
{{ recipe.name | slice:1:4 }}
```

### Chaining pipes

It is possible to chain multiple pipes by simply separate them with ```|```. **Be careful** the order will applied from left to right.

```
{{ myDate | datepipe:’fullDate’ | uppercase}}
```

## Custom Pipe
[Back to top](#pipes) 

**guideline** : It is recommended to create a 'pipes' directory which contains one file for each pipes.

```ng g pipe pipes/my-custom-pipe```

*my-custom-pipe.ts*

```
import { PipeTransform, Pipe } from '@angular/core';
 
@Pipe({
   name: 'mycustompipe'
})
export class MyCustomPipe implements PipeTransform {
   /**
    * Pipe simple sans arguments
    * @param value
    */
   transform(value: any) {
       return 'Hello ' + value;
   }
}
```

Then import your pipe into the *app.module.ts* file :

*app.module.ts*

```
@NgModule({
 declarations: [
   ...,
   MyCustomPipe
 ],
 ```

**Usage**

```
<h4>{{ recipe.name | mycustompipe }}</h4>
```

**Pipe with parameters**

```
@Pipe({
   name: 'shorten'
})
export class ShortenPipe implements PipeTransform {
 
   transform(value: any, limit: number) {
       if (value.length > limit) {
           return value.substr(0, limit) + ' ...';
       }
       return value;
   }
}
```

```
<h4>{{ recipe.name | shorten:5 }}</h4>
```

## Using pipe with ngFor
[Back to top](#pipes) 

In the follwing example, we are using a pipe to find elements in a list like with a searchbar :

*filterpipe.ts*

```
@Pipe({
   name: 'filter'
})
export class FilterPipe implements PipeTransform {
   /**
    * Pipe simple sans arguments
    * @param value
    */
   transform(value: any, filterString: string, propName: string) {
 
       // Aucun filtre saisi ?
       if (value.length === 0 || filterString === '') {
           return value;
       }
 
       const resultArray = [];
       for (const item of value) {
           if (item[propName] === filterString) {
               resultArray.push(item);
           }
       }
       return resultArray;
   }
}
```

Then you can use your pipe on ```ngFor```

```
<input type="text" [(ngModel)]="filteredStatus">
<li *ngFor="let server of servers | filter:filteredStatus:'status'">
   {{ server.name }} {{ server.status }}
</li>
```

### Limitations

Angular **do not trigger the pipe anymore** after the dataset is updated !! If you filter the dataset and add or update items, these are not refreshed.
This Angular's behaviour prevent memory leaks.

But...You can manually force your pipe triggering, but be aware of memory leaks possibility

Just add ```pure: false``` to your pipe

```
@Pipe({
   name: 'mycustompipe',
   pure: false
})
```
