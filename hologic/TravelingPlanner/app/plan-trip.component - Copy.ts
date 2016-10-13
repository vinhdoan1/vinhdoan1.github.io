import { Component, EventEmitter, Input, OnInit, OnDestroy, Output } from '@angular/core';

import { ActivatedRoute } from '@angular/router';
import { TripCity }                from './trip-city';
import { Trip }                from './trip';
import { TripCityService } from './trip-city.service';
import { TripService } from './trip.service';



@Component({
    selector: 'my-plan-trip',
    templateUrl: 'app/plan-trip.component.html',
})
export class PlanTripComponent implements OnInit, OnDestroy {
    tripName = '';
    @Input() trip: Trip;
    @Output() close = new EventEmitter();

    error: any;
    sub: any;
    navigated = false; // true if navigated here
    addingCity = true;

    city: TripCity;
    cityButton = 'Add City';
    tripButton = 'Add Trip';
    cities: TripCity[];

    oldName = '';
    oldDuration = '';


    constructor(
        private route: ActivatedRoute,
        private tripCityService: TripCityService,
        private tripService: TripService
        ) {
    }

    ngOnInit() {
        this.getCities();
        this.city = new TripCity();
        
        this.sub = this.route.params.subscribe(params => {
            if (params['id'] !== undefined) {
                let id = +params['id'];
                this.navigated = true;
                this.tripService.getTrip(id)
                    .then(trip => {
                        this.trip = trip;
                        this.cities = this.trip.cities;
                        this.tripName = this.trip.name;
                    });
               
            } else {
                this.navigated = false;
                this.trip = new Trip();
                this.cities = this.trip.cities;
                this.tripName = this.trip.name;
               // this.hero = new Hero();
            }
        });
    }

    ngOnDestroy() {
      //  this.sub.unsubscribe();
    }

    save() {
        this.tripCityService
            .save(this.city)
            .then(city => {
                this.city = city; // saved hero, w/ id if new
                this.cities = this.cities.filter(c => c !== city);
            })

            .catch(error => this.error = error); // TODO: Display error message
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
            this.tripCityService
                .save(this.city)
                .then(city => {

                    this.cities = this.cities;
                    // this.goBackc(city);
                    this.cities = this.cities.concat(city);
                })
                .catch(error => this.error = error); // TODO: Display error message *
            this.city = new TripCity();
        }
        else {
            this.tripCityService
                .save(this.city);
            this.cityButton = 'Add City';
            this.city = new TripCity();
            this.addingCity = true;
        }
    }

    clearAllCities(event: any) {
        event.stopPropagation();
       
            this.tripCityService
                .deleteAll(this.cities)
                .then(res => {
                    this.cities = new Array<TripCity>();
                })
                .catch(error => this.error = error);
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



    goBackc(savedCity: TripCity = null) {
        this.close.emit(savedCity);
        window.history.back();
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

        //this.close.emit(this.trip);
       // if (this.navigated) { window.history.back(); }
    } 

    ////////////////

    getCities() {
        this.tripCityService
            .getCities()
            .then(cities => this.cities = cities)
            .catch(error => this.error = error);
    }

    /*
    close(savedCity: TripCity) {
        this.addingCity = false;
        if (savedCity) { this.getCities(); }
    } */

    deleteCity(city: TripCity, event: any) {
        event.stopPropagation();
        this.tripCityService
            .delete(city)
            .then(res => {
                this.cities = this.cities.filter(c => c !== city);
                if (this.city.id == city.id) {
                    this.cancelEditCity(null);
                }

            })
            .catch(error => this.error = error);
    }

    setThisTrip() {
        this.trip.name = this.tripName;
        this.trip.cities = this.cities;
    }

}
