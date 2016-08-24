var mongoose = require("mongoose"),
    Schema = mongoose.Schema,
    passportLocalMongoose = require('passport-local-mongoose');

var userSchema = new Schema({
    name: String,
    email: String
});

userSchema.plugin(passportLocalMongoose);

module.exports = {
    name: 'User',
    schema: userSchema
}
