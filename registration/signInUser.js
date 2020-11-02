const AWS = require('aws-sdk');
const config = require('../config');
const jwt_decode = require('jwt-decode');
const amazonCognitoIdentity = require('amazon-cognito-identity-js')
const TAG = 'signInUser';

AWS.config.update({
    region: config.region,
    // accessKeyId: config.awsUser.accessKeyId,
    // secretAccessKey: config.awsUser.secretAccessKey
});


function signInUser(email,password) {
    const poolData = {
        UserPoolId : 'us-west-2_41Wbw5Zr0',
        ClientId : '48vkpkjjqm03c5l83o2pu2p1sd'
    }
    const userPool = new amazonCognitoIdentity.CognitoUserPool(poolData);

    const userData = {
        Username: email,
        Pool: userPool
    };
    const authenticationData = {
        Username: email,
        Password: password,
    };

    const authenticationDetails = new amazonCognitoIdentity.AuthenticationDetails(authenticationData);

    return new Promise((resolve,reject) => {
        new amazonCognitoIdentity.CognitoUser(userData).authenticateUser(authenticationDetails, {
            onSuccess: (result) => {
                console.log(TAG + " SignIn Success");
                console.log(result);
                console.log(result.getIdToken().payload.name);
                const token = {
                    accessToken: result.getAccessToken().getJwtToken(),
                    idToken: result.getIdToken().getJwtToken(),
                    refreshToken: result.getRefreshToken().getToken(),
                }
                resolve({ statusCode: 200, response: result });
            },
            onFailure: (err) => {
                console.log(TAG + " SignIn Failed");
                reject({ statusCode: 400, response: err.message || JSON.stringify(err)});
            },
        });
    });
}

function decodeJWTToken(token) {
    const {  email, exp, auth_time , token_use, sub} = jwt_decode(token.idToken);
    return {  token, email, exp, uid: sub, auth_time, token_use };
}

module.exports = signInUser;




