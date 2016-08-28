var passport = require('passport');
var router = require('express').Router();

/* GET home page. */
router.get('/', isAuthenticated, function(req, res) {
    res.render('client', { title: 'Clientes', user: req.user });
});

router.post('/', isAuthenticated, function(req, res) {
	var obj = req.body;
	if(!obj.id) {
		new models.Client(obj)
		.save()
		.then(function (client) {
			res.json(client);
		}).catch(function (err) {
			res.send(err);
		});
	} else {
		delete obj.createdAt;
		delete obj.updatedAt;
		models.Client
		.findById(obj.id)
		.then(function(client) {
			client
			.update(obj)
			.then(function(client) {
				res.json(client);
			}).catch(function (err) {
				res.send(err);
			});
		}).catch(function (err) {
			res.send(err);
		});
	}
});

router.get('/list', isAuthenticated, function(req, res) {
	var name = req.query.name;
	var skip = parseInt(req.query.page);
	var limit = parseInt(req.query.limit);
	var cpf = req.query.cpf;
	var filter = {};
	if(name) filter.name = new RegExp(name, "i");
	if(cpf) filter.cpf = new RegExp(cpf, "i");;
	models.Client
	.find(filter)
	.limit(limit)
	.skip(skip * limit)
	.sort('name')
	.then(function (clients) {
		models.Client
		.count()
		.then(function(count) {
			res.json({
				total: count,
				data: clients
			})
		}).catch(function(err) {
			res.send(err);
		})
	}).catch(function(err) {
		res.send(err);
	});
});

router.delete('/:id', isAuthenticated, function(req, res) {
	var id = req.params.id;
	models.Client
	.findById(id)
	.then(function(client) {
		client
		.remove()
		.then(function() {
			res.send("OK");
		}).catch(function(err) {
			res.send(err);
		});
	}).catch(function(err) {
		res.send(err);
	});
});

module.exports = router;