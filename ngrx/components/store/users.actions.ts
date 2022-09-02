import { Action } from "@ngrx/store";
import { User } from "../user.model";

export const INIT_USER = 'INIT_USER';
export const ADD_USER = 'ADD_USER';
export const UPDATE_USER = 'UPDATE_USER';
export const DELETE_USER = 'DELETE_USER';

export class InitUsers implements Action {
  readonly type: string = INIT_USER;
  constructor(public payload: User[]) { }
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
