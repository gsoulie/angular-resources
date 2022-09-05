import { Action } from "@ngrx/store";
import { User } from "../user.model";

export const ADD_USER = '[User] Add user';
export const UPDATE_USER = '[User] Update user';
export const DELETE_USER = '[User] Delete user';
export const INIT_USERS = '[User] Initialize users';

export class InitUsers implements Action {
  readonly type: string = INIT_USERS;

  constructor(public payload: User[]) {}
}
export class AddUser implements Action {
  readonly type: string = ADD_USER;

  constructor(public payload: User) { }
}

export class DeleteUser implements Action {
  readonly type: string = DELETE_USER;

  constructor(public payload: User) { }
}

export class UpdateUser implements Action {
  readonly type: string = UPDATE_USER;

  constructor(public payload: User) { }
}

// exporter un nouveau type contenant les différents type d'actions
export type UserActions = InitUsers | AddUser | DeleteUser | UpdateUser;
