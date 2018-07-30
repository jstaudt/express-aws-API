const AWS = require('aws-sdk');
const fs = require('fs');

// config
const AWS_accessKeyId = process.env.ACCESS_KEY_ADMIN;
const AWS_secretAccessKey = process.env.SECRET_ACCESS_KEY_ADMIN;

AWS.config.update({
	accessKeyId: AWS_accessKeyId,
    secretAccessKey: AWS_secretAccessKey,
    region: 'us-east-1'
});

const dynamodb = new AWS.DynamoDB({apiVersion: '2012-08-10'});
const docClient = new AWS.DynamoDB.DocumentClient();

/**
 * Returns a set of attributes for the item with the given primary key
 * @returns {Promise.<Array|Error>} results if fulfilled, or an error if rejected.
 */
function readDynamoItem() {
    return new Promise((resolve, reject) => {
        // corresponds to 'Music' test table
        const params = {
            TableName: "Movies",
            Key: {
                "year": 1972,
                "title": "Godfather"
            }
        };

        console.log('reading item from DynamoDB table');

        docClient.get(params, function(err, data) {
            if (err) {
                reject(err);
            }

            resolve(data);
        });
    });
}

/**
 * Creates a new item, or replaces an old item with a new item
 * @returns {Promise.<Object|Error>} data if fulfilled, or an error if rejected.
 */
function putDynamoItem() {
    return new Promise((resolve, reject) => {

        console.log("Importing movies into DynamoDB. Please wait.");

        const allMovies = JSON.parse(fs.readFileSync('moviedata.json', 'utf8'));

        const params = {
            TableName: "Movies",
            Item: {
                "year":  1972,
                "title": "Godfather",
                "info":  {
                    "userId": 5,
                    "house": "Gryfindor"
                }
            }
        };

        docClient.put(params, function(err, data) {
            if (err) {
                reject(err)
            } else {
                resolve(data);
            }
        });
    })
}

/**
 * Creates DynamoDB table.  Change params to change schema.
 */
function createDyanmoTable() {
    const params = {
        TableName : "Movies",
        KeySchema: [
            { AttributeName: "year", KeyType: "HASH"},  //Partition key
            { AttributeName: "title", KeyType: "RANGE" }  //Sort key
        ],
        AttributeDefinitions: [
            { AttributeName: "year", AttributeType: "N" },
            { AttributeName: "title", AttributeType: "S" }
        ],
        ProvisionedThroughput: {
            ReadCapacityUnits: 10,
            WriteCapacityUnits: 10
        }
    };

    dynamodb.createTable(params, (err, data)  => {
        if (err) {
            console.error("Unable to create table. Error JSON:", JSON.stringify(err, null, 2));
        } else {
            console.log("Created table. Table description JSON:", JSON.stringify(data, null, 2));
        }
    });
}

module.exports = {
    readDynamoItem,
    putDynamoItem,
    createDyanmoTable,
};
