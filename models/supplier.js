var mongoose = require('mongoose'),
	Schema = mongoose.Schema;

var supplierSchema = Schema({
	name: String,
	cnpj: String,
	country: String,
	state: String,
	city: String,
	address: String,
	phoneOne: String,
	phoneTwo: String,
	site: String,
	email: String
});

module.exports = {
	name: 'Supplier',
	schema: supplierSchema
};