
const express = require('express')
const bodyParser = require('body-parser');
const app = express()
const TAG = 'App.database';

app.use(express.static('static'))
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}));

const registerUsingCognito = require('./registration/registerUser');
const uploadFilesToS3 = require('./s3_bucket/uploadfileonbucket');
const retrieveFilesFromS3 = require('./s3_bucket/retrievefilesList');
const deleteFilesFromS3 = require('./s3_bucket/deleteFileFromBucket');
const verifyUser = require('./registration/verifyUser')
const signInUser = require('./registration/signInUser')
const insertIntoDB = require('./database/databaseHandler')
const retrieveFilesFromDB = require('./database/retrieveFromDB')
const updateFilesInDB = require('./database/updateDB')
const insertIntoUserTable = require('./database/createUserTable')
const retrieveUsersFromDB = require('./database/retrieveAllUserFromDB')
const getUserDetails = require('./registration/cognitoUserDetails')
const deleteFilesInDB = require('./database/deleteEntries')

app.post('/register', function (req, res) {
    console.log("Received register post request" + req.body);
    const fName = req.body.firstName;
    const lName = req.body.lastName;
    const email = req.body.emailAddress;
    const pwd = req.body.password;
    console.log("Data received inside app.database "+ fName +" " + lName +" "+ email + " " + pwd);
    const response = registerUsingCognito(fName,lName,email,pwd);
    response.then((response)=>{
        res.send(response);
        console.log("received response in app.database");
    },(error)=>{
        res.send(error);
    }).catch(() => {
        res.send();
    });
});

app.post('/verify', function (req, res) {
    console.log(TAG + " Received verify post request");
    console.log(req.body);
    const code = req.body.verificationCode;
    const email = req.body.email;
    const response = verifyUser(email,code);
    response.then((response)=>{
        res.send(response);
        console.log(TAG + " Verification Success");
        console.log(response.toString());
    },(error)=>{
        console.log(TAG + " Verification Failed");
        console.log(error.code);
        console.log(error.message);
        res.send(error);
    }).catch(() => {
        res.send();
    });
});

app.post('/signIn', function (req, res) {
    console.log(TAG + " Received signIn post request");
    console.log(req.body);
    const email = req.body.email;
    const pwd = req.body.password;
    const response = signInUser(email,pwd);
    response.then((response)=>{
        res.send(response);
        console.log(TAG + " SignIn Success");
        console.log(response);
    },(error)=>{
        console.log(TAG + " SignIn Failed");
        console.log(error.statusCode);
        console.log(error.response);
        res.send(error);
    }).catch(() => {
        res.send();
    });
});


app.post('/upload', function (req, res) {
    console.log("Post Upload Request");
    const response = uploadFilesToS3();
    response.then((response)=>{
        res.send(response);
        console.log(TAG + " Upload Success");
        console.log(response);
    },(error)=>{
        console.log(TAG + " Upload Failed");
        console.log(error.statusCode);
        console.log(error.response);
        res.send(error);
    }).catch(() => {
        res.send();
    });
});

app.post('/insert', function (req, res) {
    console.log("Post Insert Request");
    //const response = insertIntoDB(req.body.email,req.body.bucket,req.body.key,req.body.location);
    const response = insertIntoDB(req.body);
    response.then((response)=>{
        res.send(response);
        console.log(TAG + " Insert Success");
        console.log(response);
    },(error)=>{
        console.log(TAG + " Insert Failed");
        console.log(error.statusCode);
        console.log(error.response);
        res.send(error);
    }).catch(() => {
        res.send();
    });
});

app.post('/retrieve', function (req, res) {
    console.log("Post Retrieve Request");
    //const response =  retrieveFilesFromS3();
    const response = retrieveFilesFromDB(req.body.email);
    response.then((response)=>{
        res.send(response);
    },(error)=>{
        res.send(error);
    }).catch(() => {
        res.send();
    });
});

app.post('/create/users', function (req, res) {
    console.log("Post Create Users Request");
    const response = insertIntoUserTable();
    response.then((response)=>{
        res.send(response);
    },(error)=>{
        res.send(error);
    }).catch(() => {
        res.send();
    });
});

app.post('/retrieve/users', function (req, res) {
    console.log("Post Retrieve Users Request");
    const response = retrieveUsersFromDB();
    response.then((response)=>{
        res.send(response);
    },(error)=>{
        res.send(error);
    }).catch(() => {
        res.send();
    });
});

app.post('/update', function (req, res) {
    console.log("POST Update Request");
    const response = updateFilesInDB(req.body.updateTime,req.body.description,res.body.userId);
    response.then((response)=>{
        res.send(response);
    },(error)=>{
        res.send(error);
    }).catch(() => {
        res.send();
    });
});

app.delete('/delete', function (req, res) {
    console.log("Delete Request");
    const response =  deleteFilesFromS3(req.body.name);
    response.then((response)=>{
        res.send(response);
    },(error)=>{
        res.send(error);
    }).catch(() => {
        res.send();
    });
});

//admin calls

app.get('/cognitoUsers', function (req, res) {
    console.log("Call For Cognito Users");
    const response =  getUserDetails();
    response.then((response)=>{
        res.send(response);
    },(error)=>{
        res.send(error);
    }).catch(() => {
        res.send();
    });
});

app.post('/user/files', function (req, res) {
    console.log("Call To Fetch User Files");
    const response =  getUserDetails();
    response.then((response)=>{
        res.send(response);
    },(error)=>{
        res.send(error);
    }).catch(() => {
        res.send();
    });
});

app.delete('/db/delete', function (req, res) {
    console.log("Call To Delete Entry In a Table");
    const response =  deleteFilesInDB(req.body.userId);
    response.then((response)=>{
        res.send(response);
    },(error)=>{
        res.send(error);
    }).catch(() => {
        res.send();
    });
});



const server = app.listen(3000);

module.exports = server;
