/** Anthony Guo (anthony.guo@some.ox.ac.uk)
 *
 * Service for real time graphs
 */
(function(){
    // Interprets input received from the socket.
    // Each input corresponds to an event. When an event
    // is triggered, all registered callbacks are invoked.
    angular.module('blackjackapp.services').factory('VisualizationService',
    [ function() {
        DATA_LENGTH = 100;
        INTERVAL = 10;
        HOURS_PER_ROUND = 5;
        console.log('Realtime service executed');
        var _data = {
            tables : [],
            chart: {
                data: [],
                series: [],
                labels: []
            }
        }

        var _callbacks = [];
        var c =0;

        function HoursPlayed(){
            //350 rounds per hour
            var rounds_played =  350 * 3 * c;
            return moment.duration(HOURS_PER_ROUND*c, "hours").format();
        }

        function UpdateChart(){
            var chart = _data.chart;
            chart.data.map(function(d){
                d.push(0);
                d.shift();
            });
            while (chart.labels.length < DATA_LENGTH){
                chart.labels.push(' ');
            }
            if (c % INTERVAL == 0){
                //chart.labels.push(moment().format('hh:mm:ss'));
                chart.labels.push(HoursPlayed());
            } else {
                chart.labels.push(' ');
            }
            if (chart.labels.length > DATA_LENGTH){
                chart.labels.shift();
            }
            c += 1;
            for (var i = 0; i != _data.tables.length; ++i){
                var game = _data.tables[i].game;
                var index = chart.series.indexOf(game.name);
                if (index == -1){
                    chart.series.push(game.name)
                    var d = [];
                    for (var j = 0; j != DATA_LENGTH; ++j){
                        d.push(0);
                    }
                    chart.data.push(d);
                    index = chart.data.length - 1;
                }
                chart.data[index][chart.data[index].length-1] = game.winnings;
            }
            // draw zero line
            var index = chart.series.indexOf('Zero');
            if (index == -1){
                chart.series.push('Zero')
                var d = [];
                for (var j = 0; j != DATA_LENGTH; ++j){
                    d.push(0);
                }
                chart.data.push(d);
                index = chart.data.length - 1;
            }
            chart.data[index][chart.data[index].length-1] = 0;
        }

        function UpdateLoop(){
            _data.tables.map(function(data){
                var game = data.game;
                var strategy = data.strategy;
                for (var i = 0; i != 350 * HOURS_PER_ROUND; ++i){
                    game.PlayRound(strategy.GetBet());
                }
            });
            UpdateChart();
            setTimeout(UpdateLoop, 30);
            for (var i = 0; i != _callbacks.length; ++i){
                _callbacks[i]();
            }
        }

        function AddDataHandler(callback){
            _callbacks.push(callback);
        }

        function AddGameState(game){
            _data.tables.push(game);
        }

        function Reset(){
            _data.tables.map(function(data){
                var game = data.game;
                game.winnings = 0;
                game.losses = 0;
                game.wins = 0;
                game.money_bet = 0;

            })
            _data.chart = {
                data: [],
                series: [],
                labels: []
            }
        }

        UpdateLoop();

        return {
            AddDataHandler: AddDataHandler,
            AddGameState: AddGameState,
            Reset: Reset,
            Data: _data
        }
    }]);
})();
