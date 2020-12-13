// FX Service
const axios = require('axios');
module.exports = {

    getPrice: async (symbols) => {
        if (symbols.length <= 0){
            return null;
        }
        else{

            let response = await axios.get('https://api.exchangeratesapi.io/latest?base=THB');
            let result = {};
            for (let symbol of symbols){
                if (response && response.data && response.data.rates[symbol]){
                    result[symbol] = response.data.rates[symbol]
                }
            }
            return result;
        }
        
    }
};