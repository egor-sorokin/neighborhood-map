var app = {} || app;

(function () {
  'use strict';

  var $ = jQuery;
  var map;

  // Main function to init a google map and bind it
  app.initMap = function () {
    var mapStyles, mapContainer;

    mapContainer = document.getElementById('map');

    // styles for map
    mapStyles = [{
      elementType: 'geometry',
      stylers: [{
        color: '#7a757b'
      }]
    },
      {
        elementType: 'labels.text.stroke',
        stylers: [{
          color: '#242f3e'
        }]
      },
      {
        elementType: 'labels.text.fill',
        stylers: [{
          color: '#d7c2d2'
        }]
      },
      {
        featureType: 'administrative.locality',
        elementType: 'labels.text.fill',
        stylers: [{
          color: '#f0e9ee'
        }]
      },
      {
        featureType: 'poi',
        elementType: 'labels.text.fill',
        stylers: [{
          color: '#d3ccd5'
        }]
      },
      {
        featureType: 'poi.park',
        elementType: 'geometry',
        stylers: [{
          color: '#3c5842'
        }]
      },
      {
        featureType: 'poi.park',
        elementType: 'labels.text.fill',
        stylers: [{
          color: '#669a5c'
        }]
      },
      {
        featureType: 'road',
        elementType: 'geometry',
        stylers: [{
          color: '#ca9bd2'
        }]
      },
      {
        featureType: 'road',
        elementType: 'geometry.stroke',
        stylers: [{
          color: '#352937'
        }]
      },
      {
        featureType: 'road',
        elementType: 'labels.text.fill',
        stylers: [{
          color: '#dbdddd'
        }]
      },
      {
        featureType: 'road.highway',
        elementType: 'geometry',
        stylers: [{
          color: '#746855'
        }]
      },
      {
        featureType: 'road.highway',
        elementType: 'geometry.stroke',
        stylers: [{
          color: '#d48dc2'
        }]
      },
      {
        featureType: 'road.highway',
        elementType: 'labels.text.fill',
        stylers: [{
          color: '#f3d19c'
        }]
      },

      {
        featureType: 'water',
        elementType: 'geometry',
        stylers: [{
          color: '#9b8d9c'
        }]
      },
      {
        featureType: 'water',
        elementType: 'labels.text.fill',
        stylers: [{
          color: '#8d7985'
        }]
      },
      {
        featureType: 'water',
        elementType: 'labels.text.stroke',
        stylers: [{
          color: '#a18a98'
        }]
      }
    ];

    // map initialising
    map = new google.maps.Map(mapContainer, {
      center: {
        lat: 50.467859,
        lng: -116.266224
      },
      zoom: 7,
      mapTypeControl: false,
      styles: mapStyles
    });

    // default set of locations
    var locations = [{
      place_id: 'ChIJ_f9-6SYGelMRaZ4lDCFImk4',
      title: 'Kootenay National Park',
      location: {
        lat: 50.9769367,
        lng: -115.9592102
      }
    },
      {
        place_id: 'ChIJyaLFSj48eVMRc4lvx8rhwJ0',
        title: 'Two Lakes In Revelstoke National Park',
        location: {
          lat: 51.0336631,
          lng: -118.1640469
        }
      },
      {
        place_id: 'ChIJlZGSjCtmd1MR5tfKrGjincA',
        title: 'Banff National Park',
        location: {
          lat: 51.4968464,
          lng: -115.9280562
        }
      },
      {
        place_id: 'ChIJxWd-JkUIeVMRuQ7amxSgRPA',
        title: 'Glacier National Park of Canada',
        location: {
          lat: 51.335289,
          lng: -117.5297595
        }
      },
      {
        place_id: 'ChIJv0mRixFDb1MRHFgDVHceYN8',
        title: 'Waterton Lakes National Park',
        location: {
          lat: 49.0833333,
          lng: -113.9166667
        }
      }
    ];

    var viewModel = new ViewModel(locations);

    ko.applyBindings(viewModel);
  };


  // Place - a description of each place instance
  var Place = function (data) {
    this.placeId = ko.observable(data.place_id);
    this.title = ko.observable(data.title);
    this.location = ko.observable(data.location);
    this.marker = ko.observable();
    this.description = ko.observable(data.description);
    this.itemActive = ko.observable(false);
  };


  var ViewModel = function (locations) {
    var self = this;
    var infowindow = new google.maps.InfoWindow();
    var marker;
    var defaultMarkerIconColor;


    // Create custom marker icon
    function makeMarkerIcon(markerColor) {
      var markerImage = new google.maps.MarkerImage(
        'http://chart.googleapis.com/chart?chst=d_map_spin&chld=1.15|0|' + markerColor +
        '|40|_|%E2%80%A2',
        new google.maps.Size(21, 34),
        new google.maps.Point(0, 0),
        new google.maps.Point(10, 34),
        new google.maps.Size(21, 34));

      return markerImage;
    }

    defaultMarkerIconColor = makeMarkerIcon('0091ff');


    self.sidebarActiveClass = 'active';
    self.filterInput = ko.observable('');
    self.placesList = ko.observableArray([]);
    self.visiblePlacesList = ko.observableArray();
    self.toggleSidebar = ko.observable(false);


    // Fill the places array
    locations.forEach(function (i) {
      self.placesList.push(new Place(i));
    });


    // Initially all markers are visible
    self.placesList().forEach(function (place) {
      self.visiblePlacesList.push(place);
    });


    // Add a description, a marker and a click event handler to each place
    self.placesList().forEach(function (place) {
      marker = new google.maps.Marker({
        position: new google.maps.LatLng(place.location().lat, place.location().lng),
        map: map,
        animation: google.maps.Animation.DROP,
        icon: defaultMarkerIconColor
      });

      place.marker = marker;

      var wikiUrl = 'http://en.wikipedia.org/w/api.php?action=opensearch&search='
        + place.title() + '&format=json&callback=wikiCallback';

      // Request description of each place through Wikipedia API
      $.ajax({
        url: wikiUrl,
        dataType: 'jsonp',
        jsonp: 'callback',
        success: function (response) {
          var description = response[2][0] || 'Description not found';

          place.description(description);

          var infowindowContent = '<div class="info-window">' +
            '<h4 class="info-window__title">' + place.title() + '</h4>' +
            '<p class="info-window__description">' + place.description() + '</p></div>';

          google.maps.event.addListener(place.marker, 'click', function () {
            infowindow.open(map, this);
            this.setAnimation(google.maps.Animation.DROP);
            infowindow.setContent(infowindowContent);
            map.setCenter(place.marker.getPosition());
          });
        },
        error: function () {
          infowindow.setContent('<p>Failed to get Wikipedia resources</p>');
          document.getElementById('error-message').innerHTML = '<p>Failed to get Wikipedia resources</p>';
        }
      });
    });


    // Handler for showing place description
    self.showPlaceDescription = function (place) {
      google.maps.event.trigger(place.marker, 'click');

      ko.utils.arrayForEach(self.visiblePlacesList(), function (item) {
        item.itemActive(item.placeId() === place.placeId());
      });
    };


    // Handler for hiding/showing a sidebar
    self.toggleSidebarHandler = function () {
      if (self.toggleSidebar()) {
        self.toggleSidebar(false);
      } else {
        self.toggleSidebar(true);
      }
    };


    // Filter all markers and places, remove all of them and then re-push only visible ones
    self.filterMarkers = function () {
      var searchInput = self.filterInput().toLowerCase();

      self.visiblePlacesList.removeAll();

      self.placesList().forEach(function (place) {
        place.marker.setVisible(false);

        if (place.title().toLowerCase().indexOf(searchInput) !== -1) {
          self.visiblePlacesList.push(place);
        }
      });

      self.visiblePlacesList().forEach(function (place) {
        place.marker.setVisible(true);
      });
    };
  };

})();
