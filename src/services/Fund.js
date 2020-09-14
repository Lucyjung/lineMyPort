// Fund Service
const axios = require('axios');
module.exports = {

    getPrice: async (symbols) => {
        const LIMIT_RETRIES = 7;
        if (symbols.length <= 0){
            return null;
        }
        else{
            for (let i = 0; i < LIMIT_RETRIES; i++){
                try{
                    let price_list = await getFundAPI(symbols,i);
                    if (price_list && Object.keys(price_list).length > 0){
                        return price_list;
                    }
                }catch (err){
                    continue;
                }
            }
        }
        
    }
};
async function getFundAPI(symbols, subtract_day) {
    if (!subtract_day) subtract_day = 0;
    const moment = require('moment');
    let d = moment().subtract(subtract_day, 'days').format('DD/MM/YYYY');
    let postData = {"amcId":"All","investmentPolicy":"All","dividendPolicy":"All","change":"All","projectType":"All"}

    postData.symbols = symbols
    postData.date = d
    let fundData = {};
    let remnant = [];
    const response = await axios.post('https://api.settrade.com/api/fund-nav/by-condition', postData);
    if (response && response.data && response.data.fundNavs){
        let funds = response.data.fundNavs
        for (let fund of funds){
            fundData[fund.symbol] = fund.navPerUnit
        }
    }

    for (let symbol of symbols){
        if (!fundData[symbol]){
            remnant.push(symbol)
        }
    }

    if (remnant.length > 0 ){
        fundData = getFund(remnant,subtract_day, fundData)
    }
    return fundData;    
}
async function getFund(symbols, subtract_day, fundData) {
    if (!subtract_day) subtract_day = 0;
    const moment = require('moment');
    let d= moment().subtract(subtract_day, 'days').add(543,'year').format('DD/MM/YYYY');
    const response = await axios.get('https://www.thaimutualfund.com/AIMC/aimc_navCenterDownloadRepRep.jsp?date=' + d);
    if (response && response.data){
        let data = response.data.split('\n');
        
        for (let i in data){
            if (data[i] && data[i] != ''){
                let tmpData = data[i].split(',');
                if (tmpData.length > 1){
                    searchFundNav(symbols, tmpData, fundData);
                }
            }
        }
    }
    return fundData;    
}
function searchFundNav(symbols, fundRawArr, result){

    if (fundRawArr[6]){
        let fundName = fundRawArr[6];
        fundName = fundName.replace(new RegExp('"', 'g'), '');
        if (symbols.indexOf(fundName) > -1){
            let nav = fundRawArr[8];
            nav = nav.replace(new RegExp('"', 'g'), '');
            result[fundName] = nav;
        }
    }
}
