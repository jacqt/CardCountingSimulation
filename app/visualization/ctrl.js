/**Anthony Guo
 * Controller to handle real time events
 */

(function(){
    angular.module('blackjackapp.controllers').controller('VisualizationCtrl',
        ['$scope', 'VisualizationService',
        function($scope, VisualizationService) {

            $scope.data = VisualizationService.Data;

            $scope.options = {
                datasetStroke: false,
                animation: false,
                pointDot: false,
                showTooltips: false,
                scaleShowVerticalLines: false,
                datasetFill : false,
                scaleLabel: function (valuePayload) {
                    return (numberWithCommas(valuePayload.value)) + '$'
                }
            };

            $scope.reset = function(){
                VisualizationService.Reset();
            }
            function numberWithCommas(x) {
                return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
            }

            $scope.pretty_print = function(){
                return JSON.stringify($scope.data.chart, null, 2) 
            }

            var update = 0;
            VisualizationService.AddDataHandler(function(){
                update += 1;
            })
            function UpdateLoop(){
                if (update > 0){
                    $scope.$apply();
                }
                update = 0;
                setTimeout(UpdateLoop, 30);
            }
            UpdateLoop();
        }]);
})();
