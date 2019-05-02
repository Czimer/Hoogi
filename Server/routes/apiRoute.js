var usersRouter = require('./usersRoute');
var hoogsRouter = require('./hoogsRoute');
var groupsRouter = require('./groupsRoute');
var parentsAndChildsRoute = require('./parentsAndChildsRoute');
var generalRoute = require('./generalRoute');
var express = require('express');
var router = express.Router();

router.use('/users', usersRouter);
router.use('/hoogs', hoogsRouter);
router.use('/groups', groupsRouter);
router.use('/parentsAndChilds', parentsAndChildsRoute);
router.use('/general', generalRoute);

module.exports = router;