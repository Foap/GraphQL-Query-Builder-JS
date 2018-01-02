require("babel-register");

global.process.env.GRAPHQL_URL = `http://localhost:3101`;
global.process.env.SCHEMA_PATH = __dirname + '/temp/schema.json';
global.process.app = process.env.NODE_ENV === 'production' ? require(__dirname + '/../lib/index.js') : require(__dirname + '/../src/index.js');
