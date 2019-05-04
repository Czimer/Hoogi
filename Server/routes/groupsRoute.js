var express = require('express');
var groupBL = require("../bl/groupBL")
var router = express.Router();

/* GET groups listing. */
router.get('/', async function(req, res, next) {
    const groups = await groupBL.GetAllGroups();
    res.send(groups)
});

/* GET groups with id of manager */

router.post('/', async function(req, res, next){
    const filteredGroupsByManager = await groupBL.GetAllGroupsOfSpecificManager(req, res, next);
    res.send(filteredGroupsByManager)
});

router.post('/:params', async function(req, res, next){
    const filteredGroupsByManager = await groupBL.GetAllGroupsOfSpecificManager(req, res, next);
    res.send(filteredGroupsByManager)
});



router.get('/all', function(req, res, next) {
    res.send('respond with a resource 2'); //todo ?
});

router.post('/addNewGroup/:params', async function(req, res, next){
    const newGroup = await groupBL.addNewGroup(req, res, next);
    res.send(newGroup);
});

router.post('/registerNewParticipantToGroup/:params', async function(req, res, next){
    const registerNewParticipant = await groupBL.RegisterNewParticipantTpGroup(req, res, next);
    res.send(registerNewParticipant);
});

router.delete('/', async function(req, res, next){
    res.send('respond with a resource 2');
});

router.delete('/deleteGroupById', async function(req, res, next){
    const deletedGroup = await groupBL.deleteGroupById(req, res, next);
    res.send(deletedGroup);
});

router.delete('/removeChildFromGroupById:params', async function(req, res, next){
    const removedChild = await groupBL.removeChildFromGroupById(req, res, next);
    res.send(removedChild);
})

module.exports = router;
