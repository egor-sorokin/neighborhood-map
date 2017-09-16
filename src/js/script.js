;(function ($) {
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
    self.filterInput = document.querySelector('.js-form input');
    self.sidebarActiveClass = 'active';
    self.placesList = ko.observableArray([]);


    initialPlaces.forEach(function (i) {
      self.placesList.push(new Place(i));
    });


    self.currentPlace = ko.observable(self.placesList()[0]);


    self.filter = function () {
      var inputVal = self.filterInput.value;
      self.placesList([]);

      initialPlaces.forEach(function (i) {
        if (i.title.toLowerCase().indexOf(inputVal) !== -1) {
          self.placesList.push(new Place(i));
        }
      });
    };


    self.setCurrentPlace = function (clickedPlace, event) {
      self.currentPlace(clickedPlace);
      var _elem = event.target;
      var _parent = _elem.parentNode;
      var _description = _elem.nextElementSibling;
      var _allDescriptions = document.querySelectorAll('.list__item-description');


      for (var i = 0; i < _allDescriptions.length; i++) {
        if (_allDescriptions[i] !== _description) {
          _allDescriptions[i].parentNode.classList.remove(self.sidebarActiveClass);
        }
        _allDescriptions[i].innerHTML = '';
      }

      var wikiUrl = 'http://en.wikipedia.org/w/api.php?action=opensearch&search=' + clickedPlace.title() + '&format=json&callback=wikiCallback';

      var wikiRequestTimeout = setTimeout(function () {
        _description.innerHTML = '';
        _description.innerHTML += 'Failed to get wikipedia resources';
        _parent.classList.add(self.sidebarActiveClass);
      }, 5000);

      $.ajax({
        url: wikiUrl,
        dataType: 'jsonp',
        jsonp: 'callback',
        success: function (response) {
          var description = response[2];

          if (description.length !== 0) {
            _description.innerHTML += description;
          } else {
            _description.innerHTML += 'Description not found';
          }

          _parent.classList.add(self.sidebarActiveClass);

          clearTimeout(wikiRequestTimeout);
        },
        error: function (error) {
          _description.innerHTML += 'Something went wrong';

          console.log('Request returned an error: ', error);
        }
      });
    };
  };

  ko.applyBindings(new ViewModel());
})(jQuery);
