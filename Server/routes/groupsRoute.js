var express = require('express');
var groupBL = require("../bl/groupBL")
var upload = require('../utils/fileUploader')
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

router.post('/editNewGroup/:params', async function(req, res, next){
    const editedGroup = await groupBL.editGroupById(req, res, next);
    res.send(editedGroup);
});

router.post('/deleteGroupById/:params', async function(req, res, next){
    const deletedGroup = await groupBL.deleteGroupById(req, res, next);
    res.send(deletedGroup);
});

router.post('/removeChildFromGroupById/:params', async function(req, res, next){
    const removedChild = await groupBL.removeChildFromGroupById(req, res, next);
    res.send(removedChild);
})

router.post('/upload', upload.single('photo'), async (req, res, next) => {
    try {
        await groupBL.savePhotoByGroupMessageId(req.body.messageId, req.file)
        res.end()
    }
    catch (err) {
        res.status(500).end()
    }
})

router.get('/getPhotosLinks', async (req, res, next) => {
    try {
        const photos = await groupBL.getPhotosLinks(Number(req.query.messageId),Number(req.query.entityId),req.query.isManager)
        res.send(photos)
    }
    catch (err) {
        res.status(500).end()
    }
})

module.exports = router;
