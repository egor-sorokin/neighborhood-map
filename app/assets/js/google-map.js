(function() {
  'use strict';
    //
    // function populateInfoWindow(marker, infowindow) {
    //   if (infowindow.marker !== marker) {
    //     infowindow.marker = marker;
    //     infowindow.setContent('<div>' + marker.position + '</div>');
    //
    //     infowindow.addListener('closeclick', function() {
    //       infowindow.marker = null;
    //       marker.setIcon(defaultMarkerIcon);
    //     });
    //
    //     var streetViewService = new google.maps.StreetViewService();
    //     var radius = 50;
    //
    //     function getStreetView(data, status) {
    //       if (status === google.maps.StreetViewStatus.OK) {
    //         var nearStreetViewLocation = data.location.latLng;
    //         var heading = google.maps.geometry.spherical.computeHeading(nearStreetViewLocation, marker.position);
    //
    //         infowindow.setContent('<div class="text">' + marker.title + '</div><div id="pano" class="pano"></div>');
    //
    //         var panoramaOptions = {
    //           position: nearStreetViewLocation,
    //           pov: {
    //             heading: heading,
    //             pitch: 30
    //           }
    //         };
    //         var panorama = new google.maps.StreetViewPanorama(document.getElementById('pano'), panoramaOptions);
    //       } else {
    //         infowindow.setContent('<div class="text">' + marker.title + '</div>' +
    //           '<div>No Street View Found</div>');
    //       }
    //     }
    //
    //     streetViewService.getPanoramaByLocation(marker.position, radius, getStreetView);
    //
    //     infowindow.open(map, marker);
    //   }
    // }


    // function initMarkers() {
    //   for (var i = 0; i < locations.length; i++) {
    //     var position = locations[i].location;
    //     var title = locations[i].title;
    //
    //     var marker = new google.maps.Marker({
    //       position: position,
    //       title: title,
    //       id: i,
    //       draggable: true,
    //       animation: google.maps.Animation.DROP,
    //       icon: defaultMarkerIcon
    //     });
    //
    //     app.viewModel.placesList()[i].marker = marker;
    //
    //     markers.push(marker);
    //
    //     marker.addListener('click', function() {
    //       this.setIcon(highlightedMarkerIcon);
    //       populateInfoWindow(this, largeInfowindow);
    //     });
    //   }
    // }


    // function showMarkers() {
    //   var bounds = new google.maps.LatLngBounds();
    //   for (var i = 0; i < markers.length; i++) {
    //     markers[i].setMap(map);
    //     bounds.extend(markers[i].position);
    //   }
    //
    //   map.fitBounds(bounds);
    // }

})();
