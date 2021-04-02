// FX Service
const axios = require('axios');
module.exports = {

    getPrice: async (symbols) => {
        if (symbols.length <= 0){
            return null;
        }
        else{
            let result = {};
            for (let symbol of symbols){
                let response = await axios.get('https://free.currconv.com/api/v7/convert?q=' + symbol + '_THB&compact=ultra&apiKey=6f00b379453f8372bc23');
                if (response && response.data && response.data[symbol + '_THB']){
                    result[symbol] = response.data[symbol + '_THB']
                }
            }
            return result;
        }
        
    }
};