var express = require('express');
var hoogBL = require("../bl/hoogBL")
var router = express.Router();

/* GET hoogs listing. */
router.get('/', async function(req, res, next) {
    const hoogs = await hoogBL.GetAllHoogs();
    res.send(hoogs)
});

router.post('/getAllHoogsNames', async function(req, res, next) {
    const hoogs = await hoogBL.GetAllHoogsNames(req, res, next);
    res.send(hoogs)
});

/* GET hoogs with params */
router.post('/', async function(req, res, next){
    const filteredHoogs = await hoogBL.GetHoogsByParams(req, res, next);
    res.send(filteredHoogs)
});

router.post('/:params', async function(req, res, next){
    const filteredHoogs = await hoogBL.GetHoogsByParams(req, res, next);
    res.send(filteredHoogs)
});

router.post('/getAllHoogsByManagerId/:params', async function(req, res, next){
    const hoogsPerManager = await hoogBL.getAllHoogsByManagerId(req, res, next);
    res.send(hoogsPerManager);
})

router.post('/deleteHoogById/:params', async function(req, res, next){
    const deletedHoog  = await hoogBL.deleteHoogById(req, res, next);
    res.send(deletedHoog);
})

router.post('/addNewHoog/:params', async function(req, res, next){
    const addedHoog = await hoogBL.addNewHoog(req, res, next);
    res.send(addedHoog);
})

router.post('/editHoog/:params', async function(req, res, next){
    const editedHoog = await hoogBL.editHoog(req, res, next);
    res.send(editedHoog);
})


router.get('/all', function(req, res, next) {
    res.send('respond with a resource 2'); //todo ?
});

module.exports = router;
