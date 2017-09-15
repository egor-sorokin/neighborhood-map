
;(function () {
  'use strict';

  var initialPlaces = [
    {
      'place_id': 'ChIJ_f9-6SYGelMRaZ4lDCFImk4',
      'title': 'Kootenay National Park',
      'locations': {
        'lat': 50.9769367,
        'lng': -115.9592102
      }
    },
    {
      'place_id': 'ChIJyaLFSj48eVMRc4lvx8rhwJ0',
      'title': 'Two Lakes In Revelstoke National Park',
      'location': {
        'lat': 51.0336631,
        'lng': -118.1640469
      }
    },
    {
      'place_id': 'ChIJlZGSjCtmd1MR5tfKrGjincA',
      'title': 'Banff National Park',
      'location': {
        'lat': 51.4968464,
        'lng': -115.9280562
      }
    },
    {
      'place_id': 'ChIJxWd-JkUIeVMRuQ7amxSgRPA',
      'title': 'Glacier National Park of Canada',
      'location': {
        'lat': 51.335289,
        'lng': -117.5297595
      }
    },
    {
      'place_id': 'ChIJv0mRixFDb1MRHFgDVHceYN8',
      'title': 'Waterton Lakes National Park',
      'location': {
        'lat': 49.0833333,
        'lng': -113.9166667
      }
    }
  ];

  var Place = function (data) {
    this.title = ko.observable(data.title);

  };

  var ViewModel = function () {
    var self = this;
    var input = document.querySelector('.js-form input');

    self.placesList = ko.observableArray([]);

    initialPlaces.forEach(function (i) {
      self.placesList.push(new Place(i));
    });

    self.currentPlace = ko.observable(self.placesList()[0]);

    self.filter = function () {
      var inputVal = input.value;
      self.placesList([]);

      initialPlaces.forEach(function (i) {
        if (i.title.toLowerCase().indexOf(inputVal) !== -1) {
          self.placesList.push(new Place(i));
        }
      });
    };

    self.setCurrentPlace = function (clickedPlace) {
      self.currentPlace(clickedPlace);
    };
  };

  ko.applyBindings(new ViewModel());
})();
