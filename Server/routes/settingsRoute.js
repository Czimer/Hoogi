let express = require('express');
let settingsBL = require("../bl/settingsBL");
let router = express.Router();

// Get parent settings
router.post('/parent', async function(req, res, next) {
    const parentSettings = await settingsBL.GetParentSettings(req.body.parentId);
    res.send(parentSettings)
});

// 
router.post('/update', async function(req, res, next) {
    const parentNewSetting = await settingsBL.UpdateParentSettings(req.body.id, req.body.is_active);
    res.send(parentNewSetting)
});

module.exports = router;