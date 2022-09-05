import { User } from '../user.model';
import * as UsersReducerActions from './users.actions';

// définition d'un state en particulier
export interface State {
  users: User[];
  isLoading: boolean;
}

const initialState: State = {
  users: [], // possibilité d'ajouter des dummy data ici
  isLoading: false
}

export function usersReducer(state: State = initialState, action: UsersReducerActions.UserActions) {
  switch (action.type) {
    case UsersReducerActions.FETCH_USERS:
      return {
        ...state,
        isLoading: true
      }

    case UsersReducerActions.SET_USERS:
      return {
        ...state,
        isLoading: false,
        users: [...state.users, ...action.payload]
      }

    case UsersReducerActions.ADD_USER:
      return {
        ...state, // BONNE PRATIQUE : copier le contenu de l'ancien state. évite de perdre des données en route
        users: [...state.users, action.payload]
      };

    case UsersReducerActions.DELETE_USER:
      return {
        ...state,
        users: state.users.filter(u => u.id !== action.payload.id)
      };

    case UsersReducerActions.UPDATE_USER:
      const userIdToUpdate = action.payload as User;
      // récupérer l'item à modifier provenant de l'ancien state
      const user = state.users.find(u => u.id === userIdToUpdate.id);

      const newUser = {
        ...user,
        ...action.payload
      }

      let updatedUsers = [...state.users]; // nouveau tableau qui est une copie de l'ancien state
      updatedUsers = updatedUsers.map(u => u.id === userIdToUpdate.id ? newUser : u);  // mise à jour du nouvel élément

      return {
        ...state,
        users: updatedUsers
      };

    default:
      return state;
  }
}
