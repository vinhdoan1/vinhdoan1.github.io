import { Injectable }    from '@angular/core';
import { Headers, Http } from '@angular/http';

import 'rxjs/add/operator/toPromise';

import { TripCity } from './trip-city';

@Injectable()
export class TripCityService {
    
    private citiesUrl = 'app/cities';  // URL to web api

    constructor(private http: Http) { }
   
    getCities(): Promise<TripCity[]> {
        return this.http.get(this.citiesUrl)
            .toPromise()
            .then(response => response.json().data)
            .catch(this.handleError);
    }

    getCity(id: number) {
        return this.getCities()
            .then(cities => cities.filter(city => city.id === id)[0]);
    }

    save(city: TripCity): Promise<TripCity> {
        if (city.id) {
            return this.put(city);
        }
        return this.post(city);
    }

    delete(city: TripCity) {
        let headers = new Headers();
        headers.append('Content-Type', 'application/json');

        let url = `${this.citiesUrl}/${city.id}`;

        return this.http
            .delete(url, headers)
            .toPromise()
            .catch(this.handleError);
    }

    deleteAll(cities: TripCity[]) {
        let headers = new Headers();
        headers.append('Content-Type', 'application/json');

        var urlTail = '';
        for (var i = 1; i < cities.length; i++) {
            urlTail += cities[i].id + ',';
        }
        urlTail += cities[0].id;

        let url = `${this.citiesUrl}/${urlTail}`;
        alert(url);
        return this.http
            .delete(url, headers)
            .toPromise()
            .catch(this.handleError);
    }

    
    // Add new City
    private post(city: TripCity): Promise<TripCity> {
        let headers = new Headers({
            'Content-Type': 'application/json'
        });

        return this.http
            .post(this.citiesUrl, JSON.stringify(city), { headers: headers })
            .toPromise()
            .then(res => res.json().data)
            .catch(this.handleError);
    }

    // Update existing City
    private put(city: TripCity) {
        let headers = new Headers();
        headers.append('Content-Type', 'application/json');

        let url = `${this.citiesUrl}/${city.id}`;

        return this.http
            .put(url, JSON.stringify(city), { headers: headers })
            .toPromise()
            .then(() => city)
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