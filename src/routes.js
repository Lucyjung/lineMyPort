const AssetController = require('./controllers/AssetController');

module.exports =  [

    {
        method: 'GET',
        path: '/portfoilo/{user?}',
        config: {
            cors : true,
        },
        handler: AssetController.getAsset
    },
    {
        method: 'POST',
        path: '/portfoilo/buy/{user?}',
        config: {
            cors : true,
        },
        handler: AssetController.buyAsset
    },
    {
        method: 'POST',
        path: '/portfoilo/sell/{user?}',
        config: {
            cors : true,
        },
        handler: AssetController.sellAsset
    },
    {
        method: 'POST',
        path: '/portfoilo/dividend{user?}',
        config: {
            cors : true,
        },
        handler: AssetController.assetDividend
    },
    {
        method: 'POST',
        path: '/portfoilo/update/{user?}',
        config: {
            cors : true,
        },
        handler: AssetController.updateAsset
    },
];
