var router = require('express').Router();
var Excel = require('exceljs');

/* GET home page. */
router.get('/backup/full', function(req, res) {

	res.setHeader('Content-Type', 'application/vnd.openxmlformats');
	res.setHeader("Content-Disposition", "attachment; filename=" + "Report.xlsx");		
	var options = {
		useStyles: true,
		useSharedStrings: true
	};
	var workbook = new Excel.stream.xlsx.WorkbookWriter(options);
	workbook.zip.pipe(res);
	mountUser(res, workbook);
});

function mountUser(res, workbook) {
	models.User.find({}).select('id username').then(function (data) {
		if(data.length == 0) data = [];
		var worksheet = workbook.addWorksheet("Usuários");
		worksheet.columns = [
			{ header: 'Cod.', key: 'id', width: 30 },
			{ header: 'Login', key: 'username', width: 20 }
		];
		for(var i in data) {
			worksheet.addRow(data[i].toJSON()).commit();
		}
		worksheet.commit();
		mountSupplier(res, workbook);
	});
}

function mountSupplier(res, workbook) {
	models.Supplier.find({}).select('id name cnpj country state city address phoneOne phoneTwo site email').then(function (data) {
		if(data.length == 0) data = [];
		var worksheet = workbook.addWorksheet("Fornecedores");
		worksheet.columns = [
			{ header: 'Cod.', key: 'id', width: 30 },
			{ header: 'Nome', key: 'name', width: 20 },
			{ header: 'CNPJ', key: 'cnpj', width: 20 },
			{ header: 'País', key: 'country', width: 20 },
			{ header: 'Estado', key: 'state', width: 20 },
			{ header: 'Endereço', key: 'address', width: 20 },
			{ header: 'Telefone Um', key: 'phoneOne', width: 20 },
			{ header: 'Telefone Dois', key: 'phoneTwo', width: 20 },
			{ header: 'Site', key: 'site', width: 20 },
			{ header: 'Email', key: 'email', width: 20 }
		];
		for(var i in data) {
			worksheet.addRow(data[i].toJSON()).commit();
		}	
		worksheet.commit();
		mountPurchase(res, workbook);
	});
}

function mountPurchase(res, workbook) {
	models.Purchase.find({}).select('id amount purchaseDate note paymentType supplier parcels').populate('supplier').then(function (data) {
		if(data.length == 0) data = [];
		var worksheet = workbook.addWorksheet("Compras");
		var worksheet2 = workbook.addWorksheet("Parcelamento das compras");
		worksheet.columns = [
			{ header: 'Cod.', key: 'id', width: 30 },
			{ header: 'Valor', key: 'amount', width: 20 },
			{ header: 'Descrição', key: 'note', width: 20 },
			{ header: 'Tipo de pagamento', key: 'paymentType', width: 20 },
			{ header: 'Cod. do vendedor', key: 'supplier', width: 20 }
		];
		worksheet2.columns = [
			{ header: 'Cod. da venda', key: 'id', width: 30 },
			{ header: 'Valor', key: 'value', width: 30 },
			{ header: 'Data de pagamento', key: 'paymentDate', width: 30 },
			{ header: 'Pago', key: 'payed', width: 30 }
		];
		for(var i in data) {
			var dt = data[i].toJSON();
			console.info(dt);
			worksheet.addRow({
				id: dt.id,
				amount: dt.amount,
				note: dt.note,
				paymentType: dt.paymentType,
				supplier: dt.supplier.id
			}).commit();
			dt.parcels.forEach(function (parcel) {
				worksheet2.addRow({
					id: dt.id,
					value: parcel.value,
					paymentDate: parcel.paymentDate,
					payed: parcel.payed ? 'Sim' : 'Não'
				}).commit();
			});
		}
		worksheet.commit();
		worksheet2.commit();
		mountClient(res, workbook);
	});
}

function mountClient(res, workbook) {
	models.Client.find({}).select('id name cpf bornDate country state city address phoneOne phoneTwo email').then(function (data) {
		if(data.length == 0) data = [];
		var worksheet = workbook.addWorksheet("Clientes");
		worksheet.columns = [
			{ header: 'Cod.', key: 'id', width: 30 },
			{ header: 'Nome', key: 'name', width: 20 },
			{ header: 'CPF', key: 'cpf', width: 20 },
			{ header: 'País', key: 'country', width: 20 },
			{ header: 'Estado', key: 'state', width: 20 },
			{ header: 'Endereço', key: 'address', width: 20 },
			{ header: 'Telefone Um', key: 'phoneOne', width: 20 },
			{ header: 'Telefone Dois', key: 'phoneTwo', width: 20 },
			{ header: 'Data de nascimento', key: 'bornDate', width: 20 },
			{ header: 'Email', key: 'email', width: 20 }
		];
		for(var i in data) {
			worksheet.addRow(data[i].toJSON()).commit();
		}	
		worksheet.commit();
		mountBills(res, workbook);
	});
}

function mountBills(res, workbook) {
	models.Bill.find({}).select('id amount purchaseDate notes paymentType client parcels').populate('client').then(function (data) {
		if(data.length == 0) data = [];
		var worksheet = workbook.addWorksheet("Vendas");
		var worksheet2 = workbook.addWorksheet("Parcelamento das vendas");
		worksheet.columns = [
			{ header: 'Cod.', key: 'id', width: 30 },
			{ header: 'Valor', key: 'amount', width: 20 },
			{ header: 'Descrição', key: 'notes', width: 20 },
			{ header: 'Tipo de pagamento', key: 'paymentType', width: 20 },
			{ header: 'Cod. do vendedor', key: 'client', width: 20 }
		];
		worksheet2.columns = [
			{ header: 'Cod. da venda', key: 'id', width: 30 },
			{ header: 'Valor', key: 'value', width: 30 },
			{ header: 'Data de pagamento', key: 'paymentDate', width: 30 },
			{ header: 'Pago', key: 'payed', width: 30 }
		];
		for(var i in data) {
			var dt = data[i].toJSON();
			console.info(dt);
			worksheet.addRow({
				id: dt.id,
				amount: dt.amount,
				note: dt.notes,
				paymentType: dt.paymentType,
				client: dt.client.id
			}).commit();
			dt.parcels.forEach(function (parcel) {
				worksheet2.addRow({
					id: dt.id,
					value: parcel.value,
					paymentDate: parcel.paymentDate,
					payed: parcel.payed ? 'Sim' : 'Não'
				}).commit();
			});
		}
		worksheet.commit();
		worksheet2.commit();
		workbook.commit();
	});
}

module.exports = router;