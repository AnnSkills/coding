let app = angular.module('plunker', ['nvd3']);

app.controller('MainCtrl', function($scope) {
  $scope.options = {
    chart: {
      type: 'lineChart',
      height: 450,
      margin : {
        top: 20,
        right: 20,
        bottom: 80,
        left: 55
      },
      x: function(d){ return d.x; },
      y: function(d){ return d.y; },
      useInteractiveGuideline: true,
      xAxis: {
        axisLabel: 'Date',
        tickFormat: function(d) {
          return d3.time.format('%B %d')(new Date(d))
        },
        ticks: 6,
        showMaxMin: false
      },
      yAxis: {
        axisLabel: 'Value',
        tickFormat: function(d){
          return d3.format('.02f')(d);
        },
        axisLabelDistance: -10,
        showMaxMin: false
      }
    }
  };

  $scope.data = [{"key":"Windows","values":[{"x":1435708800000,"y":8},{"x":1435795200000,"y":9},{"x":1435881600000,"y":8},{"x":1435968000000,"y":8},{"x":1436054400000,"y":9},{"x":1436140800000,"y":9},{"x":1436227200000,"y":8},{"x":1436313600000,"y":8},{"x":1436400000000,"y":9},{"x":1436486400000,"y":9},{"x":1436572800000,"y":7},{"x":1436659200000,"y":8}],"area":true,"color":"#0CB3EE"},{"key":"Android","values":[{"x":1435708800000,"y":8},{"x":1435795200000,"y":8},{"x":1435881600000,"y":8},{"x":1435968000000,"y":7},{"x":1436054400000,"y":8},{"x":1436140800000,"y":6},{"x":1436227200000,"y":8},{"x":1436313600000,"y":7},{"x":1436400000000,"y":6},{"x":1436486400000,"y":6},{"x":1436572800000,"y":8},{"x":1436659200000,"y":8}],"area":true,"color":"#93CB1E"},{"key":"IOS","values":[{"x":1435708800000,"y":8},{"x":1435795200000,"y":7},{"x":1435881600000,"y":8},{"x":1435968000000,"y":9},{"x":1436054400000,"y":7},{"x":1436140800000,"y":9},{"x":1436227200000,"y":8},{"x":1436313600000,"y":9},{"x":1436400000000,"y":9},{"x":1436486400000,"y":9},{"x":1436572800000,"y":9},{"x":1436659200000,"y":8}],"area":true,"color":"#383838"}];
});
