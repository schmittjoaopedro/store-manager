var passport = require('passport');
var router = require('express').Router();

/* GET home page. */
router.get('/', isAuthenticated, function(req, res) {
    res.render('client', { title: 'Clientes', user: req.user });
});

module.exports = router;