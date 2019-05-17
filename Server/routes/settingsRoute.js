let express = require('express');
let settingsBL = require("../bl/settingsBL");
let router = express.Router();

// Get children events
router.post('/parent', async function(req, res, next) {
    console.log("route");
    const parentSettings = await settingsBL.GetParentSettings(req.body.parentId);
    res.send(parentSettings)
});

module.exports = router;