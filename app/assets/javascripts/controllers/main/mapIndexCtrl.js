app.controller('IndexCtrl', ['$scope','$http','leafletData','GeolocationService', function ($scope,$http,leafletData,geolocation) {
  $scope.position = null;
  $scope.message = "Determining gelocation...";
  $scope.results = {};
  // TODO .. ADD A SPINNER/LOADING ICON WHILE LOADING GEOLOCATION
  // NOTE GEOLOCATION SERVICE BEING INJECTED.. BUT NOT USED... LEAFLET WILL AUTODISCOVER IT!

  // when we have our coords then plot a marker for us
  $scope.$on('leafletDirectiveMap.locationfound', function(event){
        $scope.eventDetected = "location!";
        console.log($scope.centerPoint.lat);
        console.log($scope.centerPoint.lng);
        $scope.results['x']={lat:parseFloat($scope.centerPoint.lat),lng: parseFloat($scope.centerPoint.lng),message: 'You Are Here',focus:true};
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
    centerPoint: {
      zoom: 18,
      autoDiscover: true,
      focus:true
    },
    markers: $scope.results,
    layers: {
      baselayers: {
        googleTerrain: {
          name: 'Google Terrain',
          layerType: 'TERRAIN',
          type: 'google'
        },
        googleHybrid: {
          name: 'Google Hybrid',
          layerType: 'HYBRID',
          type: 'google'
        },
        googleRoadmap: {
          name: 'Google Streets',
          layerType: 'ROADMAP',
          type: 'google'
        }
      }
    }
  })
}]);