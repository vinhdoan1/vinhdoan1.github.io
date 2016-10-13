"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var core_1 = require('@angular/core');
var http_1 = require('@angular/http');
require('rxjs/add/operator/toPromise');
var TripCityService = (function () {
    function TripCityService(http) {
        this.http = http;
        this.citiesUrl = 'app/cities'; // URL to web api
    }
    TripCityService.prototype.getCities = function () {
        return this.http.get(this.citiesUrl)
            .toPromise()
            .then(function (response) { return response.json().data; })
            .catch(this.handleError);
    };
    TripCityService.prototype.getCity = function (id) {
        return this.getCities()
            .then(function (cities) { return cities.filter(function (city) { return city.id === id; })[0]; });
    };
    TripCityService.prototype.save = function (city) {
        if (city.id) {
            return this.put(city);
        }
        return this.post(city);
    };
    TripCityService.prototype.delete = function (city) {
        var headers = new http_1.Headers();
        headers.append('Content-Type', 'application/json');
        var url = this.citiesUrl + "/" + city.id;
        return this.http
            .delete(url, headers)
            .toPromise()
            .catch(this.handleError);
    };
    TripCityService.prototype.deleteAll = function (cities) {
        var headers = new http_1.Headers();
        headers.append('Content-Type', 'application/json');
        var urlTail = '';
        for (var i = 1; i < cities.length; i++) {
            urlTail += cities[i].id + ',';
        }
        urlTail += cities[0].id;
        var url = this.citiesUrl + "/" + urlTail;
        alert(url);
        return this.http
            .delete(url, headers)
            .toPromise()
            .catch(this.handleError);
    };
    // Add new City
    TripCityService.prototype.post = function (city) {
        var headers = new http_1.Headers({
            'Content-Type': 'application/json'
        });
        return this.http
            .post(this.citiesUrl, JSON.stringify(city), { headers: headers })
            .toPromise()
            .then(function (res) { return res.json().data; })
            .catch(this.handleError);
    };
    // Update existing City
    TripCityService.prototype.put = function (city) {
        var headers = new http_1.Headers();
        headers.append('Content-Type', 'application/json');
        var url = this.citiesUrl + "/" + city.id;
        return this.http
            .put(url, JSON.stringify(city), { headers: headers })
            .toPromise()
            .then(function () { return city; })
            .catch(this.handleError);
    };
    TripCityService.prototype.handleError = function (error) {
        console.error('An error occurred', error);
        return Promise.reject(error.message || error);
    };
    TripCityService = __decorate([
        core_1.Injectable(), 
        __metadata('design:paramtypes', [http_1.Http])
    ], TripCityService);
    return TripCityService;
}());
exports.TripCityService = TripCityService;
/*
Copyright 2016 Google Inc. All Rights Reserved.
Use of this source code is governed by an MIT-style license that
can be found in the LICENSE file at http://angular.io/license
*/ 
//# sourceMappingURL=trip-city.service.js.map