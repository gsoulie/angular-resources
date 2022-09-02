import { User } from '../user.model';
import * as UsersReducerActions from './users.actions';

// définition d'un state en particulier
export interface CustomState {
  users: User[];
  toto?: number;
}

// définition d'un state global comprenant l'ensemble des sous-state
export interface AppGlobalState {
  userState: CustomState;
  //productState: ProductState etc...
}

const initialState: CustomState = {
  users: [{id: 0, name: 'Admin'}] // possibilité d'ajouter des dummy data ici
}

export function usersReducer(state: CustomState = initialState, action: UsersReducerActions.UserActions) {
  switch (action.type) {
    case UsersReducerActions.ADD_USER:
      return {
        ...state, // BONNE PRATIQUE : copier le contenu de l'ancien state. évite de perdre des données en route
        users: [...state.users, action.payload]
      };

    case UsersReducerActions.DELETE_USER:
      const userIdToDelete = action.payload as User;
      return {
        ...state,
        users: state.users.filter(u => u.id !== userIdToDelete.id)
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
