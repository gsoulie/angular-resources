import { User } from '../user.model';
import { HttpClient } from '@angular/common/http';
import { Actions, ofType, createEffect } from "@ngrx/effects";
import * as UserActions from './users.actions';
import { EMPTY, map } from 'rxjs';
import { catchError, mergeMap, switchMap } from 'rxjs/operators';
import { Injectable } from '@angular/core';

@Injectable()
export class UserEffects {

  constructor(
    private actions$: Actions,
    private http: HttpClient) { }

  // ATTENTION : reset le dataset à chaque fetch car les données sont statiques et ne proviennent pas d'une vraie API
  // dont les données seraient mises à jour lors du CRUD
  fetchUsers$ = createEffect((): any => this.actions$.pipe(
    ofType(UserActions.fetchUsers),
    mergeMap(() => this.getUsers()
      .pipe(
        map((users: User[]) => (UserActions.setUsers({ payload: users }))),
        catchError(() => EMPTY)
      )
    )
  ));

  getUsers() { return this.http.get<User[]>('/assets/data.json'); }
