const swaggerAutogen = require("swagger-autogen")();

const outputFile = "./swagger-output.json";
const routes = ["./src/routes/index.routes.ts"];

const doc = {
    info: {
        title: "MyApp",
        description: "Description",
    },
    host: "localhost:8080",
    schemes: ["http"],
    tags: [
        {
            name: "Authentication",
        },
        {
            name: "Users",
        },
    ],
};

/* NOTE: If you are using the express Router, you must pass in the 'routes' only the 
root file where the route starts, such as index.js, app.js, routes.js, etc ... */

swaggerAutogen(outputFile, routes, doc);
