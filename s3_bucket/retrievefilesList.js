
var AWS = require('aws-sdk');
const config = require('../config');
AWS.config.update({region: config.region});
const TAG = "Retrieve File Lists";

const s3 = new AWS.S3({apiVersion: config.s3.apiVersion});

const params = {
    Bucket : config.s3.bucketName,
}

const retrieveFilesFromS3= () => {
    console.log(TAG + " Executing retrieveFilesFromS3");

    return new Promise((resolutionFunc, rejectionFunc) => {
        s3.listObjectsV2 (params, function (err, data) {
            if (err) {
                console.log("Retrieve failed", err);
                rejectionFunc(err);
            } if (data) {
                console.log(data);
                console.log(data.Contents);
                resolutionFunc(data.Contents);
            }
        });
    });
}

module.exports = retrieveFilesFromS3;