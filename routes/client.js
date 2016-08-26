var passport = require('passport');
var router = require('express').Router();

/* GET home page. */
router.get('/', isAuthenticated, function(req, res) {
    res.render('client', { title: 'Clientes', user: req.user });
});

router.post('/', isAuthenticated, function(req, res) {
	new models.Client(req.body).save().then(function (client) {
		res.json(client);
	}).catch(function (err) {
		res.send(err);
	});
});

router.get('/list', isAuthenticated, function(req, res) {
	var name = req.query.name;
	var skip = parseInt(req.query.page);
	var limit = parseInt(req.query.limit);
	var cpf = parseInt(req.query.cpf);
	var filter = {};
	if(name) filter.name = new RegExp(name, "i");
	if(cpf) filter.cpf = cpf;
	models.Client.find(filter).limit(limit).skip(skip * limit).then(function (clients) {
		models.Client.count().then(function(count) {
			res.json({
				total: count,
				data: clients
			})
		}).catch(function(err) {
			res.send(err);
		})
	}).catch(function(err) {
		res.send(err);
	})
});

module.exports = router;