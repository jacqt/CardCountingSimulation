/** Anthony Guo (anthony.guo@some.ox.ac.uk)
 *
 * Describes the angular controllers/services and their dependencies
 */

angular.module('blackjackapp', [
    'blackjackapp.controllers',
    'blackjackapp.services',
    //'chartsExample.directives'
]);


angular.module('blackjackapp.controllers', [ 
    'chart.js',

    //add dependencies for the controllers here
]);

angular.module('blackjackapp.services', [
    //add dependencies for the services here
]);

/**
 * Controls the entire app. Named "GithubViz".
 */
(function(){
    angular.module('blackjackapp.controllers').controller('MainCtrl',
        ['$scope', controller]);
    function controller ($scope, $modal) {
        $scope.datum = "Hello world!";
    }
})();
