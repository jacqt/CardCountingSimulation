/** Anthony Guo (anthony.guo@some.ox.ac.uk)
 *
 * Service for getting a black simulator game 
 */
(function(){
    angular.module('blackjackapp.services').service('BlackJackSim',
        [function() {
            var Card = function (suit, number){
                /** @returns {Number} The number of the card in the deck. (1-52) */
                this.getNumber = function (){
                    return number;
                };
                /** @returns {String} The name of the suit. "Hearts","Clubs","Spades", or "Diamonds." */
                this.getSuit = function (){
                    var suitName = '';
                    switch (suit){
                        case 1:
                            suitName = "Hearts";
                            break;
                        case 2:
                            suitName = "Clubs";
                            break;
                        case 3:
                            suitName = "Spades";
                            break;
                        case 4:
                            suitName = "Diamonds";
                            break;
                    }
                    return suitName;
                };
                /** @returns {String} The HTML-encoded symbol of the suit. */
                this.getSymbol = function (){
                    var suitName = '';
                    switch (suit){
                        case 1:
                            suitName = "&hearts;";
                            break;
                        case 2:
                            suitName = "&clubs;";
                            break;
                        case 3:
                            suitName = "&spades;";
                            break;
                        case 4:
                            suitName = "&diams;";
                            break;
                    }
                    return suitName;
                };
                /** @returns {Number} The value of the card for scoring. */
                this.getValue = function (){
                    var value = number;
                    if (number >= 10){
                        value = 10;
                    }
                    if(number === 1) {
                        value = 11;
                    }
                    return value;
                };
                /** @returns {String} The full name of the card. "Ace of Spades" */
                this.getName = function (){
                    var cardName = '';
                    switch (number){
                        case 1:
                            cardName = "A";
                            break;
                        case 13:
                            cardName = "K";
                            break;
                        case 12:
                            cardName = "Q";
                            break;
                        case 11:
                            cardName = "J";
                            break;
                        default:
                            cardName = number;
                            break;
                    }
                    return cardName+this.getSymbol();
                };
            };
            /** @constructor */
            var Deck = function (num_decks){
                var cards = [];
                var _redeal_listeners = [];
                var _card_dealt_listener = [];
                /** Creates a new set of cards. */
                var newCards = function (){
                    var i,
                        d,
                        suit,
                        number;
                    for (d =0; d < num_decks; ++d){
                        for (i=0;i<52;i++){
                            suit = i%4+1;
                            number = i%13+1;
                            cards.push(new Card(suit,number));
                        }
                    }
                    _redeal_listeners.map(function(cb){
                        cb();
                    });
                };
                /* Create those new cards. */
                newCards();
                /** Shuffles the cards. Modifies the private instance of the cards array.
                 * @returns {Array} An array of Cards representing the shuffled version of the deck.
                 */

                this.cards = cards;

                this.shuffle = function (){
                    for(var j, x, i = cards.length; i; j = parseInt(Math.random() * i), x = cards[--i], cards[i] = cards[j], cards[j] = x);
                    return cards;
                };
                /** @returns {Array} An array of cards representing the Deck. */
                this.getCards = function (){
                    return cards;
                };
                /** @returns {Card} Deals the top card off the deck. Removes it from the Deck. */
                this.deal = function (){
                    if (!cards.length){
                        //console.log("Ran out of cards, new deck");
                        newCards();
                        this.shuffle();
                    }
                    var card = cards.pop();
                    _card_dealt_listener.map(function(cb){
                        cb(card);
                    });
                    return card;
                };


                this.AddRedealListener = function(callback){
                    _redeal_listeners.push(callback);
                }

                this.AddCardDealtHandler = function(callback){
                    _card_dealt_listener.push(callback);
                }
            };
            /** @constructor */
            var Hand = function (deck, args){
                var cards = [];
                this.mult = 1;

                if (args && args.start_cards){
                    cards = args.start_cards;
                }
                else {
                    /* Deal two cards to begin. */
                    cards.push(deck.deal());
                    if (!args || !args.is_dealer){
                        cards.push(deck.deal());
                    }
                }

                var finished = false;
                this.finish = function(){
                    finished = true;
                }

                this.finished = function(){
                    return (finished || this.score() > 21);
                }


                /** @returns {Array} The array of Cards representing the Hand. */
                this.getHand = function (){
                    return cards;
                };
                /** @returns {Number} The score of the Hand. */
                this.score = function (){
                    var i,
                        score = 0,
                        cardVal = 0, // Stashing the Card's value
                        aces = 0; // Stores the # of Aces in the Hand

                    for (i=0;i<cards.length;i++){
                        cardVal = cards[i].getValue();
                        if (cardVal == 11) {
                            aces += 1;
                        }
                        score += cardVal;
                    }
                    /* Check to see if Aces should be 1 or 11 */
                    while (score > 21 && aces > 0){
                        score -= 10;
                        aces -=1;
                    }
                    return score;
                };

                this.isSoft = function(){
                    var score = 0;
                    var aces = 0;
                    for (i=0;i<cards.length;i++){
                        cardVal = cards[i].getValue();
                        if (cardVal == 11) {
                            aces += 1;
                        }
                        score += cardVal;
                    }
                    /* Check to see if Aces should be 1 or 11 */
                    while (score > 21 && aces > 0){
                        score -= 10;
                        aces -=1;
                    }
                    return (aces > 0)
                }

                /** @returns {String} Comma separated list of Card names in the Hand. */
                this.printHand = function (){
                    var arrayOut = [],
                        i;

                    for (i=0;i<cards.length;i++){
                        arrayOut.push(cards[i].getName());
                    }
                    return arrayOut.join();
                };
                /** Adds a Card from the Deck into the Hand. */
                this.hitMe = function (){
                    cards.push(deck.deal());
                };
            };

            //+ Jonas Raoni Soares Silva
            //@ http://jsfromhell.com/array/shuffle [v1.0]
            function shuffle(o){ //v1.0
                for(var j, x, i = o.length; i; j = Math.floor(Math.random() * i), x = o[--i], o[i] = o[j], o[j] = x);
                return o;
            };

            function BlackJackSim(args){
                this.other_players = args.other_players;
                this.other_hands = [];

                this.strategy = args.strategy;

                this.name = args.name;

                this.num_decks = args.num_decks;
                this.deck = new Deck(this.num_decks);
                this.deck.AddCardDealtHandler(this.strategy.CardDealt);
                this.deck.AddRedealListener(this.strategy.DeckRedealed);

                this.winnings = 0;
                this.wins = 0;
                this.losses = 0;
                this.money_bet = 0;
            }

            BlackJackSim.prototype.RedealDeck = function(){
                while(this.discard.length > 0){
                    this.deck.push(this.discard.pop());
                }
                shuffle(this.deck);
            }

            BlackJackSim.prototype.DealCard = function(){
                if (deck.length == 0){
                    this.RedealDeck();
                    this.strategy.NotifyRedeal();
                }
                var card = this.deck.pop();
                this.strategy.NotifyDeal(card);
                this.discarded.push(card);
                return card;
            }

            BlackJackSim.prototype.RoundGoing = function(){

            }

            BlackJackSim.prototype.PlayRound = function(bet){
                //Deal two cards to all other players

                this.player_hands = [new Hand(this.deck)];
                //Deal one card to dealer
                this.dealer_hand = new Hand(this.deck, {is_dealer: true});
                while (true){
                    //for (var i = 0; i != this.other_players; ++i){
                        //if (this.other_scores[i] < 17){
                            //this.other_scores[i].hitMe();
                        //}
                    //}
                    var hands_finished = 0;
                    for (var k = 0; k != this.player_hands.length; ++k){
                        var hand = this.player_hands[k];
                        if (hand.finished()){
                            hands_finished += 1;
                            continue;
                        }
                        var move = this.strategy.GetMove(hand, this.dealer_hand);
                        if (move == 'hit'){
                            hand.hitMe();
                        }
                        else if (move == 'stand') {
                            hand.finish();
                        }
                        else if (move == 'split'){
                            var cards = hand.getHand();
                            var card = cards.pop();
                            this.player_hands.push(new Hand(this.deck, {start_cards: [card]}))
                        }
                        else if (move == 'double'){
                            hand.hitMe();
                            if (hand.getHand().length == 3){
                                hand.mult = 2;
                                break;
                            } else {
                                ;
                            }
                        }
                        else {
                            alert(move);
                            hand.finish();
                            break;
                        }
                    }

                    if (hands_finished >= this.player_hands.length){
                        break;
                    }
                }
                while (this.dealer_hand.score() < 18){ //hits on 17
                    this.dealer_hand.hitMe();
                }
                for (var k = 0; k != this.player_hands.length; ++k){
                    var hand = this.player_hands[k];
                    if (hand.score() > 21){
                        this.Lose(hand.mult*bet);
                    } else {
                        if (this.dealer_hand.score() > 21){
                            this.Win(hand.mult*bet, hand);
                        } 
                        else if (this.dealer_hand.score() == hand.score()){
                            this.Draw();
                        }
                        else if (this.dealer_hand.score() < hand.score()){
                            this.Win(hand.mult*bet, hand);
                        } else {
                            this.Lose(hand.mult*bet);
                        }
                    }
                }
            }

            BlackJackSim.prototype.Draw = function(){
                this.losses += 1;
            }

            BlackJackSim.prototype.Win = function(bet, hand){
                this.wins += 1;
                if (hand.score == 21 && hand.getHand().length == 2){
                    this.winnings += 1.5*bet;
                } else {
                    this.winnings += bet;
                }
                this.money_bet += bet;
            }
            BlackJackSim.prototype.Lose = function(bet){
                this.losses += 1;
                this.winnings -= bet;
                this.money_bet += bet;
            }

            BlackJackSim.prototype.win_rate = function(){
                var f = 100 * (this.wins/ ( this.wins + this.losses ));
                return f.toFixed(3);
            }
            BlackJackSim.prototype.returns = function(){
                var f = 100 * (this.winnings / this.money_bet);
                return f.toFixed(3);
            }

            return BlackJackSim;
        }]);
})();
