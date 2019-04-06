var usersRouter = require('./usersRoute');
var hoogsRouter = require('./hoogsRoute');
var express = require('express');
var router = express.Router();

router.use('/users', usersRouter);
router.use('/hoogs', hoogsRouter);

module.exports = router;
