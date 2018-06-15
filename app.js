'use strict'

import MongoDBProxy from './lib/MongoDBProxy';

let mongoDBProxy = null;

exports.handler = (event, context, callback) => {
    const dbUri = process.env['MONGODB_ATLAS_CLUSTER_URI'];
    const dbName = process.env['MONGODB_NAME'];

    if (!mongoDBProxy) {
        mongoDBProxy = new MongoDBProxy(dbUri, dbName);
    }

    processEvent(event, context, callback);
};

function processEvent(event, context, callback) {
    console.log('Handling event: ' + JSON.stringify(event));

    // var jsonContents = JSON.parse(JSON.stringify(event));

    //The following line is critical for performance reasons to allow re-use of database connections
    // across calls to this Lambda function and avoid closing the database connection. The first call
    // to this lambda function takes about 5 seconds to complete, while subsequent, close calls will
    // only take a few hundred milliseconds.
    context.callbackWaitsForEmptyEventLoop = false;

    mongoDBProxy.connectToDatabase()
        .then(db => {
            for (let metric of event.metrics) {
                insertMetric(db, metric, callback);
            }
            callback(null, {result: true});
        })
        .catch(err => {
            console.error("Failed to insert metric to db.", err);
            callback(null, {result: false, error: err.message});
        });
}

const insertMetric = (db, json, callback) => {
    console.log("Insert metric: ", JSON.stringify(json));
    db.collection('metrics').insertOne(json, function(err, result) {
        if(err) {
            console.error("An error occurred when insert metric", err);
        } else {
            console.debug("Inserted metric with id: " + result.insertedId);
        }
    });
};