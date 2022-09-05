import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable, tap } from 'rxjs';
import { Injectable } from '@angular/core';
import { User } from './user.model';
import * as fromApp from '../../shared/store/app.reducer'
import * as UserActions from './ngrx-store/users.actions';
import { Store } from '@ngrx/store';

@Injectable({
  providedIn: 'root'
})
export class UserDataService {

  private usersSubject$ = new BehaviorSubject<User[]>([]);
  users$: Observable<User[]> = this.usersSubject$.asObservable();

  constructor(private http: HttpClient, private store: Store<fromApp.AppGlobalState>) { }

  fetchUsers(): Observable<User[]> {
    return this.http.get<User[]>('/assets/data.json')
      .pipe(
        tap({
          res => this.usersSubject$.next(res)
          this.store.dispatch(new UserActions.InitUsers(res));
        })
      );
  }

  addUser(user: User) {
    const users = this.usersSubject$.value;
    users.push(user);
    this.usersSubject$.next(users);
  }

  deleteUser(id) {
    const users = this.usersSubject$.value;
    const index = users.findIndex(p => p.id === id);

    if (index >= 0) {
      users.splice(index, 1);
      this.usersSubject$.next(users);
    }
  }

  updateUser(user: User) {
    let users = this.usersSubject$.value;
    users = users.map(u => u.id !== user.id ? u : user);
    this.usersSubject$.next(users);
  }
}
