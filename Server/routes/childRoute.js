var express = require('express');
var router = express.Router();
var childBL = require('../bl/childBL')
var upload = require('../utils/fileUploader')

router.post('/upload', upload.single('photo'), async (req, res, next) => {
    try {
        await childBL.saveChildPhoto(req.body.childId, req.file)
        res.end()
    }
    catch (err) {
        res.status(500).end()
    }
})

router.post('/getChildsPhotos', async (req, res, next) => {
    try {
        const photos = await childBL.getChildsPhotos(req.body.childsIds)
        res.send(photos)
    }
    catch (err) {
        res.status(500).end()
    }
})

module.exports = router;