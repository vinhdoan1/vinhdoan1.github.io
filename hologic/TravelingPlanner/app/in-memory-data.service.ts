export class InMemoryDataService {
  createDb() {
    let heroes = [
      {id: 11, name: 'Mr. Nice'},
      {id: 12, name: 'Narco'},
      {id: 13, name: 'Bombasto'},
      {id: 14, name: 'Celeritas'},
      {id: 15, name: 'Magneta'},
      {id: 16, name: 'RubberMan'},
      {id: 17, name: 'Dynama'},
      {id: 18, name: 'Dr IQ'},
      {id: 19, name: 'Magma'},
      {id: 20, name: 'Tornado'}
      ];

    let trips = [
        {
            id: 1, name: "CA fun", cities: [
                { id: 1, name: 'San Jose', duration: '2 days' },
                { id: 2, name: 'Los Angeles', duration: '4 days' },
                { id: 3, name: 'San Francisco', duration: '1 day' },
                { id: 4, name: 'San Diego', duration: '1 day' },
            ]
        },
        {
            id: 2, name: "Florida adventures", cities: [
                { id: 1, name: 'Miami', duration: '1 day' },
                { id: 2, name: 'Orlando', duration: '2 days' },
            ]
        },
        {
            id: 3, name: "Exploring Europe", cities: [
                { id: 1, name: 'London', duration: '5 day' },
                { id: 2, name: 'Paris', duration: '2 days' },
                { id: 3, name: 'Amsterdam', duration: '4 days' },
                { id: 4, name: 'Budapest', duration: '1 day' },
            ]
        }

    ];

    let cities = 
        [
            { id: 1, name: 'San Diego', duration: '1 day' },
            { id: 2, name: 'San Jose', duration: '2 days' },
            { id: 3, name: 'Los Angeles', duration: '4 days' },
            { id: 4, name: 'San Francisco', duration: '1 day' },
        ];

    return { heroes, trips, cities};
  }
}


/*
Copyright 2016 Google Inc. All Rights Reserved.
Use of this source code is governed by an MIT-style license that
can be found in the LICENSE file at http://angular.io/license
*/
