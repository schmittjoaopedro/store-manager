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
	models.Bill
	.find({ parcels: { $elemMatch: { payed: false }}})
	.populate('client')
	.then(function(bills) {
		res.json(bills);
	}).catch(function(err) {
		res.send(err);
	});
});

module.exports = router;