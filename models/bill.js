var mongoose = require("mongoose"),
    Schema = mongoose.Schema;

var billSchema = Schema({
    amount: Number,
    puchaseDate: Date,
    dueData: Date,
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
