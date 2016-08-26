var mongoose = require("mongoose"),
    Schema = mongoose.Schema;

var clientSchema = Schema({
	name: String,
    cpf: String,
    bornDate: Number,
    country: String,
    state: String,
    city: String,
    address: String,
    phoneOne: String,
    phoneTwo: String,
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
