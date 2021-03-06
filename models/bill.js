var mongoose = require("mongoose"),
    Schema = mongoose.Schema;

var billSchema = Schema({
    amount: Number,
    received: Number,
    purchaseDate: Number,
    notes: String,
    parcels: ['Parcel'],
    payments: ['Payment'],
    paymentType: {
        type: String,
        enum: ['Credito','Debito','Dinheiro','Boleto','Cheque']
    },
    client: {
        type: Schema.Types.ObjectId,
        ref: 'Client'
    }
});

module.exports = {
    name: 'Bill',
    schema: billSchema
}
