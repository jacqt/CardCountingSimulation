/** Anthony Guo (anthony.guo@some.ox.ac.uk)
 *
 * Service for the basic strategy
 */
(function(){
    angular.module('blackjackapp.services').service('BasicStrategyService',
        [function() {
            var abbrv = {
                'h' : 'hit',
                's' : 'stand',
                'd' : 'double',
                'sp' : 'split',
                'dh' : 'double_hit',
                'ds' : 'double_stand'
            };
            var basic_strat = {}
            basic_strat.hard = {
                '4':  ['', '',  'h',  'h',  'h',  'h',  'h',  'h',  'h',  'h',   'h',   'h' ],
                '5':  ['', '',  'h',  'h',  'h',  'h',  'h',  'h',  'h',  'h',   'h',   'h' ],
                '6':  ['', '',  'h',  'h',  'h',  'h',  'h',  'h',  'h',  'h',   'h',   'h' ],
                '7':  ['', '',  'h',  'h',  'h',  'h',  'h',  'h',  'h',  'h',   'h',   'h' ],
                '8':  ['', '',  'h',  'h',  'h',  'dh', 'dh', 'h',  'h',  'h',   'h',   'h' ],
                '9':  ['', '',  'dh', 'dh', 'dh', 'dh', 'dh', 'h',  'h',  'h',   'h',   'h' ],
                '10': ['', '',  'dh', 'dh', 'dh', 'dh', 'dh', 'dh', 'dh', 'dh',  'h',   'h' ],
                '11': ['', '',  'dh', 'dh', 'dh', 'dh', 'dh', 'dh', 'dh', 'dh',  'dh',  'd' ],
                '12': ['', '',  'h',  'h',  's',  's',  's',  'h',  'h',  'h',   'h',   'h' ],
                '13': ['', '',  's',  's',  's',  's',  's',  'h',  'h',  'h',   'h',   'h' ],
                '14': ['', '',  's',  's',  's',  's',  's',  'h',  'h',  'h',   'h',   'h' ],
                '15': ['', '',  's',  's',  's',  's',  's',  'h',  'h',  'h',   'h',   'h' ],
                '16': ['', '',  's',  's',  's',  's',  's',  'h',  'h',  'h',   'h',   's' ],
                '17': ['', '',  's',  's',  's',  's',  's',  's',  's',  's',   's',   's' ],
                '18': ['', '',  's',  's',  's',  's',  's',  's',  's',  's',   's',   's' ],
                '19': ['', '',  's',  's',  's',  's',  's',  's',  's',  's',   's',   's' ],
                '20': ['', '',  's',  's',  's',  's',  's',  's',  's',  's',   's',   's' ],
                '21': ['', '',  's',  's',  's',  's',  's',  's',  's',  's',   's',   's' ],
            };
            basic_strat.soft = {
                '12': ['', '',  'h',  'h',  'h',  'dh', 'dh', 'h',  'h',  'h',   'h',   'h' ],
                '13': ['', '',  'h',  'h',  'h',  'dh', 'dh', 'h',  'h',  'h',   'h',   'h' ],
                '14': ['', '',  'h',  'h',  'dh', 'dh', 'dh', 'h',  'h',  'h',   'h',   'h' ],
                '15': ['', '',  'h',  'h',  'dh', 'dh', 'dh', 'h',  'h',  'h',   'h',   'h' ],
                '16': ['', '',  'h',  'h',  'dh', 'dh', 'dh', 'h',  'h',  'h',   'h',   'h' ],
                '17': ['', '',  'h',  'dh', 'dh', 'dh', 'dh', 'h',  'h',  'h',   'h',   'h' ],
                '18': ['', '',  's',  'ds', 'ds', 'ds', 'ds', 's',  's',  'h',   's',   's' ],
                '19': ['', '',  's',  's',  's',  's',  's',  's',  's',  's',   's',   's' ],
                '20': ['', '',  's',  's',  's',  's',  's',  's',  's',  's',   's',   's' ],
                '21': ['', '',  's',  's',  's',  's',  's',  's',  's',  's',   's',   's' ],
            }

            basic_strat.split = {
                '11': ['','', 'sp', 'sp', 'sp', 'sp', 'sp', 'sp', 'sp', 'sp',  'sp',  'sp' ],
                '10': ['','', 's',  's',  's',  's',  's',  's',  's',  's',   's',   's'  ],
                '9':  ['','', 'sp', 'sp', 'sp', 'sp', 'sp', 's',  'sp', 'sp',  's',   's'  ],
                '8':  ['','', 'sp', 'sp', 'sp', 'sp', 'sp', 'sp', 'sp', 'sp',  'sp',  'sp' ],
                '7':  ['','', 'sp', 'sp', 'sp', 'sp', 'sp', 'sp', 'h',  'h',   'h',   'h'  ],
                '6':  ['','', 'sp', 'sp', 'sp', 'sp', 'sp', 'h',  'h',  'h',   'h',   'h'  ],
                '5':  ['','', 'dh', 'dh', 'dh', 'dh', 'dh', 'dh', 'dh', 'dh',  'h',   'h'  ],
                '4':  ['','', 'h',  'h',  'h',  'sp', 'sp', 'h',  'h',  'h',   'h',   'h' ],
                '3':  ['','', 'sp', 'sp', 'sp', 'sp', 'sp', 'sp', 'h',  'h',   'h',   'h' ],
                '2':  ['','', 'sp', 'sp', 'sp', 'sp', 'sp', 'sp', 'h',  'h',   'h',   'h' ],
            }

            function GetMove(hand, dealer_hand){
                var cards = hand.getHand();
                if (cards.length == 2 && cards[0].getValue() == cards[1].getValue()){
                    var p = basic_strat.split[cards[0].getValue().toString()][dealer_hand.score()];
                }
                else {
                    if (cards.length == 1){ //result of a split
                        return 'hit';
                    }
                    if (!hand.isSoft()){
                        var p = basic_strat.hard[hand.score().toString()][dealer_hand.score()];
                    }
                    else {
                        var p = basic_strat.soft[hand.score().toString()][dealer_hand.score()];
                    }
                }
                if (!abbrv[p]){
                    console.log(p);
                    console.log(cards);
                    console.log(hand.score());
                }
                if (abbrv[p] == 'double_hit'){
                    if (cards.length == 2){
                        return 'double'
                    }
                    return 'hit'
                }
                else if (abbrv[p] == 'double_stand'){
                    if (cards.length == 2){
                        return 'double'
                    }
                    return 'stand'
                }
                else {
                    return abbrv[p];
                }
            }

            return {
                //Gets the correct mathematical move
                GetMove: GetMove
            }
        }
    ]);
})();
