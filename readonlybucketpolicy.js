var AWS = require('aws-sdk');
AWS.config.update({region: 'us-west-1'});

s3 = new AWS.S3({apiVersion: '2006-03-01'});

var readOnlyAnonUserPolicy = {
    Version: "2012-10-17",
    Statement: [
        {
            Sid: "AddPerm",
            Effect: "Allow",
            Principal: "*",
            Action: [
                "s3:GetObject"
            ],
            Resource: [
                ""
            ]
        }
    ]
};

// create selected bucket resource string for bucket policy
var bucketResource = "arn:aws:s3:::project-cloud-logo" + "/*";
readOnlyAnonUserPolicy.Statement[0].Resource[0] = bucketResource;

// convert policy JSON into string and assign into params
var bucketPolicyParams = {Bucket: 'project-cloud-logo', Policy: JSON.stringify(readOnlyAnonUserPolicy)};

// set the new policy on the selected bucket
s3.putBucketPolicy(bucketPolicyParams, function(err, data) {
    if (err) {
        // public error message
        console.log("Error", err);
    } else {
        console.log("Success", data);
    }
});
