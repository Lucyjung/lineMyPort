// Fund Service
const axios = require('axios');
module.exports = {

    getPrice: async (symbols) => {
        const LIMIT_RETRIES = 9;
        if (symbols.length <= 0){
            return null;
        }
        else{
            
            let fundData = {};
            for (let i = 0; i < LIMIT_RETRIES; i++){
                try{
                    fundData = await getFundAPI(symbols,i, fundData);
                    if (fundData && Object.keys(fundData).length == symbols.length){
                        return fundData;
                    }
                }catch (err){
                    continue;
                }
            }
            return fundData;
        }
        
    }
};
async function getFundAPI(symbols, subtract_day, fundData) {
    if (!subtract_day) subtract_day = 0;
    const moment = require('moment');
    let d = moment().subtract(subtract_day, 'days').format('DD/MM/YYYY');
    let postData = {'amcId':'All','investmentPolicy':'All','dividendPolicy':'All','change':'All','projectType':'All'};

    postData.symbols = symbols;
    postData.date = d;
    
    const response = await axios.post('https://api.settrade.com/api/fund-nav/by-condition', postData);
    if (response && response.data && response.data.fundNavs){
        let funds = response.data.fundNavs;
        for (let fund of funds){
            if (!fundData[fund.symbol]){
                fundData[fund.symbol] = fund.navPerUnit;
            }
        }
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
