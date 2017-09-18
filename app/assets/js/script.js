// map default binding
'use strict';

var Place = function (data) {
  this.placeId = ko.observable(data.place_id);
  this.title = ko.observable(data.title);
  this.latLng = ko.observable(data.latLng);
  this.marker = null;
  this.description = ko.observable(data.description);
  this.itemActive = ko.observable(data.itemActive);
};


var ViewModel = function (map, locations) {
  var self = this;

  self.sidebarActiveClass = 'active';
  self.googleMap = map;
  self.filterInput = ko.observable('');
  self.placesList = ko.observableArray([]);

  locations.forEach(function (i) {
    self.placesList.push(new Place(i));
  });

  self.currentPlace = ko.observable(self.placesList()[0]);

  self.filter = function () {
    var inputVal = self.filterInput().toLowerCase();
    self.placesList([]);

    locations.forEach(function (i) {
      if (i.title.toLowerCase().indexOf(inputVal) !== -1) {
        self.placesList.push(new Place(i));
      }
    });
  };

  ko.observableArray.fn.refresh = function (item) {
    var index = this['indexOf'](item);
    if (index >= 0) {
      this.splice(index, 1);
      this.splice(index, 0, item);
    }
  };

  ko.observableArray.fn.refreshAll = function () {
    var data = this.slice(0);
    this.removeAll();
    this(data);
  };

  self.setCurrentPlace = function (clickedPlace) {
    self.currentPlace(clickedPlace);

    ko.utils.arrayForEach(self.placesList(), function (item) {
      item.itemActive = ko.pureComputed(function () {
        return item.placeId() === clickedPlace.placeId();
      });
    });

    self.placesList.refreshAll();


    var wikiUrl = 'http://en.wikipedia.org/w/api.php?action=opensearch&search=' + clickedPlace.title() + '&format=json&callback=wikiCallback';

    var wikiRequestTimeout = setTimeout(function () {
      clickedPlace.description = ko.pureComputed(function () {
        return 'Failed to get Wikipedia resources';
      });
    }, 5000);

    $.ajax({
      url: wikiUrl,
      dataType: 'jsonp',
      jsonp: 'callback',
      success: function (response) {
        var description = response[2];

        clickedPlace.description = ko.pureComputed(function () {
          return description[0] ? description[0] : 'Description not found';
        });

        self.placesList.refresh(clickedPlace);

        clearTimeout(wikiRequestTimeout);
      },
      error: function (error) {
        clickedPlace.description = ko.pureComputed(function () {
          return 'Something went wrong';
        });

        console.log('Request returned an error: ', error);
      }
    });
  };

};
