'use strict'

import {MongoDBProxy, APIGatewayHelper} from 'lambdacommonutils';

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
            const bodyJson = JSON.parse(event.body);

            console.info("Body: " + JSON.stringify(bodyJson));
            for (let metric of bodyJson.metrics) {
                insertMetric(db, metric, callback);
            }

            APIGatewayHelper.successResponse({result: true}, callback);
        })
        .catch(err => {
            console.error("Failed to insert metric to db.", err);
            APIGatewayHelper.errorResponse(err, callback);
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