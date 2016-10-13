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
var trip_service_1 = require('./trip.service');
var TripsComponent = (function () {
    function TripsComponent(router, tripService) {
        this.router = router;
        this.tripService = tripService;
    }
    TripsComponent.prototype.ngOnInit = function () {
        this.getTrips();
    };
    TripsComponent.prototype.getTrips = function () {
        var _this = this;
        this.tripService
            .getTrips()
            .then(function (trips) { return _this.trips = trips; })
            .catch(function (error) { return _this.error = error; });
    };
    TripsComponent.prototype.gotoEditTrip = function (trip) {
        var link = ['/plan', trip.id];
        this.router.navigate(link);
    };
    TripsComponent.prototype.deleteTrip = function (trip, event) {
        var _this = this;
        event.stopPropagation();
        this.tripService
            .delete(trip)
            .then(function (res) {
            _this.trips = _this.trips.filter(function (t) { return t !== trip; });
        })
            .catch(function (error) { return _this.error = error; });
    };
    TripsComponent = __decorate([
        core_1.Component({
            selector: 'my-trips',
            templateUrl: 'app/trips.component.html',
            styleUrls: ['app/trips.component.css']
        }), 
        __metadata('design:paramtypes', [router_1.Router, trip_service_1.TripService])
    ], TripsComponent);
    return TripsComponent;
}());
exports.TripsComponent = TripsComponent;
//# sourceMappingURL=trips.component.js.map