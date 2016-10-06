var mongoose = require("mongoose"),
    Schema = mongoose.Schema;

var paymentSchema = Schema({
    value: Number,
    paymentDate: Number
});

module.exports = {
    name: 'Payment',
    schema: paymentSchema
}
