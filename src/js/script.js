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
    // reference https://developers.google.com/maps/documentation/javascript/styling
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
    var errorMessageContainer = document.getElementById('request-error-message');


    self.filterInput = ko.observable('');
    self.placesList = ko.observableArray([]);
    self.placesListVisible = ko.observableArray();
    self.toggleSidebar = ko.observable(false);


    // Fill the places array
    locations.forEach(function (i) {
      self.placesList.push(new Place(i));
    });


    // Fill the places array with visible markers, by default all of them is visible
    self.placesList().forEach(function (place) {
      self.placesListVisible.push(place);
    });


    // Create a custom marker icon
    self.makeMarkerIcon = function (markerColor) {
      var markerImage = new google.maps.MarkerImage(
        'http://chart.googleapis.com/chart?chst=d_map_spin&chld=1.15|0|' + markerColor +
        '|40|_|%E2%80%A2',
        new google.maps.Size(21, 34),
        new google.maps.Point(0, 0),
        new google.maps.Point(10, 34),
        new google.maps.Size(21, 34));

      return markerImage;
    };

    defaultMarkerIconColor = self.makeMarkerIcon('0091ff');


    // Set content to infowindow and open it
    self.populateInfoWindow = function (marker, infowindow, place) {
      if (infowindow.marker !== marker) {
        infowindow.marker = marker;

        infowindow.addListener('closeclick', function () {
          infowindow.marker = null;
          place.itemActive(false);
        });

        var streetViewService = new google.maps.StreetViewService();
        var radius = 50;

        function getStreetView(data, status) {
          if (status === google.maps.StreetViewStatus.OK) {
            var nearStreetViewLocation = data.location.latLng;
            var heading = google.maps.geometry.spherical.computeHeading(nearStreetViewLocation, marker.position);

            infowindow.setContent('<div class="info-window">' +
              '<div class="info-window__title">' + place.title() + '</div>' +
              '<div id="pano" class="info-window__view"></div></div>');

            var panoramaOptions = {
              position: nearStreetViewLocation,
              pov: {
                heading: heading,
                pitch: 30
              }
            };
            var panorama = new google.maps.StreetViewPanorama(document.getElementById('pano'), panoramaOptions);
          } else {
            infowindow.setContent('<div class="info-window">' +
              '<h3 class="info-window__title">' + place.title() + '</h3>' +
              '<div>No Street View Found</div></div>');
          }
        }

        streetViewService.getPanoramaByLocation(marker.position, radius, getStreetView);

        infowindow.open(map, marker);
      }
    };


    // Add a description, a marker and a click event handler to each place
    self.placesList().forEach(function (place) {
      marker = new google.maps.Marker({
        position: new google.maps.LatLng(place.location().lat, place.location().lng),
        map: map,
        animation: google.maps.Animation.DROP,
        icon: defaultMarkerIconColor
      });

      place.marker = marker;

      var wikiUrl = 'http://en.wikipedia.org/w/api.php?action=opensearch&search=' +
        place.title() + '&format=json&callback=wikiCallback';

      // Request a description of each place through Wikipedia API
      $.ajax({
        url: wikiUrl,
        dataType: 'jsonp',
        jsonp: 'callback',
        success: function (response) {
          var description = response[2][0] || 'Description not found';

          place.description(description);

          // Add handler for click event on a marker
          google.maps.event.addListener(place.marker, 'click', function () {
            self.updateDescriptionVisibility(place);
            self.populateInfoWindow(this, infowindow, place);
            place.marker.setAnimation(google.maps.Animation.DROP);
            map.setCenter(place.marker.getPosition());
          });
        },
        error: function () {
          errorMessageContainer.innerHTML = 'Failed to get Wikipedia resources';
        }
      });
    });


    // Show the description of an active place only
    self.updateDescriptionVisibility = function (place) {
      ko.utils.arrayForEach(self.placesListVisible(), function (item) {
        item.itemActive(item.placeId() === place.placeId());
      });
    };


    // Show a place description on the marker and in the sidebar
    self.showPlaceDescription = function (place, fromMarker) {
      google.maps.event.trigger(place.marker, 'click');
      self.updateDescriptionVisibility(place);
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
    self.filterPlacesList = function () {
      var filterInput = self.filterInput().toLowerCase();

      self.placesListVisible.removeAll();

      self.placesList().forEach(function (place) {
        place.marker.setVisible(false);

        if (place.title().toLowerCase().indexOf(filterInput) !== -1) {
          self.placesListVisible.push(place);
        }
      });

      self.placesListVisible().forEach(function (place) {
        place.marker.setVisible(true);
      });
    };
  };

})();
