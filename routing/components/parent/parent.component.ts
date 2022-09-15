import { RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';

@Component({
  selector: 'app-parent',
  template: `
    <h1 class="title">Parent</h1>
    <button [routerLink]="['/home']">Back to Home</button>
    <button [routerLink]="['child']">Go to child</button>
    <router-outlet></router-outlet>
  `,
  styles: ['h1 { color:red }'],
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
  ]
})
export class ParentComponent {
  constructor() { }
}

