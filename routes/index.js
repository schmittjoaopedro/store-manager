var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
    var c = new models.Cashier({ value: 100, date: new Date() });
    c.save();
    res.render('index', { title: 'Login' });
});

module.exports = router;
