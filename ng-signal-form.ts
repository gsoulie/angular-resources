import { Component, OnInit, signal } from "@angular/core";
import { MatError, MatFormField, MatHint, MatLabel } from "@angular/material/form-field";
import { MatInput } from "@angular/material/input";
import { ChipsComponent } from "../chips/chips.component";
import { debounce, email, Field, form, minLength, required, schema, Schema } from "@angular/forms/signals";

interface UserForm {
  name: string,
  email: string,
  password: string,
  age: number | null,
  notifications: boolean
}

@Component({
    selector: 'app-ng-21-form',
    imports: [MatFormField, MatInput, MatError, MatHint, MatLabel, ChipsComponent, Field],
    template: `
    <div class="form-card">

        <h2>Signal Form</h2>
        <form (submit)="handleSubmit($event)">
            <mat-form-field appearance="fill">
                <mat-label for="name">Name</mat-label>
                <input matInput id="name" type="string" [field]="userForm.name" />
            </mat-form-field>
            @for (error of userForm.name().errors(); track $index) {
                <div class="error">{{error.message}}</div>        
            }
    
            <mat-form-field appearance="fill">
                <mat-label for="email">Email</mat-label>
                <input matInput id="email" type="email" [field]="userForm.email" />
            </mat-form-field>
            @for (error of userForm.email().errors(); track $index) {
                <div class="error">{{error.message}}</div>        
            }
            
            <mat-form-field appearance="fill">
                <mat-label for="password">Password</mat-label>
                <input matInput id="password" type="password" [field]="userForm.password" />
            </mat-form-field>
            @for (error of userForm.password().errors(); track $index) {
                <div class="error">{{error.message}}</div>        
            }
    
            <!-- <mat-checkbox [field]="userForm.notifications">Receive notifications</mat-checkbox> -->
    
            <label>
                <input type="checkbox" [field]="userForm.notifications" />
                Notifications
            </label>
    
            <button [style.marginTop]="'20px'" type="submit" [disabled]="userForm().submitting() || !userForm().valid()">Submit user</button>
            </form>
    </div>
    `,
    styles: `
    form {
       display: flex;
        flex-direction: column;
        width: 300px;
    }
    .form-card {
        background: #f0f0f0;
        border-radius: 10px;
        padding: 20px;
    }
    `
})

export class Ng21Form implements OnInit {
    /**
     * Form Model
     **/
    userModel = signal<UserForm>({
        name: '',
        email: '',
        password: '',
        age: null,
        notifications: false
    });

    /**
     *  Form Validation Schema
     **/
    userSchema: Schema<UserForm> = schema((schemaPath) => {
        required(schemaPath.name);
        minLength(schemaPath.name, 5, {
            message: 'User name must be at least 5 characters',
        });

        debounce(schemaPath.email, 500);
        required(schemaPath.email, { message: 'Email is required' });
        email(schemaPath.email, { message: 'Please enter a valid email address' }); 

        required(schemaPath.password);
        minLength(schemaPath.password, 8, {
            message: 'User password must be at least 8 characters',
        });
    })

    /**
     * Form declaration
     **/
    userForm = form(this.userModel, this.userSchema)

    /**
     * Form declaration alternative with integrated schema
     */
    // userForm = form(this.userModel, (schemaPath) => {
    //     required(schemaPath.name);
    //     minLength(schemaPath.name, 5, {
    //         message: 'User name must be at least 5 characters',
    //     });

    //     debounce(schemaPath.email, 500);
    //     required(schemaPath.email, { message: 'Email is required' });
    //     email(schemaPath.email, { message: 'Please enter a valid email address' }); 

    //     required(schemaPath.password);
    //     minLength(schemaPath.password, 8, {
    //         message: 'User password must be at least 8 characters',
    //     });
    // });

    ngOnInit(): void {
        this.userForm.email().value.set('jdoe@cia.com')
    }
    
    handleSubmit(event: Event) {
        event.preventDefault();
        console.log('name :', this.userForm.name().value())
        console.log('email :', this.userForm.email().value())
    }
}
