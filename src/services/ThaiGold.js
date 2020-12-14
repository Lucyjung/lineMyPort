const cheerio = require('cheerio');
const url = 'https://xn--42cah7d0cxcvbbb9x.com/';
const request = require('request');

module.exports = {

    getPrice: async (symbols) => {
        if (symbols.length <= 0){
            return null;
        }
        else{
            let result = {};
            request(url, (error, response, html) => {
                if (!error && response.statusCode === 200) {
                  const $ = cheerio.load(html)
                  date = $('#rightCol > div.divgta.goldshopf > table > tbody > tr:nth-child(5) > td.span.bg-span.txtd.al-r').text()
                  update_time = $('#rightCol > div.divgta.goldshopf > table > tbody > tr:nth-child(5) > td.em.bg-span.txtd.al-r').text()
                  gold_buy = $('#rightCol > div.divgta.goldshopf > table > tbody > tr:nth-child(3) > td:nth-child(3)').text()
                  gold_sell = $('#rightCol > div.divgta.goldshopf > table > tbody > tr:nth-child(3) > td:nth-child(2)').text()
                  goldBar_buy = $('#rightCol > div.divgta.goldshopf > table > tbody > tr:nth-child(2) > td:nth-child(3)').text()
                  goldBar_sell = $('#rightCol > div.divgta.goldshopf > table > tbody > tr:nth-child(2) > td:nth-child(2)').text()
                  for (let symbol of symbols){
                    if (gold_buy){
                        result[symbol] = gold_buy
                    }
                  }
                }
            });
            return result;
        }
        
    }
};