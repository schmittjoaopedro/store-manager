var passport = require('passport');
var router = require('express').Router();

/* GET home page. */
router.get('/', function(req, res) {
    res.json({ name: 'Teste' });
});

module.exports = router;