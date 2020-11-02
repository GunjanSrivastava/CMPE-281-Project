const AWS = require('aws-sdk');
const config = require('../config');
const TAG = 'UploadFileOnBucket';
AWS.config.update({
    region: config.region,
    // accessKeyId: config.awsUser.accessKeyId,
    // secretAccessKey: config.awsUser.secretAccessKey
});

const s3 = new AWS.S3({apiVersion: config.s3.apiVersion});

    const uploadFilesToS3= (file,folder) => {
        console.log(TAG + " Upload Files...");
        const filePath = file.path;
        console.log(typeof(file));
        // console.log(file instanceof File);
        // var fileBuffer = Buffer.from(file);
        const uploadParams = {
            Bucket: config.s3.bucketName,
            ACL : 'public-read',
            Key: '',
            Body: ''};
        const fs = require('fs');
        const fileStream = fs.createReadStream(filePath);

        fileStream.on('error', function(err) {
            console.log('File Error', err);
        });

        uploadParams.Body = fileStream;
        const path = require('path');
        //uploadParams.Key = folder_name+'/' +path.basename(file);
        uploadParams.Key = folder+'/'+path.basename(file.name);

        console.log(uploadParams.Body);
        console.log(uploadParams.Key);

        return new Promise((resolutionFunc, rejectionFunc) => {
            s3.upload (uploadParams, function (err, data) {
                if (err) {
                    console.log(TAG + " Upload Error");
                    console.log(err);
                    rejectionFunc(err);
                } if (data) {
                    console.log(TAG + " Upload Success");
                    console.log(data);
                    resolutionFunc(data);
                }
            });
        });
}

module.exports = uploadFilesToS3;

