import { Component } from '@angular/core';

@Component({
  selector: 'app-child',
  template: `<h1>Child component</h1>`,
  styles: [],
  standalone: true
})
export class ChildComponent {
  constructor() { }
}
