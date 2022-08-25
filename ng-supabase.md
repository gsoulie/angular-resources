[< Back to main Menu](https://github.com/gsoulie/angular-resources/blob/master/ng-sheet.md)    

# Supabase

* [Présentation](#présentation)     
* [Full tutorial](#full-tutorial)     
* [Configuration](#configuration)     
* [Service authentification](#service-authentification)     
* [Requêtage](#requêtage)     

## Présentation

Supabase est un concurrent de Firebase avec quelques différences tout de même. La différence majeure est que Supabase s'appuie sur postgreSQL au lieu d'une base de données orienté document (key-value) pour Firebase.

Avantages :       

postgreSQL       
requêtage SQL     
jusqu'à 4x plus performant que Firebase (key-value)      
Authentifications tiers (google, facebook, twitter...)       
Storage comme Firebase      

sources :     
      
https://supabase.com/docs/guides/with-angular           
https://www.youtube.com/watch?v=pl9XfIWutKE&ab_channel=SimonGrimm       

````npm i @supabase/supabase-js````

## Full tutorial

Tutorial de Simon Grimm : https://supabase.com/blog/building-a-realtime-trello-board-with-supabase-and-angular     

## Configuration


*environment.ts*

````typescript
export const environment = {
  production: false,
  supabaseUrl: 'YOUR_SUPABASE_URL',
  supabaseKey: 'YOUR_SUPABASE_KEY',
}
````

## Service authentification

*supabase.service.ts*

````typescript
import { environment } from './../../../environments/environment.prod';
import { Injectable } from '@angular/core';
import {
  AuthChangeEvent,
  createClient,
  Session,
  SupabaseClient,
} from '@supabase/supabase-js'

export interface Profile {
  username: string
  website: string
  avatar_url: string
}

@Injectable({
  providedIn: 'root',
})
export class SupabaseService {
  
  constructor(private supabase: SupabaseClient) {
    this.supabase = createClient(
      environment.supabaseUrl,
      environment.supabaseKey
    )
  }

  get user() {
    return this.supabase.auth.user()
  }

  get session() {
    return this.supabase.auth.session()
  }

  get profile() {
    return this.supabase
      .from('profiles')
      .select(`username, website, avatar_url`)
      .eq('id', this.user?.id)
      .single()
  }

  authChanges(
    callback: (event: AuthChangeEvent, session: Session | null) => void
  ) {
    return this.supabase.auth.onAuthStateChange(callback)
  }

  signIn(email: string) {
    return this.supabase.auth.signIn({ email })
  }

  signOut() {
    return this.supabase.auth.signOut()
  }

  updateProfile(profile: Profile) {
    const update = {
      ...profile,
      id: this.user?.id,
      updated_at: new Date(),
    }

    return this.supabase.from('profiles').upsert(update, {
      returning: 'minimal', // Don't return the value after inserting
    })
  }

  downLoadImage(path: string) {
    return this.supabase.storage.from('avatars').download(path)
  }

  uploadAvatar(filePath: string, file: File) {
    return this.supabase.storage.from('avatars').upload(filePath, file)
  }
}

````

[Back to top](#supabase)      

## Requêtage

Exemple de service permettant le requêtage simple. Voir la doc pour plus de complexité.

*data.service.ts*

````typescript
import { environment } from './../../../environments/environment.prod';
import { Injectable } from '@angular/core';
import {
  createClient,
  SupabaseClient,
} from '@supabase/supabase-js'
import { Restaurant } from '../models/restaurant';
import { from, Observable } from 'rxjs';
import { map } from 'rxjs/operators';

const TBL_RESTAURANTS = 'restaurants';

@Injectable({
  providedIn: 'root',
})
export class SupabaseService {
  private supabase: SupabaseClient	// <--- IMPORTANT !! Ne pas mettre la déclaration dans le constructeur sinon erreur provider

  constructor() {
    this.supabase = createClient(
      environment.supabaseUrl,
      environment.supabaseKey
    )
  }

  // fetch classique en mode promise
  async getRestaurants() {
    return await this.supabase
    .from<Restaurant>(TBL_RESTAURANTS)
    .select('*');
    //.limit(10)
  }

  // fetch en mode observable
  getRestaurantsObservable(): Observable<Restaurant[]> {

    return from(this.supabase
      .from<Restaurant>(TBL_RESTAURANTS)
      .select('*')
    ).pipe(
      map(r => r.data)
    );
  }

  // fetch en mode observable
  filteringRestaurantsWithObservable(name: string): Observable<Restaurant[]> {
    console.log('filtering', name);

    return from(this.supabase
      .from<Restaurant>(TBL_RESTAURANTS)
      .select('*')
      .ilike('name', `%${name}%`) // !!! --> ilike est non case-sensitive c'est ce qu'il faut sur un champ de recherche
      .order('name')
    )
    .pipe(
      map(r => r.data)
    );
  }

  // fetch en mode observable
  getRestaurantById(id: number): Observable<Restaurant> {
    return from(
      this.supabase
      .from<Restaurant>(TBL_RESTAURANTS)
      .select('*')
      .eq('id', id)
      .limit(1)
      .single()
    )
    .pipe(
      map(r => r.data)
    );
  }

  async addRestaurant(newRestaurant: Restaurant) {
    const { data, error } = await this.supabase
    .from<Restaurant>(TBL_RESTAURANTS)
    .insert(newRestaurant);
    return { data, error }
  }
}
````

[Back to top](#supabase)      
