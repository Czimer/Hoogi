var express = require('express');
var hoogBL = require("../bl/hoogBL")
var router = express.Router();

/* GET hoogs listing. */
router.get('/', async function(req, res, next) {
    const hoogs = await hoogBL.GetAllHoogs();
    res.send(hoogs)
});

router.post('/getAllHoogsNames', async function(req, res, next) {
    try{
        const hoogs = await hoogBL.GetAllHoogsNames(req, res, next);
        res.send(hoogs)
    }
    catch(err){
        res.status(500).end()   
    }
});

/* GET hoogs with params */
router.post('/', async function(req, res, next){
    try{
        const filteredHoogs = await hoogBL.GetHoogsByParams(req, res, next);
        res.send(filteredHoogs)
    }
    catch(err){
        res.status(500).end()   
    }
});

router.post('/:params', async function(req, res, next){    
    try{
        const filteredHoogs = await hoogBL.GetHoogsByParams(req, res, next);
        res.send(filteredHoogs)
    }
    catch(err){
        res.status(500).end()   
    }
});

router.post('/getAllHoogsByManagerId/:params', async function(req, res, next){
    try{
        const hoogsPerManager = await hoogBL.getAllHoogsByManagerId(req, res, next);
        res.send(hoogsPerManager);
    }
    catch(err){
        res.status(500).end()   
    }
})

router.post('/deleteHoogById/:params', async function(req, res, next){
    try{
        const deletedHoog  = await hoogBL.deleteHoogById(req, res, next);
        res.send(deletedHoog);
    }
    catch(err){
        res.status(500).end()   
    }
})

router.post('/addNewHoog/:params', async function(req, res, next){
    try{
        const addedHoog = await hoogBL.addNewHoog(req, res, next);
        res.send(addedHoog);
    }
    catch(err){
        res.status(500).end()   
    }    
})

router.post('/editHoog/:params', async function(req, res, next){
    try{
        const editedHoog = await hoogBL.editHoog(req, res, next);
        res.send(editedHoog);
    }
    catch(err){
        res.status(500).end()   
    }    
})


router.get('/all', function(req, res, next) {
    res.send('respond with a resource 2'); //todo ?
});

module.exports = router;
