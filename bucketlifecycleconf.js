const AWS = require('aws-sdk');
AWS.config.update({region: 'us-west-1'});

const s3 = new AWS.S3({apiVersion: "2006-03-01"});

var params = {
    Bucket: 'project-cloud-logo', /* required */
    ContentMD5: 'STRING_VALUE',
    ExpectedBucketOwner: 'STRING_VALUE',
    LifecycleConfiguration: {
        Rules: [ /* required */
            {
                Prefix: '*',
                Status: 'Enabled' ,
                AbortIncompleteMultipartUpload: {
                    DaysAfterInitiation: '7'
                },
                Expiration: {
                    Date: new Date,
                    Days: 'NUMBER_VALUE',
                    ExpiredObjectDeleteMarker: true
                },
                Transition: {
                    Date: new Date,
                    Days: '75',
                    StorageClass: 'STANDARD_IA'
                }
            },
            {
                Transition: {
                    Date: new Date,
                    Days: '365',
                    StorageClass: 'GLACIER'
                }
            }
        ]
    }
};