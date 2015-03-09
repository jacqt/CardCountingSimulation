
/**Anthony Guo
 * Controller for high-low card counting strategy 
 */

(function(){
    angular.module('blackjackapp.controllers').controller('BasicCtrl',
        ['$scope', 'BasicStrategyService', 'BlackJackSim', 'VisualizationService',
        function($scope, BasicStrategyService, BlackJackSim, VisualizationService) {

            var strategy = {
                CardDealt: function(card){
                    ;
                },
                DeckRedealed: function(){
                    ;
                },
                GetMove: BasicStrategyService.GetMove,
                GetBet: function(){
                    return $scope.bet();
                }
            }

            $scope.bet = function(){
                return 25
            }
            
            var game = new BlackJackSim({
                num_decks: 4,
                other_players: 3,
                strategy: strategy,
                name: 'Basic Strategy'
            });

            $scope.state = game;
            VisualizationService.AddGameState({ game : game, strategy : strategy });



        }]);
})();
