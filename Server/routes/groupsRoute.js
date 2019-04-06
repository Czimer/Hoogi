var express = require('express');
var groupBL = require("../bl/groupBL")
var router = express.Router();

/* GET groups listing. */
router.get('/', async function(req, res, next) {
    const groups = await groupBL.GetAllGroups();

    res.send(groups)
});

/* GET groups with id of manager */
router.get('/:params', async function(req, res, next){
    const filteredGroupsByManager = await hoogsBL.GetAllGroupsOfSpecificManager(req, res, next);
    res.send(filteredGroupsByManager)
});



router.get('/all', function(req, res, next) {
    res.send('respond with a resource 2'); //todo ?
});

module.exports = router;
