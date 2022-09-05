import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { HomeComponent } from './components/home/home.component';
import { HttpClientModule } from '@angular/common/http';
import { StoreModule } from '@ngrx/store';
import { EffectsModule } from '@ngrx/effects';
import * as fromApp from './shared/store/app.reducer';
import { DataEffects } from './components/users/ngrx-store/data.effects';
import { UserEffects } from './components/users/ngrx-store/users.effects';

@NgModule({
  declarations: [
    AppComponent,
    HomeComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    FormsModule,
    HttpClientModule,
    StoreModule.forRoot(fromApp.globalReducer), // <-- NgRx import reducer
    EffectsModule.forRoot([UserEffects, DataEffects]) // <-- import des effects
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
