var express = require('express');
var eventBL = require("../bl/eventBL")
var router = express.Router();

router.post('/create', async function(req, res, next) {
    const newEvent = await eventBL.CreateEvent();
    res.send(newEvent)
});

router.post('/update', async function(req, res, next) {
    const event = await eventBL.UpdateEvent();
    res.send(event)
});

router.post('/getByGroups', async function(req, res, next) {
    const events = await eventBL.GetEventsByGroups(req.body.groups);
    console.log(events);
    res.send(events);
});

module.exports = router;