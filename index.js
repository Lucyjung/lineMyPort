const Hapi = require('hapi');
const routes = require('./src/routes.js');
const config = require('./src/config');


// Start Host Server
const server = Hapi.server(config.application);

server.connection({ routes: { cors: true } });

// Setting Controller route
for (let route in routes) {
    server.route(routes[route]);
}
// Start the server
const start = async () => {

    try {

        // Start!!
        await server.start();
    }
    catch (err) {
        console.log(err);
        process.exit(1);
    }

    console.log('Server running at:', server.info.uri);
};

start();

