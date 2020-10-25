
var AWS = require('aws-sdk');
const config = require('../config');
AWS.config.update({
    region: config.region,
    accessKeyId: config.iamUserCustomer.accessKeyId,
    secretAccessKey: config.iamUserCustomer.secretAccessKey
});

const s3 = new AWS.S3({apiVersion: config.s3.apiVersion});

const deleteFilesFromS3= (name) => {
    console.log("Executing deleteFilesFromS3");
    const params = {
        Bucket : config.s3.bucketName,
        Key : name
    }
    return new Promise((resolutionFunc, rejectionFunc) => {
        s3.deleteObject(params ,function (err, data) {
            if (err) {
                console.log("Delete Failed", err);
                rejectionFunc(err);
            } if (data) {
                console.log("Delete Success");
                console.log(data);
                resolutionFunc(data);
            }
        })
    });
}

module.exports = deleteFilesFromS3;