var express = require('express');
var parentsAndChildsBL = require("../bl/parentsAndChildsBL")
var router = express.Router();

/* GET hoogs listing. */
router.get('/', async function(req, res, next) {
    const hoogs = await parentsAndChildsBL.GetParentsAndChildrenOfGroup(req, res, next);

    res.send(hoogs)
});

/* GET hoogs with params */
router.post('/', async function(req, res, next){
    const filteredHoogs = await parentsAndChildsBL.GetParentsAndChildrenOfGroup(req, res, next);
    res.send(filteredHoogs)
});

router.post('/:params', async function(req, res, next){
    const filteredHoogs = await parentsAndChildsBL.GetParentsAndChildrenOfGroup(req, res, next);
    res.send(filteredHoogs)
});



router.get('/all', function(req, res, next) {
    res.send('respond with a resource 2'); //todo ?
});

module.exports = router;
