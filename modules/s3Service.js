//s3service.js
const AWS = require('aws-sdk');

// config
const AWS_accessKeyId = process.env.ACCESS_KEY_ADMIN;
const AWS_secretAccessKey = process.env.SECRET_ACCESS_KEY_ADMIN;
const BUCKET = 'magic-bucket-3';
const BASE_FOLDER = 'data';

AWS.config.update({
	accessKeyId: AWS_accessKeyId,
	secretAccessKey: AWS_secretAccessKey
});

const s3 = new AWS.S3();

function getObject(path) {
	return new Promise((resolve, reject) => {
		const getParams = {
			Bucket: BUCKET,
			Key: `${BASE_FOLDER}/${path}`,
		};

		s3.getObject(getParams, function(err, data) {
			// handle any error and exit
			if (err) {
				reject(err);
			}

            console.log(`Reading from S3 bucket.`);

			// no error happened
			// convert Body from a Buffer to a String
			const objectData = data.Body.toString('utf-8'); // Use the encoding necessary

			resolve(objectData);
    	});
    });
}

module.exports = {
	getObject,
};