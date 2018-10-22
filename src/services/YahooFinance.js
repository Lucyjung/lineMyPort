// Stock Service by Yahoo Finance Api
module.exports = {

    getPrice: async (symbols) => {
  
        // working
        let yahooFinance = require('yahoo-finance');
        let param = symbols+'.BK';
        try {
            yahooFinance.quote({
                symbol: param,
                modules: [ 'price'] // see the docs for the full list
            }, function(error, data) {
                if (data){
                    return data.price.regularMarketPrice;
                }else{
                    return null;
                }
            });
        }catch(err){
            return null;
        }
      
  
    }
};