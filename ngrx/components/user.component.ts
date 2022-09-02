import { CustomState } from './ngrx-store/users.reducer';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { Observable } from 'rxjs';
import { UserDataService } from './user-data.service';
import { Component, OnInit } from '@angular/core';
import { TitleStrategy } from '@angular/router';
import { Store } from '@ngrx/store';
import { User } from './user.model';
import * as UsersReducerActions from './ngrx-store/users.actions';
import * as fromUser from './ngrx-store/users.reducer';

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
  usersStore$: Observable<{ users: User[] }>; // usage NgRx
  users$: Observable<any[]>;  // usage classique

  constructor(
    private dataService: UserDataService,
    private store: Store<fromUser.AppGlobalState>) { }

  ngOnInit(): void {
    // usage NgRx
    this.usersStore$ = this.store.select('userState');

    // usage classique
    this.users$ = this.dataService.fetchUsers();
  }
  addUser() {
    if (this.username === '') { return; }
    const newUser: User = { id: Date.now(), name: this.username };

    // usage NgRx
    this.store.dispatch(new UsersReducerActions.AddUser(newUser));

    // usage classic
    this.dataService.addUser(newUser);
    this.username = '';
  }

  deleteUser(user: User) {
    // usage NgRx
    this.store.dispatch(new UsersReducerActions.DeleteUser(user));

    // usage classique
    this.dataService.deleteUser(user.id);
  }

  updateUser(user: User) {
    const updatedUser: User = { id: user.id, name: user.name + ' (updated)' };

    // usage NgRx
    this.store.dispatch(new UsersReducerActions.UpdateUser(updatedUser));
  }
}
