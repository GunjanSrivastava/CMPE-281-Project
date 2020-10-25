var AWS = require('aws-sdk');
AWS.config.update({region: 'us-west-1'});

s3 = new AWS.S3({apiVersion: '2006-03-01'});

var bucketParams = {
    Bucket : 'elasticbeanstalk-us-west-1-616471720153'
};

s3.deleteBucket(bucketParams, function(err, data) {
    if (err) {
        console.log("Error", err);
    } else {
        console.log("Success", data);
    }
});
