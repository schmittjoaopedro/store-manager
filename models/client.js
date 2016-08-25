var mongoose = require("mongoose"),
    Schema = mongoose.Schema;

var clientSchema = Schema({
	name: String,
    CPF: Number,
    bornDate: Date,
    country: String,
    state: String,
    city: String,
    address: String,
    phoneOne: String,
    phoneTwo: String,
    whatsapp: String,
    email: String,
    bills: [{
        type: Schema.Types.ObjectId,
        ref: 'Bill'
    }]
});

module.exports = {
    name: 'Client',
    schema: clientSchema
}
