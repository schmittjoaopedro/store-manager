var passport = require('passport');
var router = require('express').Router();

/* GET home page. */
router.get('/', isAuthenticated, function(req, res) {
    res.render('supplier', { title: 'Fornecedores', user: req.user });
});

router.post('/',isAuthenticated, function(req, res) {
	var obj = req.body;
	if(!obj.id) {
		new models.Supplier(obj)
		.save()
		.then(function(supplier) {
			res.json(supplier);
		}).catch(function(err) {
			res.send(err);
		});
	} else {
		delete obj.createdAt;
		delete obj.updatedAt;
		models.Supplier
		.findById(obj.id)
		.then(function(supplier) {
			supplier
			.update(obj)
			.then(function(supplier) {
				res.json(supplier);
			}).catch(function(err) {
				res.send(err);
			});
		}).catch(function(err) {
			res.send(err);
		})
	}
});

router.get('/list', isAuthenticated, function(req, res) {
	var name = req.query.name;
	var skip = parseInt(req.query.page);
	var limit = parseInt(req.query.limit);
	var cnpj = req.query.cnpj;
	var filter = {};
	if(name) filter.name = new RegExp(name, "i");
	if(cnpj) filter.cnpj = new RegExp(cnpj, "i");;
	models.Supplier
	.find(filter)
	.limit(limit)
	.skip(skip * limit)
	.then(function (suppliers) {
		models.Supplier
		.count()
		.then(function(count) {
			res.json({
				total: count,
				data: suppliers
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
	models.Supplier
	.findById(id)
	.then(function(supplier) {
		supplier
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