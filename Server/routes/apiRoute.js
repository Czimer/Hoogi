var usersRouter = require('./usersRoute');
var express = require('express');
var router = express.Router();

router.use('/users', usersRouter);

module.exports = router
