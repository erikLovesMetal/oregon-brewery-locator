app.controller('IndexCtrl', ['$scope','$http','leafletData', function ($scope,$http,leafletData) {
  $scope.position = null;
  $scope.message = "Determining gelocation...";
  leafletData.getMap('map2').then(function(map){
    $scope.map = map;
    console.log($scope);
    // $log.info(map);
  })
  $scope.results = {};
  $http({method: 'GET', url: 'map/getBreweryCoords'}).
    success(function(data, status, headers, config) {
      // this callback will be called asynchronously
      // when the response is available
      
      $(data).each(function(index){
        // console.log(this.lat + ' - ' + this.long);
        // item = 'm' + index + ':{lat:' + this.lat + ',lng:' + this.long + ',message:' + this.name + '}'
        item = '{lat:' + this.lat + ',lng:' + this.long + ',message:' + this.name + '}'
        // results.push(item);
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
      zoom: 14,
      autoDiscover: true
    },
    // markers: {
    //   m1: {
    //     lat: 45.5488529,
    //     lng: -122.65955079999999
    //   }
    // },
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