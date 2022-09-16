import { Injectable } from '@angular/core';
import * as fromApp from '../../shared/store/app.reducer'
import { Store } from '@ngrx/store';
import { UsersActions } from "./ngrx-store/users.actions";

@Injectable({
  providedIn: 'root'
})
export class UserDataService {

  constructor(private store: Store<fromApp.AppGlobalState>) { }

  fetchUsers() {
    this.store.dispatch(UsersActions.fetch_users());
    
    // Ancienne syntaxe ci-dessous -->
    //this.store.dispatch(new UserActions.FetchUsers());
  }
}
