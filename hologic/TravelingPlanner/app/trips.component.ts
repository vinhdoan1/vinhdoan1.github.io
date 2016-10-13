import { Component, EventEmitter, Input, OnInit, OnDestroy, Output } from '@angular/core';

import { ActivatedRoute, Router } from '@angular/router';
import { TripCity }                from './trip-city';
import { Trip }                from './trip';
import { TripService } from './trip.service';
import { HeroService }         from './hero.service';


@Component({
    selector: 'my-trips',
    templateUrl: 'app/trips.component.html',
    styleUrls: ['app/trips.component.css']
})
export class TripsComponent implements OnInit {

    error: any;
    trips: Trip[];

    constructor(
        private router: Router,
        private tripService: TripService
    ) {
    }


    ngOnInit() {
        this.getTrips();
    }

    getTrips() {
        this.tripService
            .getTrips()
            .then(trips => this.trips = trips)
            .catch(error => this.error = error);
    }

    gotoEditTrip(trip: Trip) {
        let link = ['/plan', trip.id];
        this.router.navigate(link);
    }

    deleteTrip(trip: Trip, event: any) {
        event.stopPropagation();
        this.tripService
            .delete(trip)
            .then(res => {
                this.trips = this.trips.filter(t => t !== trip);
            })
            .catch(error => this.error = error);
    }
}