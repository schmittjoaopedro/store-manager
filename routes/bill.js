var passport = require('passport');
var router = require('express').Router();

/* GET home page. */
router.get('/', isAuthenticated, function(req, res, next) {
    res.render('bill', { title: 'Vendas', user: req.user });
});

router.post('/', isAuthenticated, function(req, res) {
	var obj = req.body;
	delete obj.createdAt;
	delete obj.updatedAt;
	obj.client = obj.client.id;
	if(!obj.id) {
		new models.Bill(obj)
		.save()
		.then(function(client) {
			res.json(client);
		}).catch(function(err) {
			res.send(err);
		});
	} else {
		models.Bill
		.findById(obj.id)
		.then(function(client) {
			client
			.update(obj)
			.then(function(client) {
				res.json(client);
			}).catch(function(err) {
				res.send(err);
			});
		}).catch(function(err) {
			res.send(err);
		});
	}
});

router.get('/list/open', isAuthenticated, function(req, res) {
	var name = req.query.name;
	var skip = parseInt(req.query.page);
	var limit = parseInt(req.query.limit);
	var cpf = req.query.cpf;
	var filter = null;
	if(name) {
		filter = {};
		filter.name = new RegExp(name, "i");
	}
	if(cpf) {
		filter = filter || {};
		filter.cpf = new RegExp(cpf, "i");
	}
	if(filter) {
		models.Client
		.find(filter)
		.then(function(clients) {
			filter = { 
				parcels: { 
					$elemMatch: { 
						payed: false 
					}
				}, 
				client : { 
					$in: clients.map(function(o) {
						return o._id; 
					})
				}
			};
			models.Bill
			.find(filter)
			.limit(limit)
			.skip(skip * limit)
			.sort('purchaseDate')
			.populate('client')
			.then(function(bills) {
				models.Bill
				.count(filter)
				.then(function(count) {
					res.json({
						total: count,
						data: bills
					});
				}).catch(function(err) {
					res.send(err);
				});
			}).catch(function(err) {
				res.send(err);
			});
		}).catch(function(err) {
			res.send(err);
		});
	} else {
		filter = { parcels: { $elemMatch: { payed: false }}};
		models.Bill
		.find(filter)
		.limit(limit)
		.skip(skip * limit)
		.sort('purchaseDate')
		.populate('client')
		.then(function(bills) {
			models.Bill
			.count(filter)
			.then(function(count) {
				res.json({
					total: count,
					data: bills
				});
			}).catch(function(err) {
				res.send(err);
			});
		}).catch(function(err) {
			res.send(err);
		});
	}
});

router.delete('/:id', isAuthenticated, function(req, res) {
	var id = req.params.id;
	models.Bill
	.findById(id)
	.then(function(bill) {
		bill
		.remove()
		.then(function() {
			res.send("OK");
		}).catch(function(err) {
			res.send(err);
		})
	}).catch(function(err) {
		res.send(err);
	});
});

module.exports = router;