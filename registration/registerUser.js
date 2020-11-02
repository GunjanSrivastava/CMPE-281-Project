const AWS = require('aws-sdk');
const config = require('../config');
const amazonCognitoIdentity = require('amazon-cognito-identity-js')
const TAG = 'RegisterUser';

AWS.config.update({
    region: config.region,
    // accessKeyId: config.awsUser.accessKeyId,
    // secretAccessKey: config.awsUser.secretAccessKey
});

const registerUsingCognito = (fName,lName,emailAddress,password) => {
    console.log("Inside registerUsingCognito");
    const poolData = {
        UserPoolId : 'us-west-2_41Wbw5Zr0',
        ClientId : '48vkpkjjqm03c5l83o2pu2p1sd'
    }
    const userPool = new amazonCognitoIdentity.CognitoUserPool(poolData);
    const firstName = {
        Name: 'name',
        Value: fName
    }
    const lastName = {
        Name: 'family_name',
        Value: lName
    }
    const phoneNumber = {
        Name: 'phone_number',
        Value: '+01234567890'
    }

    const fNameAttr = new amazonCognitoIdentity.CognitoUserAttribute(firstName);
    const lNameAttr = new amazonCognitoIdentity.CognitoUserAttribute(lastName);
    const phNoAttr = new amazonCognitoIdentity.CognitoUserAttribute(phoneNumber);

    return new Promise((resolutionFunc,rejectionFunc) => {
        userPool.signUp(emailAddress,password,[fNameAttr,lNameAttr,phNoAttr],null,(err,data) => {
            if(err){
                console.log(TAG + " Registration failed");
                console.log(err.code);
                console.log(err.message);
                rejectionFunc(err);
            }else{
                console.log("Registration Success: ");
                console.log(data.user);
                const response = {
                    username: data.user.username,
                    userConfirmed: data.userConfirmed,
                    userAgent: data.user.client.userAgent,
                }
                console.log(response);
                resolutionFunc(data);
            }
        });
    });
}

module.exports = registerUsingCognito;




