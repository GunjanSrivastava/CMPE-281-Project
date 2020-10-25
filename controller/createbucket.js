function createBucketOnAWS() {
    const AWS = require('aws-sdk');
    AWS.config.update({region: 'us-west-2'});

    const s3 = new AWS.S3({apiVersion: "2006-03-01"});

    // var bucketParams = {
    //     Bucket: 'project-cloud-logo'
    // };
    //
    // var params = {
    //     Bucket: 'project-cloud-logo', /* required */
    //     LifecycleConfiguration: {
    //         Rules: [ /* required */
    //             {
    //                 Prefix: 'project*', /* required */
    //                 Status: 'Enabled', /* required */
    //                 AbortIncompleteMultipartUpload: {
    //                     DaysAfterInitiation: '7'
    //                 },
    //                 Transition: {
    //                     Date: new Date,
    //                     Days: '75',
    //                     StorageClass: 'STANDARD_IA'
    //                 }
    //             }
    //             /* more items */
    //         ]
    //     }
    // };

    s3.createBucket(bucketParams, function (err, data) {
        if (err) {
            console.log("Error", err);
        } else {
            console.log("Success", data.Location);
            s3.putBucketLifecycle(params, function (err, data) {
                if (err) console.log(err, err.stack); // an error occurred
                else console.log(data);           // successful response
            });

        }
    });
}


