app.controller('IndexCtrl', ['$scope','$http','leafletData','GeolocationService','leafletEvents','$q', function ($scope,$http,leafletData,geolocation,leafletEvents,$q) {
  $scope.position = null;
  $scope.results = {};
  $scope.brewery = {};
  // TODO .. ADD A SPINNER/LOADING ICON WHILE LOADING GEOLOCATION
  // NOTE GEOLOCATION SERVICE BEING INJECTED.. BUT NOT USED... LEAFLET WILL AUTODISCOVER IT!

  // process the add brewery form form
  $scope.processForm = function() {
    console.log($.param($scope.brewery));
    $http({
        method  : 'POST',
        url     : '/admin/breweries.json',
        data    : $.param($scope.brewery),  // pass in data as strings
        headers : { 'Content-Type': 'application/x-www-form-urlencoded' }  // set the headers so angular passing info as form data (not request payload)
    }).success(function(data) {
        console.log(data);
        // if (!data.success) {
        //   console.log('error');
        //   console.log(data);
        //   // if not successful, bind errors to error variables
        //     // $scope.errorName = data.errors.name;
        //     // $scope.errorSuperhero = data.errors.superheroAlias;
        // } else {
        //   // if successful, bind success message to message
        //     console.log('success');
        //     $scope.message = data.message;
        // }
    });
  };

  function getUsersState(){
    var deferred = $q.defer();
    // go get the current state the map user is in
    $http({method: 'GET', url: 'admin/getCurrentUserState',params:{lat:$scope.centerPoint.lat,long:$scope.centerPoint.lng}}).
      success(function(data, status, headers, config) {
        // this callback will be called asynchronously
        // when the response is available
        $scope.currentState = data['state'];
        deferred.resolve(data);
      }).
      error(function(data, status, headers, config) {
        // called asynchronously if an error occurs
        // or server returns response with an error status.
        console.log(status);
        deferred.reject(data);
    });
    return deferred.promise;
  }

  // toggle the sidebar... wonder if there is a sexier angular way to detect click... $on ?...
  $scope.sidebarToggle = function(){
    $scope.sidebar.toggle();
  }

  //when we have our current coords then plot a marker for us
  $scope.$on('leafletDirectiveMap.locationfound', function(event){
    //hide loader
    $("#loading").hide();
    //current location available so lets go figure out which state they are in
    // use promise, when we have users state and do our check then load map
    getUsersState().then(function(data){
        //set users current stating in angular
        $scope.currentState = data.state;
        // get the map leaflet object and add the sidebar to controls
        leafletData.getMap().then(function(map) {
          if($scope.currentState != "OR"){
            map.setView(new L.LatLng(44.465, -121.13525390625), 7);  
          }
          $scope.sidebar = L.control.sidebar("sidebar", {
            closeButton: true,
            position: "left"
          });

          // add circle around current location marker
          var currentLocationCircle = L.circleMarker(new L.LatLng($scope.centerPoint.lat, $scope.centerPoint.lng),{radius:25,fillColor: "#ff7800",color: "#000",weight: 1,opacity: 1,fillOpacity: 0.8});
          map.addLayer(currentLocationCircle);

          map._layersMaxZoom=20;
          map.options.maxZoom=20;
          map.addControl($scope.sidebar);
        });

      },
      function(reason){
        alert('Failed: ' + reason);
      }
     );
    // console.log($scope.centerPoint.lat);
    // console.log($scope.centerPoint.lng);
    // add marker for our current location
    $scope.results['x']={lat:parseFloat($scope.centerPoint.lat),lng: parseFloat($scope.centerPoint.lng),message: "You Are Here",focus:true};
  });

  $scope.events = {
    markers: {
      enable: ['click'],
      logic: 'emit'
    }
  };

  // click handler brewery in sidebar
  $scope.showBrewery = function(b) {
    $.each($scope.results,function(i){
      if($scope.results[i].lat == b.lat && $scope.results[i].lng == b.lng){
        $scope.results[i].focus = true;
        // console.log($scope.results[i]);
      }
    });

    //center/zoom on the clicked brewery in sidebar
    $scope.centerPoint.lat = b.lat;
    $scope.centerPoint.lng = b.lng;
    $scope.centerPoint.zoom = 20;

  };

  // add listeners for specific markers click event then open populated modal
  // TODO REFACTOR THIS HTML OUT
  $scope.$on('leafletDirectiveMarker.click',function(event,args){
    var content = "<table class='table table-striped table-bordered table-condensed'>" + 
                  "<tr><th>Name</th><td>" + $scope.markers[args.markerName].message + 
                  "</td></tr>" + "<tr><th>Address</th><td>" + $scope.markers[args.markerName].address + 
                  "</tr></td><tr><th>City/State</th><td>" + $scope.markers[args.markerName].city + ' ' + $scope.markers[args.markerName].state + 
                  "</td></tr>" + "<tr><th>Notes</th><td>" + $scope.markers[args.markerName].notes + "</td></tr>" + "<table>";
    $("#feature-title").html($scope.markers[args.markerName].message);
    $("#feature-info").html(content);
    $("#featureModal").modal("show");
  });

  // plot some breweries!...
  $http({method: 'GET', url: 'map/getBreweryCoords'}).
    success(function(data, status, headers, config) {
      // this callback will be called asynchronously
      // when the response is available
      $(data).each(function(index){
        // console.log(this);
        if((this.latitude != 0.0 && this.longitude != 0.0) && (this.latitude != null && this.longitude != null)){
          $scope.results['m' + index]={lat:parseFloat(this.latitude),lng: parseFloat(this.longitude),message: this.name,address:this.address,city:this.city,state:this.state,notes:this.notes};
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