[< Back to main Menu](https://github.com/gsoulie/angular-resources/blob/master/ng-sheet.md)    

# ViewChild

Permet de contrôler un élément de la vue, depuis le controller

````
@ViewChild('userForm', {static: true}) monUserForm: NgForm;
//{static: true/false} => Avoir le droit d'y accéder avant (true) ou après (false) que la vue ne soit prête
````

[Back to top](#viewchild)
