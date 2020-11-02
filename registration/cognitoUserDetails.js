const AWS = require('aws-sdk');
const config = require('../config');

AWS.config.update({
    region: config.region,
    // accessKeyId: config.awsUser.accessKeyId,
    // secretAccessKey: config.awsUser.secretAccessKey
});

function getUserDetails() {
    console.log("Get User Details...")
    const cognitoIdentityService = new AWS.CognitoIdentityServiceProvider({apiVersion: '2016-04-19', region: 'us-west-2'});

    const params = {
        "UserPoolId": 'us-west-2_41Wbw5Zr0'
    };

    return new Promise((resolve,reject) => {
        cognitoIdentityService.listUsers(params, (err, data) => {
            if (!err) {
                console.log('User Details Success...');
                console.log(JSON.stringify(data));
                resolve(data);

            } else {
                console.log('User Details Error...');
                console.log(JSON.stringify(err));
                reject(err);
            }
        });
    });
}

module.exports = getUserDetails;




