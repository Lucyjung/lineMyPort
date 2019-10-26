let yahooFinance = require('yahoo-finance');
let param = 'PTT.BK';

yahooFinance.quote({
    symbol: param,
    modules: [ 'price', 'summaryDetail'] // see the docs for the full list
}, function(error, data) {
    console.log(data)
});
