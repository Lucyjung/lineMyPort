// FX Service
const axios = require('axios');
module.exports = {

    getPrice: async (symbols) => {
        if (symbols.length <= 0){
            return null;
        }
        else{
            let result = {};
            let response = await axios.get('https://openexchangerates.org/api/latest.json?app_id=e6dce8e61b9a4ddf97dee3bc5473af3f');
            for (let symbol of symbols){
                if (response && response.data){
                    if (symbol == 'USD'){
                        result[symbol] = response.data.rates['THB'];
                    } else{
                        result[symbol] = response.data.rates['THB']/response.data.rates[symbol];
                    }
                }
            }
            return result;
        }
        
    }
};