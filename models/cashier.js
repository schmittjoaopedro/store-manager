var mongoose = require("mongoose"),
    Schema = mongoose.Schema;

var cashierSchema = Schema({
    value: Number,
    date: Date
});

module.exports = {
    name: 'Cashier',
    schema: cashierSchema
}
