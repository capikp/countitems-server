/**
 * Connection mongo database
 */

var mongoClient = require('mongodb').MongoClient;

    var db;
    var dbName = process.env.DB_NAME;
    var dbHost = process.env.DB_HOST;
    var dbPORT = process.env.DB_PORT;
    var dbConnectParameter = "mongodb://" + dbHost + ":" + dbPORT + "/" + dbName;  


    function Connection () {

        // Create connection
        this.connectDB = function() {
            mongoClient.connect(dbConnectParameter,  {useNewUrlParser: true }, function(err, dbConnection){
                if(err){
                    throw err;
                }
                db = dbConnection;
            });
        }

        this.getDbConnection = function(callback) {
            callback (null, db);
        }


    }


module.exports = new Connection();