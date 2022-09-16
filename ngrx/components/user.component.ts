import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { map, Observable } from 'rxjs';
import { UserDataService } from './user-data.service';
import { Component, OnInit } from '@angular/core';
import { Store } from '@ngrx/store';
import { User } from './user.model';
import { UsersActions } from './ngrx-store/users.actions';
import * as fromApp from '../../shared/store/app.reducer';

@Component({
  selector: 'app-users',
  templateUrl: './users.component.html',
  styleUrls: ['./users.component.scss'],
  standalone: true,
  imports: [
    CommonModule,
    FormsModule
  ]
})
export class UsersComponent implements OnInit {
  username = '';
  usersStore$: Observable<User[]>; // usage NgRx
  isLoading$: Observable<boolean>;

  constructor(
    private dataService: UserDataService,
    private store: Store<fromApp.AppGlobalState>) { }

  ngOnInit(): void {
    // usage NgRx
    this.usersStore$ = this.store.select('userState')
      .pipe(map(state => state.users));

    this.isLoading$ = this.store.select('userState')
      .pipe(map(state => state.isLoading));

    this.dataService.fetchUsers();

  }
  addUser() {
    if (this.username === '') { return; }
    const newUser: User = { id: Date.now(), name: this.username };

    // usage NgRx
    this.store.dispatch(UsersActions.add_user({ payload: newUser }));
    
    // Ancienne syntaxe ci-dessous -->
    //this.store.dispatch(new UsersReducerActions.AddUser(newUser));

    this.username = '';
  }

  deleteUser(user: User) {
    // usage NgRx
    this.store.dispatch(UsersActions.delete_user({ payload: user }));
    
    // Ancienne syntaxe ci-dessous -->
    //this.store.dispatch(new UsersReducerActions.DeleteUser(user));
  }

  updateUser(user: User) {
    const updatedUser: User = { id: user.id, name: user.name + ' (updated)' };

    // usage NgRx
    this.store.dispatch(UsersActions.update_user({ payload: updatedUser }));
    
    // Ancienne syntaxe ci-dessous -->
    //this.store.dispatch(new UsersReducerActions.UpdateUser(updatedUser));
  }
}
