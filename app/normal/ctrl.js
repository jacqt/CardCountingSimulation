/**Anthony Guo
 * Controller to handle real time events
 */

(function(){
    angular.module('blackjackapp.controllers').controller('NormalStrategyCtrl',
        ['$scope', 'BlackJackSim', 'VisualizationService',
        function($scope, BlackJackSim, VisualizationService) {
            var strategy = {
                CardDealt: function(card){
                    ;
                },
                DeckRedealed: function(){
                    ;
                },
                GetMove: function(hand){
                    if (hand.score() < 17){
                        return 'hit'
                    }
                    return 'stand'
                },
                GetBet: function(){
                    return 15;
                }
            }
            
            var game = new BlackJackSim({
                num_decks: 4,
                other_players: 3,
                strategy: strategy,
                name: 'Dumb strategy'
            });

            $scope.state = game;

            //VisualizationService.AddGameState({ game : game, strategy : strategy });

        }]);
})();
