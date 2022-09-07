import { Injectable } from '@angular/core';
import * as fromApp from '../../shared/store/app.reducer'
import { Store } from '@ngrx/store';
import * as UserActions from './ngrx-store/users.actions';

@Injectable({
  providedIn: 'root'
})
export class UserDataService {

  constructor(private store: Store<fromApp.AppGlobalState>) { }

  fetchUsers() {
    this.store.dispatch(UserActions.fetchUsers());
    
    // Ancienne syntaxe ci-dessous -->
    //this.store.dispatch(new UserActions.FetchUsers());
  }
}
