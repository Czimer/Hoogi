const express = require("express");
const { postgraphile } = require("postgraphile");
const config = require('./appConfig')
const app = express();

app.use(postgraphile(config.ConnectionString, 'public', {
	graphiql: true
}));

app.listen(process.env.PORT || 3000);