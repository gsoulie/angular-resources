import { createReducer, on } from '@ngrx/store';
import { User } from '../user.model';
import * as UsersReducerActions from './users.actions';

// définition d'un state en particulier
export interface State {
  users: User[];
  isLoading: boolean;
}

const initialState: State = {
  users: [{
    id: 1, name: 'Guillaume'
  }], // possibilité d'ajouter des dummy data ici
  isLoading: false
}

export const usersReducer = createReducer(
  initialState,
  on(
    UsersReducerActions.fetchUsers,
    (state) => ({
      ...state, // BONNE PRATIQUE : copier le contenu de l'ancien state. évite de perdre des données en route
      isLoading: false
    })
  ),
  on(
    UsersReducerActions.setUsers,
    (state, action) => ({
      ...state,
      isLoading: false,
      users: [...action.payload]
    })
  ),
  on(
    UsersReducerActions.addUser,
    (state, action) => ({
      ...state,
      users: [...state.users, action.payload]
    })
  ),
  on(
    UsersReducerActions.deleteUser,
    (state, action) => ({
      ...state,
      users: state.users.filter(u => u.id !== action.payload.id)
    })
  ),
  on(
    UsersReducerActions.updateUser,
    (state, action) => ({
      ...state,
      users: state.users.map(u => u.id === action.payload.id ? { ...action.payload } : u)
    })
  )
);
