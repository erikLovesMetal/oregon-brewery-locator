app.controller('IndexCtrl', ['$scope','$http', function ($scope,$http) {
  $scope.position = null;
  $scope.message = "Determining gelocation...";
  
  $http({method: 'GET', url: 'map/getBreweryCoords'}).
    success(function(data, status, headers, config) {
      // this callback will be called asynchronously
      // when the response is available
      console.log(status);
      console.log(data);
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
    markers: {
      m1: {
        lat: 45.5488529,
        lng: -122.65955079999999
      }
    },
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