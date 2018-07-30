require('dotenv').config();
const dynamoDBService = require('./modules/dynamoDBService.js');
const s3service = require('./modules/s3service.js');
const express = require('express');
const app = express();
let movieData = {};
let assets = {};

// s3service.getObject('jason.json')
//     .then((data) => {
//         assets = JSON.stringify(data, null, 2);
//     })
//     .catch((err) => {
//         console.log(err);
//     });

// dynamoDBService.readDynamoItem()
//     .then((data) => {
//         movieData = JSON.stringify(data, null, 2);
//     })
//     .catch((err) => {
//         console.error("Unable to read item. Error JSON:", JSON.stringify(err, null, 2));
//     });

app.get('/', (req, res) => {
    res.send(movieData);
});

app.listen(8000, () => {
    console.log('Example app listening on port 8000!')
});