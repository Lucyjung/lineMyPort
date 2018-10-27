// Fund Service
const FILE_NAME = 'fund.csv';
module.exports = {

    getPrice: async (symbols) => {
        const LIMIT_RETRIES = 7;
        if (symbols.length <= 0){
            return null;
        }
        else{
            for (let i = 0; i < LIMIT_RETRIES; i++){
                try{
                    let price_list = await getFundNav(symbols,i);
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

function getFundNav(symbols, subtract_day){

    return new Promise((fulfilled) => { 
        let fs = require('fs');
        let http = require('http');
        let file = fs.createWriteStream(FILE_NAME);

        if (!subtract_day) subtract_day = 0;
        let moment = require('moment');
        let d= moment().subtract(subtract_day, 'days').add(543,'year').format('DD/MM/YYYY');
        
        http.get('http://www.thaimutualfund.com/AIMC/aimc_navCenterDownloadRepRep.jsp?date='+d, function(response){
            response.pipe(file);
            const readline = require('readline');
            const rl = readline.createInterface({
                input: fs.createReadStream(FILE_NAME),
                crlfDelay: Infinity
            });
            let result = {};
            rl.on('line', (line) => {
                
                if (line != ''){
                    line = line.replace(new RegExp('"', 'g'), '');
                    let dataArr = line.split(',');
                    
                    if (symbols.indexOf(dataArr[6]) > -1){
                        result[dataArr[6]] = dataArr[8];
                    }
                }
            }).on('close', () => {
                
                fulfilled(result);
            });
        });
         
        
    });
    
}