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
    email: String
});

module.exports = {
    name: 'Client',
    schema: clientSchema
}
