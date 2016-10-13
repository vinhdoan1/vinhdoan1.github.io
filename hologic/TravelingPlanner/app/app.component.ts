import { Component }          from '@angular/core';
import { ROUTER_DIRECTIVES }  from '@angular/router';
import { TripCityService } from './trip-city.service';
import { TripService } from './trip.service';



@Component({
  selector: 'my-app',

  template: `
    <h1>{{title}}</h1>
    <nav>
      <a [routerLink]="['/trips']" routerLinkActive="active">All Trips</a>
      <a [routerLink]="['/plan']" routerLinkActive="active">New Trip</a>
    </nav>
    <router-outlet></router-outlet>
  `,
  styleUrls: ['app/app.component.css'],
  directives: [ROUTER_DIRECTIVES],
  providers: [
      TripCityService, TripService
  ]
})
export class AppComponent {
  title = 'TRAVEL PLANNER';
}


/*
Copyright 2016 Google Inc. All Rights Reserved.
Use of this source code is governed by an MIT-style license that
can be found in the LICENSE file at http://angular.io/license
*/