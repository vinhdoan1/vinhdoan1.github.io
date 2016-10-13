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
var router_1 = require('@angular/router');
var trip_city_1 = require('./trip-city');
var trip_1 = require('./trip');
var trip_service_1 = require('./trip.service');
var PlanTripComponent = (function () {
    function PlanTripComponent(route, tripService, router) {
        this.route = route;
        this.tripService = tripService;
        this.router = router;
        this.tripName = '';
        this.close = new core_1.EventEmitter();
        this.addingCity = true;
        this.cityButton = 'Add City';
        this.tripButton = 'Add Trip';
        this.oldName = '';
        this.oldDuration = '';
    }
    PlanTripComponent.prototype.ngOnInit = function () {
        var _this = this;
        this.city = new trip_city_1.TripCity();
        this.sub = this.route.params.subscribe(function (params) {
            if (params['id'] !== undefined) {
                var id = +params['id'];
                _this.tripButton = 'Edit Trip';
                _this.tripService.getTrip(id)
                    .then(function (trip) {
                    _this.trip = trip;
                    _this.cities = _this.trip.cities;
                    _this.tripName = _this.trip.name;
                });
            }
            else {
                _this.trip = new trip_1.Trip();
                _this.cities = [];
                _this.tripName = _this.trip.name;
            }
        });
    };
    PlanTripComponent.prototype.ngOnDestroy = function () {
        this.sub.unsubscribe();
    };
    PlanTripComponent.prototype.addEditCity = function (event) {
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
            this.city = new trip_city_1.TripCity();
        }
        else {
            this.cityButton = 'Add City';
            this.city = new trip_city_1.TripCity();
            this.addingCity = true;
        }
    };
    PlanTripComponent.prototype.clearAllCities = function (event) {
        this.cities = new Array();
    };
    PlanTripComponent.prototype.beginEditCity = function (city, event) {
        this.city = city;
        var copyCity = Object.assign({}, city);
        this.oldDuration = copyCity.duration;
        this.oldName = copyCity.name;
        this.cityButton = 'Edit City';
        this.addingCity = false;
    };
    PlanTripComponent.prototype.cancelEditCity = function (event) {
        this.cityButton = 'Add City';
        this.city.duration = this.oldDuration;
        this.city.name = this.oldName;
        this.city = new trip_city_1.TripCity();
        this.addingCity = true;
    };
    PlanTripComponent.prototype.goBack = function () {
        var link = ['/trips'];
        this.router.navigate(link);
    };
    PlanTripComponent.prototype.addTrip = function () {
        var _this = this;
        if (this.tripName == '') {
            alert('Enter Trip Name');
            return;
        }
        if (this.cities.length == 0) {
            alert('Add Cities to Trip!');
            return;
        }
        this.setThisTrip();
        this.tripService
            .save(this.trip)
            .then(function (res) {
            var link = ['/trips'];
            _this.router.navigate(link);
        });
        //this.close.emit(this.trip);
        // if (this.navigated) { window.history.back(); }
    };
    PlanTripComponent.prototype.deleteCity = function (city, event) {
        this.cities = this.cities.filter(function (c) { return c !== city; });
        if (this.city.id == city.id) {
            this.cancelEditCity(null);
        }
    };
    PlanTripComponent.prototype.setThisTrip = function () {
        this.trip.name = this.tripName;
        this.trip.cities = this.cities;
    };
    __decorate([
        core_1.Input(), 
        __metadata('design:type', trip_1.Trip)
    ], PlanTripComponent.prototype, "trip", void 0);
    __decorate([
        core_1.Output(), 
        __metadata('design:type', Object)
    ], PlanTripComponent.prototype, "close", void 0);
    PlanTripComponent = __decorate([
        core_1.Component({
            selector: 'my-plan-trip',
            templateUrl: 'app/plan-trip.component.html',
            styleUrls: ['app/plan-trip.component.css']
        }), 
        __metadata('design:paramtypes', [router_1.ActivatedRoute, trip_service_1.TripService, router_1.Router])
    ], PlanTripComponent);
    return PlanTripComponent;
}());
exports.PlanTripComponent = PlanTripComponent;
//# sourceMappingURL=plan-trip.component.js.map