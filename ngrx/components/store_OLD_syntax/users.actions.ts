import { Action } from "@ngrx/store";
import { User } from "../user.model";

export const ADD_USER = '[User] Add user';
export const UPDATE_USER = '[User] Update user';
export const DELETE_USER = '[User] Delete user';
export const FETCH_USERS = '[User] Fetch users';
export const SET_USERS = '[User] Set users';

export class FetchUsers implements Action {
  readonly type = FETCH_USERS;
}
export class SetUsers implements Action {
  readonly type = SET_USERS;

  constructor(public payload: User[]) {}
}

export class AddUser implements Action {
  readonly type = ADD_USER;

  constructor(public payload: User) { }
}

export class DeleteUser implements Action {
  readonly type = DELETE_USER;

  constructor(public payload: User) { }
}

export class UpdateUser implements Action {
  readonly type = UPDATE_USER;

  constructor(public payload: User) { }
}

// exporter un nouveau type contenant les différents type d'actions
export type UserActions = FetchUsers | SetUsers | AddUser | DeleteUser | UpdateUser;
