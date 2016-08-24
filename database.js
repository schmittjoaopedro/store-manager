"use strict";

var Promise = require('bluebird');
var mongoose = require('mongoose'),
    timestamps = require('mongoose-timestamp');
var path = require('path'),
    fs = require('fs');

const url = process.env.MONGO_URL || 'mongodb://localhost/4estacoes';

module.exports = {
    url: url,
    init: function() {
        return new Promise(function(resolve, reject) {
            var conn = mongoose.connection;

            // CONNECTION EVENTS
            // When successfully connected
            conn.on('connected', function() {
                console.log('Mongoose default connection open to ' + url);

                var modeldir = path.join(__dirname, 'models');

                fs.readdir(modeldir, function(err, files) {
                    if (err) return reject(err);

                    files.forEach(function(file) {
                        var p = /\.js$/;

                        if (!p.test(file)) return;

                        var modelcfg = require(path.join(modeldir, file));

                        modelcfg.schema.plugin(timestamps);
                        modelcfg.schema.virtual('id').get(function() {
                            return this._id;
                        });

                        var exOpts = {
                            virtuals: true,
                            versionKey: false,
                            transform: function(doc, ret, options) {
                                delete ret._id;
                            }
                        };

                        modelcfg.schema.set('toJSON', exOpts);
                        modelcfg.schema.set('toObject', exOpts);

                        conn.model(modelcfg.name, modelcfg.schema);
                    });

                    global.models = conn.models;

                    resolve();
                });
            });

            // If the connection throws an error
            conn.on('error', function(err) {
                console.log('Mongoose default connection error: ' + err);
                reject(err);
            });

            // When the connection is disconnected
            conn.on('disconnected', function() {
                console.log('Mongoose default connection disconnected');
            });

            // If the Node process ends, close the Mongoose connection
            process.on('SIGINT', function() {
                conn.close(function() {
                    console.log('Mongoose default connection disconnected through app termination');
                    process.exit(0);
                });
            });

            conn.open(url);
        });
    }
};
