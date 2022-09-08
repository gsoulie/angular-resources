import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { trigger, state, style, animate, transition } from '@angular/animations';
import { Component } from '@angular/core';

@Component({
  selector: 'app-animations',
  templateUrl: './animations.component.html',
  styleUrls: ['./animations.component.scss'],
  standalone: true,
  imports: [ FormsModule, CommonModule],
  animations: [
    trigger('list1', [
      state('in', style({ // ajout de l'élément dans le dom
        opacity: 1,
        transform: 'translateX(0)'
      })),

      /* void est un état particulier permettant de gérer l'état ou l'élément n'est pas encore dans le DOM.
      On veut animer de l'état "inexistant" à "existant dans le dom"*/
      transition('void => *', [
        style({
          opacity: 0,
          transform: 'translateX(-100px)'
        }),
        animate(300)
      ]),
      transition('* => void', [
        animate(300, style({
          opacity: 0,
          transform: 'translateX(100px)'
        }),)
      ]),
    ]),
  ]
})
export class ItemsComponent {

  items = ['Orange', 'Apple'];
  newItem = '';

  constructor() { }

  addItem() {
    if (this.newItem === '') { return }
    this.items.push(this.newItem);
  }

  removeItem(idx) { this.items.splice(idx, 1); }
}
