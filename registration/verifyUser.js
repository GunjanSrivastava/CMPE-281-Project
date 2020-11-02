const AWS = require('aws-sdk');
const config = require('../config');
const amazonCognitoIdentity = require('amazon-cognito-identity-js')
const TAG = 'verifyUser';

AWS.config.update({
    region: config.region,
    // accessKeyId: config.awsUser.accessKeyId,
    // secretAccessKey: config.awsUser.secretAccessKey
});


function verifyUser(email,code) {
    const poolData = {
        UserPoolId : 'us-west-2_41Wbw5Zr0',
        ClientId : '48vkpkjjqm03c5l83o2pu2p1sd'
    }
    const userPool = new amazonCognitoIdentity.CognitoUserPool(poolData);

    const userData = {
        Username: email,
        Pool: userPool
    };

    return new Promise((resolve,reject) => {
        new amazonCognitoIdentity.CognitoUser(userData).confirmRegistration(code, true, (err, result) => {
            if (err) {
                console.log(TAG + "Verification Failed");
                console.log(err.code);
                console.log(err.message);
                reject({ statusCode: 422, response: err });
            }else {
                console.log(TAG + "Verification Success");
                console.log(result.toString());
                resolve({statusCode: 400, response: result});
            }
        });
    });
}

module.exports = verifyUser;




