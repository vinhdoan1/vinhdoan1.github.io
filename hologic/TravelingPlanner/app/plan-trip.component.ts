import { Component, EventEmitter, Input, OnInit, OnDestroy, Output } from '@angular/core';

import { ActivatedRoute, Router } from '@angular/router';
import { TripCity }                from './trip-city';
import { Trip }                from './trip';
import { TripCityService } from './trip-city.service';
import { TripService } from './trip.service';



@Component({
    selector: 'my-plan-trip',
    templateUrl: 'app/plan-trip.component.html',
    styleUrls: ['app/plan-trip.component.css']
})
export class PlanTripComponent implements OnInit, OnDestroy {
    tripName = '';
    @Input() trip: Trip;
    @Output() close = new EventEmitter();

    error: any;
    sub: any;
    addingCity = true;

    city: TripCity;
    cityButton = 'Add City';
    tripButton = 'Add Trip';
    cities: TripCity[];

    oldName = '';
    oldDuration = '';


    constructor(
        private route: ActivatedRoute,
        private tripService: TripService,
        private router: Router
        ) {
    }

    ngOnInit() {
        this.city = new TripCity();
        
        this.sub = this.route.params.subscribe(params => {
            if (params['id'] !== undefined) {
                let id = +params['id'];
                this.tripButton = 'Edit Trip';
                this.tripService.getTrip(id)
                    .then(trip => {
                        this.trip = trip;
                        this.cities = this.trip.cities;
                        this.tripName = this.trip.name;
                    });
               
            } else {
                this.trip = new Trip();
                this.cities = [];
                this.tripName = this.trip.name;
            }
        });
    }

    ngOnDestroy() {
        this.sub.unsubscribe();
    }

    addEditCity(event: any) {

        if (this.city.name == '' || this.city.name == null) {
            alert('Enter City Name');
            return;
        }

        if (this.city.duration == '' || this.city.duration == null) {
            alert('Enter Duration');
            return;
        }


        if (this.addingCity) {
            event.stopPropagation();

            this.cities = this.cities.concat(this.city);
            this.city = new TripCity();
        }
        else {
            this.cityButton = 'Add City';
            this.city = new TripCity();
            this.addingCity = true;
        }
    }

    clearAllCities(event: any) {
        this.cities = new Array<TripCity>();
    }

    beginEditCity(city: TripCity, event: any) {
        this.city = city;
        var copyCity = Object.assign({}, city);
        this.oldDuration = copyCity.duration;
        this.oldName = copyCity.name;

        this.cityButton = 'Edit City';
        this.addingCity = false;

    }

    cancelEditCity(event: any) {
        this.cityButton = 'Add City';
        this.city.duration = this.oldDuration;
        this.city.name = this.oldName;
        this.city = new TripCity();
        this.addingCity = true;
    }



    goBack() {
        let link = ['/trips'];
        this.router.navigate(link);
    } 

    addTrip() {
        if (this.tripName == '') {
            alert('Enter Trip Name');
            return;
        }

        if (this.cities.length == 0) {
            alert('Add Cities to Trip!');
            return;
        }

        this.setThisTrip()

        this.tripService
            .save(this.trip)
            .then(res => {
                let link = ['/trips'];
                this.router.navigate(link);
            })

        //this.close.emit(this.trip);
       // if (this.navigated) { window.history.back(); }
    } 

    deleteCity(city: TripCity, event: any) {
        this.cities = this.cities.filter(c => c !== city);
        if (this.city.id == city.id) {
            this.cancelEditCity(null);
        }
    }

    setThisTrip() {
        this.trip.name = this.tripName;
        this.trip.cities = this.cities;
    }

}
