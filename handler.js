(function(){
    const fileSelector = $('#file-selector');
    fileSelector.addEventListener('change', (event) => {
        const fileList = event.target.files;
        console.log(fileList);
    });

    const AWS = require('aws-sdk');
    AWS.config.update({region: 'us-west-2'});

// Create S3 service object
    const s3 = new AWS.S3({apiVersion: "2006-03-01"});

// Call S3 to list the buckets
    s3.listBuckets(function (err, data) {
        if (err) {
            console.log("Error", err);
        } else {
            console.log("Success", data.Buckets);
        }
    });

})();