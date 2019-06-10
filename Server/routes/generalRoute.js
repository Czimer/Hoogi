var express = require('express');
var router = express.Router();
var genenralBl = require('../bl/generalBL')
var upload = require('../utils/fileUploader')
var pushNotificationsService = require('../pushNotifications/pushNotificationsService')

router.post('/signUp', async (req, res, next) => {
    try {
        await genenralBl.performSignUp(req.body)
        res.end()
    }
    catch (err) {
        res.status(500).end()
    }
});

router.post('/signIn', async (req, res, next) => {
    const { email, password } = req.body
    try {
        const data = await genenralBl.performSignIn(email, password)
        res.send(data)
    }
    catch (err) {
        res.status(500).end()
    }
});

router.post('/upload', upload.single('photo'), async (req, res, next) => {
    try {
        await genenralBl.saveFilAsBlob(req.body, req.file)
        res.end()
    }
    catch (err) {
        res.status(500).end()
    }
})

router.post('/registerPushService', async (req, res, next) => {
    const { token, user } = req.body
    pushNotificationsService.saveToken({ user, token })
})

router.post('/pushMessage', async (req, res, next) => {
    const { messageType, details, token } = req.body
    pushNotificationsService.push(messageType, details, token)
})

module.exports = router;