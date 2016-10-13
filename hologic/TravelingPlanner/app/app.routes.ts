import { provideRouter, RouterConfig }  from '@angular/router';

import { DashboardComponent } from './dashboard.component';
import { HeroesComponent } from './heroes.component';
import { HeroDetailComponent } from './hero-detail.component';
import { PlanTripComponent } from './plan-trip.component';
import { TripsComponent } from './trips.component';



export const routes: RouterConfig = [
  {
    path: '',
    redirectTo: '/trips',
    terminal: true
  },
  {
    path: 'dashboard',
    component: DashboardComponent
  },
  {
    path: 'detail/:id',
    component: HeroDetailComponent
  },
  {
    path: 'heroes',
    component: HeroesComponent
  },
  {
      path: 'plan',
      component: PlanTripComponent
  },
  {
      path: 'trips',
      component: TripsComponent
  },
  {
      path: 'plan/:id',
      component: PlanTripComponent
  },
];

export const APP_ROUTER_PROVIDERS = [
  provideRouter(routes)
];


/*
Copyright 2016 Google Inc. All Rights Reserved.
Use of this source code is governed by an MIT-style license that
can be found in the LICENSE file at http://angular.io/license
*/