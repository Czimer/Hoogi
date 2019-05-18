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



router.get('/all', function(req, res, next) {
    res.send('respond with a resource 2'); //todo ?
});

module.exports = router;
