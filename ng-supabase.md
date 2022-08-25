[< Back to main Menu](https://github.com/gsoulie/angular-resources/blob/master/ng-sheet.md)    

# Supabase

* [Présentation](#présentation)     
* [Full tutorial](#full-tutorial)     
* [Configuration](#configuration)     
* [Service authentification](#service-authentification)     
* [Requêtage](#requêtage)     
* [Realtime](#realtime)     

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

### Exemples de CRUD

````typescript
// CRUD Board
  async getBoardInfo(boardId: string) {
    return await this.supabase
      .from(BOARDS_TABLE)
      .select('*')
      .match({ id: boardId })
      .single();
  }

  async updateBoard(board: any) {
    return await this.supabase
      .from(BOARDS_TABLE)
      .update(board)
      .match({ id: board.id });
  }

  async deleteBoard(board: any) {
    return await this.supabase
      .from(BOARDS_TABLE)
      .delete()
      .match({ id: board.id });
  }

  // CRUD Lists
  async getBoardLists(boardId: string) {
    const lists = await this.supabase
      .from(LISTS_TABLE)
      .select('*')
      .eq('board_id', boardId)
      .order('position');

    return lists.data || [];
  }

  async addBoardList(boardId: string, position = 0) {
    return await this.supabase
      .from(LISTS_TABLE)
      .insert({ board_id: boardId, position, title: 'New List' })
      .select('*')
      .single();
  }

  async updateBoardList(list: any) {
    return await this.supabase
      .from(LISTS_TABLE)
      .update(list)
      .match({ id: list.id });
  }

  async deleteBoardList(list: any) {
    return await this.supabase
      .from(LISTS_TABLE)
      .delete()
      .match({ id: list.id });
  }

  // CRUD Cards
  async addListCard(listId: string, boardId: string, position = 0) {
    return await this.supabase
      .from(CARDS_TABLE)
      .insert(
        { board_id: boardId, list_id: listId, position }
      )
      .select('*')
      .single();
  }

  async getListCards(listId: string) {
    const lists = await this.supabase
      .from(CARDS_TABLE)
      .select('*')
      .eq('list_id', listId)
      .order('position');

    return lists.data || [];
  }

  async updateCard(card: any) {
    return await this.supabase
      .from(CARDS_TABLE)
      .update(card)
      .match({ id: card.id });
  }

  async deleteCard(card: any) {
    return await this.supabase
      .from(CARDS_TABLE)
      .delete()
      .match({ id: card.id });
  }
````

[Back to top](#supabase)      

## Realtime

### Activation

Pour activer le *Realtime* il suffit d'aller dans le menu **Table editor**, de sélectionner la table sur laquelle on souhaite activer le realtime, de faire *edit* et cocher l'option **Enable Realtime** puis *Save*

### Implémentation

Création d'un *Subject* dans le service data

*data.service.ts*

````typescript
/**
   * Activation REALTIME
   * @returns 
   */
  getTableChanges() {
    const changes = new Subject();

    this.supabase
      .from(CARDS_TABLE)
      .on('*', (payload: any) => {
        changes.next(payload);
      })
      .subscribe();

    this.supabase
      .from(LISTS_TABLE)
      .on('*', (payload: any) => {
        changes.next(payload);
      })
      .subscribe();

    return changes.asObservable();
  }
````

Ecoute dans les composants :

*board.component.ts*

````typescript
handleRealtimeUpdates() {
    this.dataService.getTableChanges().subscribe((update: any) => {
      const record = update.new?.id ? update.new : update.old;
      const event = update.eventType;

      if (!record) return;

      if (update.table == 'cards') {
        if (event === 'INSERT') {
          this.listCards[record.list_id].push(record);
        } else if (event === 'UPDATE') {
          const newArr = [];

          for (let card of this.listCards[record.list_id]) {
            if (card.id == record.id) {
              card = record;
            }
            newArr.push(card);
          }
          this.listCards[record.list_id] = newArr;
        } else if (event === 'DELETE') {
          this.listCards[record.list_id] = this.listCards[
            record.list_id
          ].filter((card: any) => card.id !== record.id);
        }
      } else if (update.table == 'lists') {
        // TODO
      }
    });
  }
````

[Back to top](#supabase)      
