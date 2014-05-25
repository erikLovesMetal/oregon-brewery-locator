app.controller('IndexCtrl', ['$scope','$http','leafletData','GeolocationService','leafletEvents', function ($scope,$http,leafletData,geolocation,leafletEvents) {
  $scope.position = null;
  $scope.message = "Determining gelocation...";
  $scope.results = {};
  // TODO .. ADD A SPINNER/LOADING ICON WHILE LOADING GEOLOCATION
  // NOTE GEOLOCATION SERVICE BEING INJECTED.. BUT NOT USED... LEAFLET WILL AUTODISCOVER IT!

  // get the map leaflet object and add the sidebar to controls
  leafletData.getMap().then(function(map) {
    console.log('hello');
    $scope.sidebar = L.control.sidebar("sidebar", {
      closeButton: true,
      position: "left"
    });
    map._layersMaxZoom=20;
    map.options.maxZoom=20;
    map.addControl($scope.sidebar);
  });

  // toggle the sidebar... wonder if there is a sexier angular way to detect click... $on ?...
  $scope.sidebarToggle = function(){
    console.log($scope);
    $scope.sidebar.toggle();
  }

  //when we have our coords then plot a marker for us
  $scope.$on('leafletDirectiveMap.locationfound', function(event){
        $("#loading").hide();
        $scope.eventDetected = "location!";
        console.log($scope.centerPoint.lat);
        console.log($scope.centerPoint.lng);
        $scope.results['x']={lat:parseFloat($scope.centerPoint.lat),lng: parseFloat($scope.centerPoint.lng),message: "You Are Here",focus:true};
    });

  $scope.events = {
    markers: {
      enable: ['click'],
      logic: 'emit'
    }
  };

  // add listeners for specific markers click event then open populated modal
  $scope.$on('leafletDirectiveMarker.click',function(event,args){
    var content = "<table class='table table-striped table-bordered table-condensed'>" + "<tr><th>Division</th><td>" + $scope.markers[args.markerName].message + "</td></tr>" + "<tr><th>Line</th><td>" + $scope.markers[args.markerName].message + "</td></tr>" + "<table>";
    $("#feature-title").html($scope.markers[args.markerName].message);
    $("#feature-info").html(content);
    $("#featureModal").modal("show");
    console.log($scope.markers[args.markerName]);
  });


  // plot some breweries!...
  $http({method: 'GET', url: 'map/getBreweryCoords'}).
    success(function(data, status, headers, config) {
      // this callback will be called asynchronously
      // when the response is available
      $(data).each(function(index){
        if( this.lat != 0.0 && this.long != 0.0){
          $scope.results['m' + index]={lat:parseFloat(this.lat),lng: parseFloat(this.long),message: this.name};
        }
      });
    }).
    error(function(data, status, headers, config) {
      // called asynchronously if an error occurs
      // or server returns response with an error status.
      console.log(status);
    });

  angular.extend($scope, {
    defaults: {
       // tileLayer: "http://a.tiles.mapbox.com/v3/mapbox.world-light/{z}/{x}/{y}.png",
       // scrollWheelZoom: true,
       maxZoom:20,
       doubleClickZoom:true,
       // zoomAnimation:true,
       markerZoomAnimation:true
    },
    centerPoint: {
      zoom: 13,
      autoDiscover: true,
      focus:false,
      maxZoom:20
    },
    markers: $scope.results, //NOTE CANT ZOOM PAST 15 CAUSE ZOOM LIMIT ON GOOGLE TERRIAIN
    layers: {
      baselayers: {
        googleTerrain: {
          name: 'Google Terrain',
          layerType: 'TERRAIN',
          type: 'google',
          maxZoom:20
        },
        googleHybrid: {
          name: 'Google Hybrid',
          layerType: 'HYBRID',
          type: 'google',
          maxZoom:20
        },
        googleRoadmap: {
          name: 'Google Streets',
          layerType: 'ROADMAP',
          type: 'google',
          maxZoom:20
        }
      }
    }
  })
}]);