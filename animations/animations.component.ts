import { trigger, state, style, animate, transition } from '@angular/animations';
import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-animations',
  templateUrl: './animations.component.html',
   styles: [`
    .animatedDiv {
      width: 100px;
      height: 100px;
    }
  `],
  standalone: true,
  animations: [
    trigger('divState', [
      state('normal', style({
        backgroundColor: 'lightgreen',
        transform: 'translateX(0)'
      })),
      state('highlighted', style({
        backgroundColor: 'coral',
        transform: 'translateX(200px) rotate(45deg)',
        borderRadius: '100%'
      })),
      transition('normal <=> highlighted',
        animate(500)),
      // transition('normal => highlighted',
      //   animate(500)),
      // transition('highlighted => normal',
      //   animate(300))
    ]),
    trigger('wildState', [
      state('normal', style({
        backgroundColor: 'lightblue',
        transform: 'translateX(0) scale(1)'
      })),
      state('highlighted', style({
        backgroundColor: 'coral',
        transform: 'translateX(200px) rotate(45deg) scale(1)',
        borderRadius: '100%'
      })),
      state('shrunken', style({
        backgroundColor: 'yellow',
        transform: 'translateX(0px) scale(0.5)',
      })),
      transition('normal <=> highlighted', animate(800)),
      transition('shrunken <=> *', animate(800)),
    ])
  ]
})
export class AnimationsComponent {

  stateBind = 'normal';
  wildState = 'normal';

  constructor() { }

  onAnimate() {
    this.stateBind == 'normal' ? this.stateBind = 'highlighted' : this.stateBind = 'normal';
    this.wildState == 'normal' ? this.wildState = 'highlighted' : this.wildState = 'normal';
  }

  onShrink() {
    this.wildState = 'shrunken';
  }
}
