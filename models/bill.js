var mongoose = require("mongoose"),
    Schema = mongoose.Schema;

var billSchema = Schema({
    amount: Number,
    puchaseDate: Number,
    notes: String,
    parcels: [{
    	type: Schema.Types.ObjectId,
    	ref: 'Parcel'
    }],
    client: {
        type: Schema.Types.ObjectId,
        ref: 'Client'
    }
});

module.exports = {
    name: 'Bill',
    schema: billSchema
}
