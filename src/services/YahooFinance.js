// Stock Service by Yahoo Finance Api

module.exports = {

    getPrice:  (symbols) => {
        return new Promise((fulfilled)=> { 
            // working
            let yahooFinance = require('yahoo-finance');
            let param = symbols+'.BK';
            try {
                yahooFinance.quote({
                    symbol: param,
                    modules: [ 'price'] // see the docs for the full list
                }, function(error, data) {
                    if (data){
                        fulfilled( data.price.regularMarketPrice);
                    }else{
                        fulfilled(null) ;
                    }
                });
            }catch(err){
                fulfilled(null) ;
            }
        });
        
      
  
    }
};