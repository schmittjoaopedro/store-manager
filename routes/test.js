var passport = require('passport');
var router = require('express').Router();

/* GET home page. */
router.get('/', isAuthenticated, function(req, res) {
    res.send('Teste');
});

module.exports = router;