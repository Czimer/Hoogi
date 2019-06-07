let express = require('express');
let parentsAndChildsBL = require("../bl/parentsAndChildsBL");
let router = express.Router();

/* GET hoogs listing. */
router.get('/', async function(req, res, next) {
    const hoogs = await parentsAndChildsBL.parentAndChildBL.GetParentsAndChildrenOfGroup(req, res, next);

    res.send(hoogs)
});

/* GET hoogs with params */
router.post('/', async function(req, res, next){
    const filteredHoogs = await parentsAndChildsBL.parentAndChildBL.GetParentsAndChildrenOfGroup(req, res, next);
    res.send(filteredHoogs)
});

router.post('/:params', async function(req, res, next){
    const filteredHoogs = await parentsAndChildsBL.parentAndChildBL.GetParentsAndChildrenOfGroup(req, res, next);
    res.send(filteredHoogs)
});

router.post('/childrenOfParentId/:params', async function(req, res, next){
    const filteredHoogs = await parentsAndChildsBL.parentAndChildBL.GetChildrenOfParentId(req, res, next);
    res.send(filteredHoogs)
});

// Get children events
router.post('/child/events', async function(req, res, next) {
    const childGroups = await parentsAndChildsBL.childBL.GetChildrenEvents(req.body.parentId);
    res.send(childGroups)
});



router.get('/all', function(req, res, next) {
    res.send('respond with a resource 2'); //todo ?
});

module.exports = router;
