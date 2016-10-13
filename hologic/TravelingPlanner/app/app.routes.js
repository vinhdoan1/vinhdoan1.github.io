"use strict";
var router_1 = require('@angular/router');
var dashboard_component_1 = require('./dashboard.component');
var heroes_component_1 = require('./heroes.component');
var hero_detail_component_1 = require('./hero-detail.component');
var plan_trip_component_1 = require('./plan-trip.component');
var trips_component_1 = require('./trips.component');
exports.routes = [
    {
        path: '',
        redirectTo: '/trips',
        terminal: true
    },
    {
        path: 'dashboard',
        component: dashboard_component_1.DashboardComponent
    },
    {
        path: 'detail/:id',
        component: hero_detail_component_1.HeroDetailComponent
    },
    {
        path: 'heroes',
        component: heroes_component_1.HeroesComponent
    },
    {
        path: 'plan',
        component: plan_trip_component_1.PlanTripComponent
    },
    {
        path: 'trips',
        component: trips_component_1.TripsComponent
    },
    {
        path: 'plan/:id',
        component: plan_trip_component_1.PlanTripComponent
    },
];
exports.APP_ROUTER_PROVIDERS = [
    router_1.provideRouter(exports.routes)
];
/*
Copyright 2016 Google Inc. All Rights Reserved.
Use of this source code is governed by an MIT-style license that
can be found in the LICENSE file at http://angular.io/license
*/ 
//# sourceMappingURL=app.routes.js.map