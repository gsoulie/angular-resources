import { ActionReducerMap } from '@ngrx/store';
import * as fromUser from '../../components/users/ngrx-store/users.reducer';

// définition d'un state global comprenant l'ensemble des sous-state
export interface AppGlobalState {
  userState: fromUser.State;
  //authState: AuthState;
  //productState: ProductState etc...
}

// Définition du reducer global de l'application
export const globalReducer: ActionReducerMap<AppGlobalState> = {
  userState: fromUser.usersReducer,
  //authState: fromAuth.authReducer etc...
}
