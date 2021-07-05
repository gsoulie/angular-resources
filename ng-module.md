[< Back to main Menu](https://github.com/gsoulie/angular-resources/blob/master/ng-sheet.md)    

# Modules
      
## Séparation

Une bonne pratique consiste à créer des fichiers module pour chaque "type" d'élément. Par exemple un fichier *components.module.ts*, *directive.module.ts* etc... Afin de rendre plus claire l'import de module dans le cas d'une très grosse application.

Voici quelques exemples :

*app.module.ts*

````typescript
@NgModule({
  declarations: [
    AppComponent,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    AppMaterialModule,
    AppComponentsModule
  ],
  providers: [{
    provide: APP_INITIALIZER,
    useFactory: initConfig,
    deps: [AppconfigService],
    multi: true
  }],
  bootstrap: [AppComponent]
})
export class AppModule { }
````

*component.module.ts*

````typescript
import { FlexLayoutModule } from '@angular/flex-layout';
import { TypescriptComponent } from './components/typescript/typescript.component';
import { WelcomeComponent } from './components/welcome/welcome.component';
import { AsyncDataComponent } from './components/observable/asynchronous/async-data/async-data.component';
import { NgModule } from '@angular/core';

@NgModule({
    imports: [
        FlexLayoutModule,
    ],
    declarations: [
        AsyncDataComponent,
        WelcomeComponent,
        TypescriptComponent,        
    ],
    exports: [
        AsyncDataComponent,
        WelcomeComponent,
        TypescriptComponent,
    ]
})
export class AppComponentsModule { }
````

*directive.module.ts*

````typescript
import { CdkDetailRowDirective } from './components/test/cdk-detail-row.directive';
import { CardContentDirective } from './directive/card-content.directive';
import { CardNavDirective } from './directive/card-nav.directive';
import { ColorDirective } from './directive/color.directive';
import { CardBorderDirective } from './directive/card-border.directive';
import { DefaultImagePipe } from './shared/pipes/default-image.pipe';
import { AvatarDirective } from './directive/avatar.directive';
import { ClickableDirective } from './directive/clickable.directive';
import { NgModule } from '@angular/core';
@NgModule({
    imports: [

    ],
    declarations: [
        CdkDetailRowDirective,
        CardContentDirective,
        CardNavDirective,
        ColorDirective,
        CardBorderDirective,
        DefaultImagePipe,
        AvatarDirective,
        ClickableDirective
    ],
    exports: [
        CdkDetailRowDirective,
        CardContentDirective,
        CardNavDirective,
        ColorDirective,
        CardBorderDirective,
        DefaultImagePipe,
        AvatarDirective,
        ClickableDirective
    ]
})
export class DirectivesModule { }
````

*material.mocule.ts*

````typescript
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MatSortModule } from '@angular/material/sort';
import { MatTableModule } from '@angular/material/table';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatChipsModule } from '@angular/material/chips';
import { MatNativeDateModule } from '@angular/material/core';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatDialogModule } from '@angular/material/dialog';
import { MatExpansionModule } from '@angular/material/expansion';
import { MatGridListModule } from '@angular/material/grid-list';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatListModule } from '@angular/material/list';
import { MatMenuModule } from '@angular/material/menu';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatSelectModule } from '@angular/material/select';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatStepperModule } from '@angular/material/stepper';
import { MatSlideToggleModule } from '@angular/material/slide-toggle'
import { MatSliderModule } from '@angular/material/slider';
import { MatDividerModule } from '@angular/material/divider';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { MatBadgeModule } from '@angular/material/badge';
import { MatButtonToggleModule } from '@angular/material/button-toggle';

@NgModule({
  exports: [
    FormsModule,
    BrowserAnimationsModule,
    ReactiveFormsModule,
    MatIconModule,
    MatButtonModule,
    MatInputModule,
    MatAutocompleteModule,
    MatChipsModule,
    MatListModule,
    MatGridListModule,
    MatExpansionModule,
    MatToolbarModule,
    MatProgressSpinnerModule,
    MatDialogModule,
    MatTooltipModule,
    MatMenuModule,
    MatCardModule,
    MatSelectModule,
    MatCheckboxModule,
    MatTableModule,
    MatNativeDateModule,
    MatDatepickerModule,
    MatSortModule,
    MatStepperModule,
    MatSlideToggleModule,
    MatSliderModule,
    MatDividerModule,
    MatProgressBarModule,
    MatBadgeModule,
    MatButtonToggleModule
  ]
})
export class AppMaterialModule { }

````

[Back to top](#modules)
