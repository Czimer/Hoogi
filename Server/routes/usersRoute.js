var express = require('express');
var userBl = require("../bl/userBL")
var router = express.Router();

/* GET users listing. */
router.get('/', async function(req, res, next) {
  const users = await userBl.GetAllUsers();

  res.send(users)
});

router.get('/all', function(req, res, next) {
  res.send('respond with a resource 2');
});

module.exports = router;
