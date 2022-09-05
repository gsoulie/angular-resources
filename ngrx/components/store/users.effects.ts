import { User } from '../user.model';
import { HttpClient } from '@angular/common/http';
import { Actions, ofType, createEffect } from "@ngrx/effects";
import * as UserActions from './users.actions';
import { map } from 'rxjs';
import { switchMap } from 'rxjs/operators';
import { Injectable } from '@angular/core';

@Injectable()
export class UserEffects {

  constructor(
    private actions$: Actions,
    private http: HttpClient) { }

  fetchData$ = createEffect((): any => {
    return this.actions$.pipe(
      ofType(UserActions.FETCH_USERS),
      switchMap(() => this.getUsers() ),
      map(users => {
        return users.map(user => {
          return {
            ...user
          }
        })
      }),
      map(users => new UserActions.SetUsers(users))
    )
  });

  getUsers() { return this.http.get<User[]>('/assets/data.json'); }


}
