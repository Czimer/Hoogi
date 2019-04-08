var usersRouter = require('./usersRoute');
var hoogsRouter = require('./hoogsRoute');
var groupsRouter = require('./groupsRoute');
var express = require('express');
var router = express.Router();

router.use('/users', usersRouter);
router.use('/hoogs', hoogsRouter);
router.use('/groups', groupsRouter);

module.exports = router;
