;(function () {
  'use strict';

  var initialPlaces = [
    {
      'name': 'Bar',
    },
    {
      'name': 'Foo',
    },
    {
      'name': 'Foobar',
    },
    {
      'name': 'Barfoo',
    },
    {
      'name': 'Baz',
    }
  ];

  var Place = function (data) {
    this.name = ko.observable(data.name);

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
        if (i.name.toLowerCase().indexOf(inputVal) !== -1) {
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
