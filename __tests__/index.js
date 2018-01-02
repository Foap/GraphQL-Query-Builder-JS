require("babel-register");

global.process.env.GRAPHQL_URL = `http://localhost:3101`;
global.process.env.SCHEMA_PATH = __dirname + '/temp/schema.json';
