var mongoose = require("mongoose"),
    Schema = mongoose.Schema;

var billSchema = Schema({
    amount: Number,
    purchaseDate: Number,
    notes: String,
    parcels: ['Parcel'],
    client: {
        type: Schema.Types.ObjectId,
        ref: 'Client'
    }
});

module.exports = {
    name: 'Bill',
    schema: billSchema
}
