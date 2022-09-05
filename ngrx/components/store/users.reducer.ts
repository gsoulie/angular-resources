import { User } from '../user.model';
import * as UsersReducerActions from './users.actions';

// définition d'un state en particulier
export interface State {
  users: User[];
  //toto?: number;
}

const initialState: State = {
  users: [{id: 0, name: 'Admin'}] // possibilité d'ajouter des dummy data ici
}

export function usersReducer(state: State = initialState, action: UsersReducerActions.UserActions) {
  switch (action.type) {
    case UsersReducerActions.INIT_USERS:
      return {
        ...state,
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
