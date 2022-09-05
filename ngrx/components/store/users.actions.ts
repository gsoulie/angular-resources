import { Action } from "@ngrx/store";
import { User } from "../user.model";

export const ADD_USER = '[User] ADD_USER';
export const UPDATE_USER = '[User] UPDATE_USER';
export const DELETE_USER = '[User] DELETE_USER';
export const INIT_USERS = '[User] INIT_USERS';

export class InitUsers implements Action {
  readonly type = INIT_USERS;
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
export type UserActions = InitUsers | AddUser | DeleteUser | UpdateUser;
