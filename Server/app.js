const express = require("express");
const { postgraphile } = require("postgraphile");

const app = express();

const connectionString = 'postgres://ncaghsyivfudse:1ef06a45824934a1ae55f2690701ba6d874e359fb317f975e2f608bd9238badf@ec2-184-73-153-64.compute-1.amazonaws.com:5432/d4cvss8ktmk37i?sslmode=require&ssl=1'

app.use(postgraphile(connectionString,'public',{
	graphiql:true
}));

app.listen(process.env.PORT || 3000);