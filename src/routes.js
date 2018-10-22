const AssetController = require('./controllers/AssetController');

module.exports =  [

    {
        method: 'GET',
        path: '/portfoilo/{user?}',
        handler: AssetController.getAsset
    },
    {
        method: 'POST',
        path: '/portfoilo/buy/{user?}',
        handler: AssetController.buyAsset
    },
    {
        method: 'POST',
        path: '/portfoilo/sell/{user?}',
        handler: AssetController.sellAsset
    },
    {
        method: 'POST',
        path: '/portfoilo/dividend{user?}',
        handler: AssetController.assetDividend
    },
    {
        method: 'POST',
        path: '/portfoilo/update/{user?}',
        handler: AssetController.updateAsset
    },
];
