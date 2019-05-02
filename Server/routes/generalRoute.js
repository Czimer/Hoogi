var express = require('express');
var router = express.Router();
var genenralBl = require('../bl/generalBL')

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
    const data = await genenralBl.performSignIn()
    if (data) {
        res.send(data)
    }
    else {
        res.status(500).end()
    }
});

module.exports = router;