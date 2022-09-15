import { ParentComponent } from './parent.component';
import { Route } from '@angular/router';
import { ChildComponent } from './../child/child.component';

export const STANDALONE_ROUTES: Route[] = [
  {
    path: '',
    component: ParentComponent,
    children: [
      { path: 'child', component: ChildComponent }
    ]
  },
];
