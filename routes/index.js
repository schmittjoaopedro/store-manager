var passport = require('passport');
var router = require('express').Router();

/* GET home page. */
router.get('/', function(req, res, next) {
    res.render('index', { title: 'Login', user: req.user });
});

router.get('/register', function(req, res) {
  res.render('register', { title: 'Register', user: req.user });
});

router.post('/register', function(req, res, next) {
  models.User
  .register(new models.User({username: req.body.username}), req.body.password, function(err) {
    if (err) {
      console.log('error while user register!', err);
      return next(err);
    }
    console.log('user registered!');
    res.redirect('/');
  });
});

router.get('/login', function(req, res) {
  res.render('login', { user: req.user, title : 'Login' });
});

router.post('/login', passport.authenticate('local'), function(req, res) {
  res.redirect('/');
});

router.get('/logout', function(req, res) {
  req.logout();
  res.redirect('/');
});

module.exports = router;
