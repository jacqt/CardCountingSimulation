
/**Anthony Guo
 * Controller for high-low card counting strategy 
 */

(function(){
    angular.module('blackjackapp.controllers').controller('ZenCtrl',
        ['$scope', 'BasicStrategyService', 'BlackJackSim', 'VisualizationService',
        function($scope, BasicStrategyService, BlackJackSim, VisualizationService) {
            var NUM_DECKS = 4;
            var TOTAL_CARDS = 4*52;
            var count = 0;
            var cards_dealt = 0;

            function GetTrueCount(){
                var decks_left = Math.ceil((TOTAL_CARDS - cards_dealt)/52.0);
                if (decks_left == 0){
                    decks_left = 1;
                }
                if (count < 0){
                    return  0;
                }
                return Math.floor(count / (decks_left));
            }

            var table = {
                1 : -1,
                2: 1,
                3: 1,
                4: 2,
                5: 2,
                6: 2,
                7: 1,
                8: 0,
                9: 0,
                10: -2,
                11: -2,
                12: -2,
                13: -2
            }

            var strategy = {
                CardDealt: function(card){
                    cards_dealt += 1;
                    var n = card.getNumber();
                    if (card.getNumber() < 7 && n != 1){
                        count += 1;
                    }
                    else if (card.getNumber() > 9 || n == 1){
                        count -= 1;
                    }
                },
                DeckRedealed: function(){
                    count = 0;
                    cards_dealt = 0;
                },
                GetMove: BasicStrategyService.GetMove,
                GetBet: function(){
                    var c = GetTrueCount();
                    if (c < 2){
                        c = 0;
                    }
                    return 10 + 15*c;
                }
            }
            
            var game = new BlackJackSim({
                num_decks: 4,
                other_players: 3,
                strategy: strategy,
                name: 'Zen'
            });

            $scope.state = game;
            $scope.state.money_bet = 0;

            $scope.bet = strategy.GetBet;
            VisualizationService.AddGameState({ game : game, strategy : strategy });
        }]);
})();
