var passport = require('passport');
var router = require('express').Router();

/* GET home page. */
router.get('/', isAuthenticated, function(req, res, next) {
    res.render('report', { title: 'Relatório', user: req.user });
});

router.get('/filter', isAuthenticated, function (req, res, next) {
	var startDate = req.query.startDate;
	var endDate = req.query.endDate;
	var client = req.query.client;
	var cpf = req.query.cpf;
	var paymentType = req.query.paymentType;
	var payed = undefined;
	if(req.query.payed)
		payed = req.query.payed == "true" ? true : false;
	var filter = {};
		
	if(client)
		filter = {
			name: new RegExp(client, "i")
		};
	if(cpf) {
		filter = filter || {};
		filter.cpf = new RegExp(cpf, "i");
	}

	models.Client
	.find(filter)
	.then(function(clients) {
		filter = { };
		if(payed !== undefined) {
			if(payed) {
				filter.parcels = { $not: { $elemMatch: { payed: false } } };
			} else {
				filter.parcels = { $elemMatch: { payed: false } };
			}
		}
		filter.client = { 
			$in: clients.map(function(o) {
				return o._id; 
			})
		};
		if(startDate) {
			startDate = parseInt(startDate);
			filter.purchaseDate = { $gte: startDate };
		}
		if(endDate) {
			endDate = parseInt(endDate);
			filter.purchaseDate = filter.purchaseDate || {};
			filter.purchaseDate.$lte = endDate;
		}
		if(paymentType) {
			filter.paymentType = paymentType;
		}
		models.Bill
		.find(filter)
		.sort('purchaseDate')
		.populate('client')
		.then(function (bills) {
			processResponse(res, bills);
		}).catch(function(err) {
			res.send(err);
		});
	}).catch(function(err) {
		res.send(err);
	});

});

function processResponse(res, data) {
	var resData = [];
	data.forEach(function (item) {
		var amount = item.amount || 0;
		var received = item.received || 0;
		var balance = amount - received;
		resData.push({
			client: item.client.name,
			cpf: item.client.cpf,
			paymentType: item.paymentType,
			amount: amount,
			received: received,
			balance: balance,
			purchaseDate: item.purchaseDate
		});
	});
	res.json(resData);
}

module.exports = router;