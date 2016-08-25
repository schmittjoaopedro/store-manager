var mongoose = require("mongoose"),
    Schema = mongoose.Schema;

var parcelSchema = Schema({
    value: Number,
    paymentDate: Date,
    payed: Boolean
});

module.exports = {
    name: 'Parcel',
    schema: parcelSchema
}
