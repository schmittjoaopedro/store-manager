var passport = require('passport');
var router = require('express').Router();

/* GET home page. */
router.get('/', isAuthenticated, function(req, res, next) {
    res.render('bill', { title: 'Vendas', user: req.user });
});

module.exports = router;