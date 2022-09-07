import { createAction, props } from "@ngrx/store";
import { User } from "../user.model";

const ADD_USER = '[User] Add user';
const UPDATE_USER = '[User] Update user';
const DELETE_USER = '[User] Delete user';
const FETCH_USERS = '[User] Fetch users';
const SET_USERS = '[User] Set users';

export const fetchUsers = createAction(FETCH_USERS);
export const setUsers = createAction(SET_USERS, props<{ payload: User[] }>())
export const addUser = createAction(ADD_USER, props<{ payload: User }>());
export const deleteUser = createAction(DELETE_USER, props<{ payload: User }>());
export const updateUser = createAction(UPDATE_USER, props<{ payload: User }>());
