import { Injectable }    from '@angular/core';
import { Headers, Http } from '@angular/http';

import 'rxjs/add/operator/toPromise';

import { TripCity } from './trip-city';
import { Trip } from './trip';


@Injectable()
export class TripService {

    private tripsUrl = 'app/trips';  // URL to web api

    constructor(private http: Http) { }

    getTrips(): Promise<Trip[]> {
        return this.http.get(this.tripsUrl)
            .toPromise()
            .then(response => response.json().data)
            .catch(this.handleError);
    }

    getTrip(id: number) {
        return this.getTrips()
            .then(trips => trips.filter(trips => trips.id === id)[0]);
    }

    save(trip: Trip): Promise<Trip> {
        if (trip.id) {
            return this.put(trip);
        }
        return this.post(trip);
    }

    delete(trip: Trip) {
        let headers = new Headers();
        headers.append('Content-Type', 'application/json');

        let url = `${this.tripsUrl}/${trip.id}`;

        return this.http
            .delete(url, headers)
            .toPromise()
            .catch(this.handleError);
    }

    // Add new City
    private post(trip: Trip): Promise<Trip> {
        let headers = new Headers({
            'Content-Type': 'application/json'
        });

        return this.http
            .post(this.tripsUrl, JSON.stringify(trip), { headers: headers })
            .toPromise()
            .then(res => res.json().data)
            .catch(this.handleError);
    }

    // Update existing City
    private put(trip: Trip) {
        let headers = new Headers();
        headers.append('Content-Type', 'application/json');

        let url = `${this.tripsUrl}/${trip.id}`;

        return this.http
            .put(url, JSON.stringify(trip), { headers: headers })
            .toPromise()
            .then(() => trip)
            .catch(this.handleError);
    }

    private handleError(error: any) {
        console.error('An error occurred', error);
        return Promise.reject(error.message || error);
    }

}



/*
Copyright 2016 Google Inc. All Rights Reserved.
Use of this source code is governed by an MIT-style license that
can be found in the LICENSE file at http://angular.io/license
*/