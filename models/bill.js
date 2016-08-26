var mongoose = require("mongoose"),
    Schema = mongoose.Schema;

var billSchema = Schema({
    amount: Number,
    puchaseDate: Number,
    dueData: Number,
    notes: String,
    parcels: [{
    	type: Schema.Types.ObjectId,
    	ref: 'Parcel'
    }]
});

module.exports = {
    name: 'Bill',
    schema: billSchema
}
