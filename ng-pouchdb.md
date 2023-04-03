[< Back to main Menu](https://github.com/gsoulie/angular-resources/blob/master/ng-sheet.md)    

# PouchDB

Tutorial : https://pouchdb.com/getting-started.html

## Installation

````
npm install pouchdb --save

// Server installation
npm i couchdb
npm i -g pouchdb-server

// Running server
pouchdb-server -p <PORT_NUMBER>
````

## Activation CORS

````
npm install -g add-cors-to-couchdb

// ===> outdated ?
add-cors-to-couchdb

// Or if your database is not at 127.0.0.1:5984:
add-cors-to-couchdb http://me.example.com -u myusername -p mypassword
````

On peut vérifier si les règles CORS sont bien activée en allant sur (like http://127.0.0.1:<PORT>/\_utils), et on devrait voir les configurations suivantes dans **configuration/Main config**

| section | option      | value                                                                                   |
| ------- | ----------- | --------------------------------------------------------------------------------------- |
| cors    | credentials | true                                                                                    |
|         | headers     | accept, accept-language, content-language, content-type, Authorization, Origin, Referer |
|         | methods     | GET, HEAD, POST, PUT, DELETE, COPY                                                      |
|         | origins     | \*                                                                                      |


## Exécuter l'application

````
// Run the app
ng serve -o --port <PORT>

// Run pouchdb-server
pouchdb-server -p <PORT>

// Accessing Server dashboard
http://localhost:<PORT>/_utils
````

## Exemple
  
*Helper*
  
````typescript
import { Injectable } from "@angular/core";
import PouchDB from 'pouchdb';

export type User = {
  name: string,
  age: number
}

export type UserResponse = {
  _id: string,
  _rev: string,
  age: number,
  name: string
}

const DB_NAME = 'users';
const REMOTE_COUCH = `http://localhost:5984/${DB_NAME}`;//'http://user:pass@myname.example.com/todos';

@Injectable({
  providedIn: 'root'
})

export class PouchDbHelperService {
  private _db: PouchDB.Database<{}>;
  private remoteCouch = REMOTE_COUCH;

  constructor() {
    this._db = this.createDatabase(DB_NAME);
  }

  get db() { return this._db }

  fetchUsers() {
    return this._db.allDocs({ include_docs: true, descending: true });
  }

  fetchUserById(id: string) {
    return this._db.get(id);
  }

  createUser(user: User) {
    //return this._db.post(user);
    return this._db.put({ ...user, _id: new Date().toISOString()/*self.crypto.randomUUID()*/ })
  }

  destroyDb() {
    return this._db.destroy();
  }

  bulkUsers(count: number) {
    let bulkUsers: any[] = [];
    for (let i = 0; i < count; i++) {
      bulkUsers.push({ _id: self.crypto.randomUUID(), name: 'user_' + i, age: i })
    }

    this._db.bulkDocs(bulkUsers).then(function (result) {
      console.log('bulk result', result)
    }).catch(function (err) {
      console.log(err);
    });
  }

  updateUser(user: UserResponse) {
    return this._db.put(user);
  }

  /**
   * Remarque : le document est marqué comme supprimé mais toujours visible dans la base.
   * Il faut attendre le "compactage" de la base ( selon paramétrage de la base) ou le forcer manuellement pour
   * voir disparaître le document
   * @param user
   * @returns
   */
  deleteUser(user: UserResponse) {
    return this._db.remove(user._id, user._rev);
  }

  synchronize(syncErrorCallback: () => void) {

    const opts = { live: true };
    this._db.replicate.to(this.remoteCouch, opts, syncErrorCallback);
    this._db.replicate.from(this.remoteCouch, opts, syncErrorCallback);
  }

  private createDatabase(dbName: string = 'test') {
    return new PouchDB(dbName);
  }
}
````
  
  
*Composant*
  
````typescript
import { PouchDbHelperService, User, UserResponse } from './../../shared/services/core/pouchDbHelper.service';
import { CommonModule } from '@angular/common';
import { Component, Inject, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { DOCUMENT } from '@angular/common';

@Component({
  selector: 'app-users',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule
  ],
  template: `
  <div id="main_wrapper">
    <button (click)="bulkInsert()">Bulk insert</button>&nbsp;
    <button (click)="deleteDatabase()" class="btn-danger">Delete db</button>
    <div id="title_wrapper">
      <h2>PouchDB POC {{ port ? '[port: ' + port + ']' : ''}}</h2>
      <div #syncWrapper id="sync-wrapper">
        <div class="info_toast" id="sync-success" *ngIf="syncEnabled">Currently syncing</div>
        <div class="info_toast" id="sync-error" *ngIf="syncError">There was a problem syncing</div>
      </div>
    </div>

    <div id="form">
      <input type="text" placeholder="username" [(ngModel)]="newUser.name" />
      <input type="number" placeholder="age" [(ngModel)]="newUser.age" />
      <button (click)="addUser()">Add user</button>
    </div>

    <div class="users_container">
      <div *ngFor="let u of users; trackBy: trackUserId" class="users_container__wrapper">
        <div class="users_container__wrapper__userInfo">
          <span><b>id : </b>{{ u._id }}</span>
          <span><b>Nom : </b><input type="text" [(ngModel)]="u.name"/></span>
          <span><b>age : </b><input type="number" [(ngModel)]="u.age"/></span>
        </div>
        <div id="users_container__action__div">
          <button (click)="deleteUser(u)" class="btn-action btn-danger">Delete</button>&nbsp;
          <button (click)="updateUser(u)" class="btn-action btn-success">Save</button>
        </div>
      </div>
    </div>

  </div>

  `,
  styles: [
    `
      #main_wrapper {
        padding: 10px;
      }
      #title_wrapper {
        display: flex;
        align-items: center;
        flex-wrap: wrap;
      }
      #form {
        background-color: #e3e3e3;
        padding: 10px;
        display: grid;
        grid-template-columns: 1fr;
        grid-gap: 10px;
        border-radius: 5px;
      }

      @media screen and (min-width: 530px){
        #main_wrapper {
        padding: 20px;
      }
        #form {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
        }
      }
      input {
        padding: 5px 10px;
        line-height: 25px;
        font-size: 14px;
        font-weight: 500;
        font-family: inherit;
        border-radius: 6px;
        -webkit-appearance: none;
        color: var(--input-color);
        border: 1px solid var(--input-border);
        background: var(--input-background);
        transition: border .3s ease;
        &::placeholder {
            color: var(--input-placeholder);
        }
        &:focus {
          outline: none;
          border-color: var(--input-border-focus);
        }
      }

      .users_container__wrapper__userInfo {
        display: flex;
        flex-direction: column;

        span {
          padding: 5px 0;
        }
      }
      #users_container__action__div {
        display: flex;
        justify-content: flex-end;
      }
      .info_toast {
        margin-left: 10px;
        padding: 5px 10px;
        border-radius: 10px;
        font-size: 10px;
        text-transform: uppercase;
      }
      #sync-success {
        background-color: #c1ffdb;
        border: 1px solid #96d3af;
      }

      #sync-error {
        background-color: #fcbaba;
        border: 1px solid #d89393;
      }

      [data-sync-state=syncing] #sync-success {
        display: block;
      }

      [data-sync-state=error] #sync-error {
        display: block;
      }
    `
  ]
})

export class UsersComponent implements OnInit {

  users: UserResponse[] = [];
  newUser: User = { name: '', age: 0 };
  syncEnabled = false;
  syncError = false;
  port = '';

  constructor(private pouchDbHelper: PouchDbHelperService,
    @Inject(DOCUMENT) private document: any) {
    this.port = this.document.location.port;
  }

  ngOnInit() {
    this.fetchUsers();
    this.initializeApp();
  }

  bulkInsert() {
    this.pouchDbHelper.bulkUsers(50);
  }

  deleteDatabase() {
    this.pouchDbHelper.destroyDb()
      .then((res) => console.log('destroyeed', res))
      .catch((e) => console.log('destroy error', e))
  }

  trackUserId(index: number, user: UserResponse) { return user._id; }

  private initializeApp() {
    this.initializeDataOnChangesObservable();
    this.sync();
  }

  private initializeDataOnChangesObservable() {

    //this.classicOnChangeObservable();

    this.optimizedOnChangeObservable();
  }

  private optimizedOnChangeObservable() {
    const db = this.pouchDbHelper.db;

    db.changes({
      since: 'now',
      live: true,
      include_docs: true
    }).on('change', (change) => {
      // réception de chaque élément modifié
      const userFoundIndex = this.users.findIndex(u => u._id === change.id);

      if (change.deleted) {
        this.users.splice(userFoundIndex, 1);
      } else {

        if (userFoundIndex >= 0) {
          this.users[userFoundIndex] = change.doc as UserResponse;
        } else {
          // Nouvel élément
          this.users.push(change.doc as UserResponse)
        }
      }

      console.log('changes', change)
    }).on('complete', (info) => {
      // changes() was canceled
      console.log('complete', info)
    }).on('error', (err) => {
      console.log(err);
    });
  }

  /**
   * Fait un fetch de toute la base à chaque réception d'une modification
   * non optimisé
   */
  private classicOnChangeObservable() {
    const db = this.pouchDbHelper.db;
    db.changes({
      since: 'now',
      live: true,
    }).on('change', () => {
      console.log('change detected')
      this.fetchUsers.bind(this)();
    })

  }

  private sync() {
    this.syncEnabled = true;
    this.pouchDbHelper.synchronize(this.synchronizationError.bind(this))
  }

  private synchronizationError() {
    this.syncEnabled = false;
    this.syncError = true;
  }

  fetchUsers() {
    this.pouchDbHelper.fetchUsers()
      .then(res => {
        this.users = res.rows.map(row => row.doc) as UserResponse[];
        console.log(this.users);
      })
      .catch(console.log)
  }

  addUser() {
    this.pouchDbHelper.createUser({
      name: this.newUser.name,
      age: this.newUser.age
    })
      .then(res => {
        console.log('user ajouté', res);
        this.resetUserFields();
      })
      .catch(console.log)
  }

  deleteUser(u: UserResponse) {
    if (!confirm(`Êtes-vous certain de vouloir supprimer l'utilisateur ${u.name} ?`)) {
      return;
    }
    this.pouchDbHelper.deleteUser(u)
      .catch(console.log);
  }

  updateUser(u: UserResponse) {
    this.pouchDbHelper.updateUser(u)
      .then(console.log)
      .catch(console.log);
  }

  getUserById(id: string) {
    this.pouchDbHelper.fetchUserById(id)
      .then(res => console.log('user', res));
  }

  private resetUserFields() {
    this.newUser.name = '';
    this.newUser.age = 0;
  }
}

````
