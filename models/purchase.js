var mongoose = require('mongoose'),
	Schema = mongoose.Schema;

var purchaseSchema = Schema({
	amount: Number,
	purchaseDate: Number,
	note: String,
	paymentType: {
        type: String,
        enum: ['Credito','Debito','Dinheiro','Boleto','Cheque']
    },
	supplier: {
		type: Schema.Types.ObjectId,
		ref: 'Supplier'
	},
	parcels: ['Parcel']
});

module.exports = {
	name: 'Purchase',
	schema: purchaseSchema
};