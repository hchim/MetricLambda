'use strict'

const MongoClient = require('mongodb').MongoClient;

class MongoDBProxy {
    /**
     * @param uri the uri of the mongodb to connect.
     * @param dbName the name of the database.
     */
    constructor(dbUri, dbName) {
        this.dbUri = dbUri;
        this.dbName = dbName;
        this.cachedDB = null;
    }

    /**
     * If already connected to the database, return the cached connection.
     * Otherwise, create a new connection.
     * @returns {*}
     */
    connectToDatabase() {
        if (this.isConnected()) {
            console.log('Using cached database instance.');
            return Promise.resolve(cachedDb);
        }

        console.log('Create a new database instance.');
        return MongoClient.connect(this.dbUri).then(client => {
            this.cachedDB = client.db(this.dbName);
            return this.cachedDB;
        });
    }

    /**
     * @return whether database is connected or not.
     */
    isConnected() {
        return (this.cachedDB && this.cachedDB.serverConfig.isConnected());
    }
}

export default MongoDBProxy;