var initMap;

(function () {
  'use strict';

  initMap = function () {
    var map;
    var locations, markers, mapStyles;
    var mapContainer, largeInfowindow, defaultMarkerIcon, highlightedMarkerIcon;

    markers = [];
    mapContainer = document.getElementById('map');
    largeInfowindow = new google.maps.InfoWindow();

    mapStyles = [
      {elementType: 'geometry', stylers: [{color: '#7a757b'}]},
      {elementType: 'labels.text.stroke', stylers: [{color: '#242f3e'}]},
      {elementType: 'labels.text.fill', stylers: [{color: '#d7c2d2'}]},
      {
        featureType: 'administrative.locality',
        elementType: 'labels.text.fill',
        stylers: [{color: '#f0e9ee'}]
      },
      {
        featureType: 'poi',
        elementType: 'labels.text.fill',
        stylers: [{color: '#d3ccd5'}]
      },
      {
        featureType: 'poi.park',
        elementType: 'geometry',
        stylers: [{color: '#3c5842'}]
      },
      {
        featureType: 'poi.park',
        elementType: 'labels.text.fill',
        stylers: [{color: '#669a5c'}]
      },
      {
        featureType: 'road',
        elementType: 'geometry',
        stylers: [{color: '#ca9bd2'}]
      },
      {
        featureType: 'road',
        elementType: 'geometry.stroke',
        stylers: [{color: '#352937'}]
      },
      {
        featureType: 'road',
        elementType: 'labels.text.fill',
        stylers: [{color: '#dbdddd'}]
      },
      {
        featureType: 'road.highway',
        elementType: 'geometry',
        stylers: [{color: '#746855'}]
      },
      {
        featureType: 'road.highway',
        elementType: 'geometry.stroke',
        stylers: [{color: '#d48dc2'}]
      },
      {
        featureType: 'road.highway',
        elementType: 'labels.text.fill',
        stylers: [{color: '#f3d19c'}]
      },

      {
        featureType: 'water',
        elementType: 'geometry',
        stylers: [{color: '#9b8d9c'}]
      },
      {
        featureType: 'water',
        elementType: 'labels.text.fill',
        stylers: [{color: '#8d7985'}]
      },
      {
        featureType: 'water',
        elementType: 'labels.text.stroke',
        stylers: [{color: '#a18a98'}]
      }
    ];

    locations = [
      {
        place_id: 'ChIJ_f9-6SYGelMRaZ4lDCFImk4',
        title: 'Kootenay National Park',
        location: {lat: 50.9769367, lng: -115.9592102}
      },
      {
        place_id: 'ChIJyaLFSj48eVMRc4lvx8rhwJ0',
        title: 'Two Lakes In Revelstoke National Park',
        location: {lat: 51.0336631, lng: -118.1640469}
      },
      {
        place_id: 'ChIJlZGSjCtmd1MR5tfKrGjincA',
        title: 'Banff National Park',
        location: {lat: 51.4968464, lng: -115.9280562}
      },
      {
        place_id: 'ChIJxWd-JkUIeVMRuQ7amxSgRPA',
        title: 'Glacier National Park of Canada',
        location: {lat: 51.335289, lng: -117.5297595}
      },
      {
        place_id: 'ChIJv0mRixFDb1MRHFgDVHceYN8',
        title: 'Waterton Lakes National Park',
        location: {lat: 49.0833333, lng: -113.9166667}
      }
    ];

    map = new google.maps.Map(mapContainer, {
      center: {lat: 54.367859, lng: -114.266224},
      zoom: 13,
      mapTypeControl: false,
      styles: mapStyles
    });


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


    defaultMarkerIcon = makeMarkerIcon('0091ff');
    highlightedMarkerIcon = makeMarkerIcon('f3d19c');


    function populateInfoWindow(marker, infowindow) {
      if (infowindow.marker !== marker) {
        infowindow.marker = marker;
        infowindow.setContent('<div>' + marker.position + '</div>');

        infowindow.addListener('closeclick', function () {
          infowindow.marker = null;
          marker.setIcon(defaultMarkerIcon);
        });

        var streetViewService = new google.maps.StreetViewService();
        var radius = 50;

        function getStreetView(data, status) {
          if (status === google.maps.StreetViewStatus.OK) {
            var nearStreetViewLocation = data.location.latLng;
            var heading = google.maps.geometry.spherical.computeHeading(nearStreetViewLocation, marker.position);

            infowindow.setContent('<div class="text">' + marker.title + '</div><div id="pano" class="pano"></div>');

            var panoramaOptions = {
              position: nearStreetViewLocation,
              pov: {
                heading: heading,
                pitch: 30
              }
            };
            var panorama = new google.maps.StreetViewPanorama(document.getElementById('pano'), panoramaOptions);
          } else {
            infowindow.setContent('<div class="text">' + marker.title + '</div>' +
              '<div>No Street View Found</div>');
          }
        }

        streetViewService.getPanoramaByLocation(marker.position, radius, getStreetView);

        infowindow.open(map, marker);
      }
    }


    function initMarkers() {
      for (var i = 0; i < locations.length; i++) {
        var position = locations[i].location;
        var title = locations[i].title;

        var marker = new google.maps.Marker({
          position: position,
          title: title,
          id: i,
          draggable: true,
          animation: google.maps.Animation.DROP,
          icon: defaultMarkerIcon
        });

        markers.push(marker);

        marker.addListener('click', function () {
          this.setIcon(highlightedMarkerIcon);
          populateInfoWindow(this, largeInfowindow);
        });
      }
    }


    function showMarkers() {
      var bounds = new google.maps.LatLngBounds();
      for (var i = 0; i < markers.length; i++) {
        markers[i].setMap(map);
        bounds.extend(markers[i].position);
      }

      map.fitBounds(bounds);
    }


    function setOnGoogleMapLoadEvent() {
      google.maps.event.addDomListener(window, 'load', function () {
        var googleMap = initMap();

        ko.applyBindings(new ViewModel(googleMap, locations));
      });
    }


    initMarkers();
    showMarkers();
    setOnGoogleMapLoadEvent();
  };

})();
