var router = require('express').Router();

/* GET home page. */
router.get('/', isAuthenticated, function(req, res) {
    res.render('purchase', { title: 'Compras', user: req.user });
});

router.post('/', isAuthenticated, function(req, res) {
	var obj = req.body;
	delete obj.createdAt;
	delete obj.updatedAt;
	obj.supplier = obj.supplier.id;
	if(!obj.id) {
		new models.Purchase(obj)
		.save()
		.then(function(purchase) {
			res.json(purchase);
		}).catch(function(err) {
			res.send(err);
		});
	} else {
		models.Purchase
		.findById(obj.id)
		.then(function(purchase) {
			purchase
			.update(obj)
			.then(function(purchase) {
				res.json(purchase);
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
	var cnpj = req.query.cnpj;
	var filter = null;
	if(name) {
		filter = {
			name: new RegExp(name, "i")
		};
	}
	if(cnpj) {
		filter = filter || {};
		filter.cnpj = new RegExp(cnpj, "i");
	}
	if(filter) {
		models.Supplier
		.find(filter)
		.then(function(suppliers) {
			filter = {
				parcels: {
					$elemMatch: {
						payed: false
					}
				},
				supplier: {
					$in: suppliers.map(function(o) {
						return o._id;
					})
				}
			};
			models.Purchase
			.find(filter)
			.limit(limit)
			.skip(skip * limit)
			.sort('purchaseDate')
			.populate('supplier')
			.then(function(purchases) {
				models.Purchase
				.count(filter)
				.then(function(count) {
					res.json({
						total: count,
						data: purchases
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
		models.Purchase
		.find(filter)
		.limit(limit)
		.skip(skip * limit)
		.sort('purchaseDate')
		.populate('supplier')
		.then(function(purchases) {
			models.Purchase
			.count(filter)
			.then(function(count) {
				res.json({
					total: count,
					data: purchases
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
	models.Purchase
	.findById(id)
	.then(function(purchase) {
		purchase
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