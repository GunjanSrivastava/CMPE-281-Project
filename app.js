const express = require('express')
const bodyParser = require('body-parser');
const formidable = require('formidable');
const app = express()
const TAG = 'App.database';
var session = require('express-session')

app.use(express.static('static', {index: 'login.html'}));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}));
app.use(session({
    resave: false,
    saveUninitialized: true,
    secret: 'any string'
}));


const registerUsingCognito = require('./registration/registerUser');
const verifyUser = require('./registration/verifyUser')
const signInUser = require('./registration/signInUser')
const getUserDetails = require('./registration/cognitoUserDetails')

const uploadFilesToS3 = require('./s3_bucket/uploadfileonbucket');
const deleteFilesFromS3 = require('./s3_bucket/deleteFileFromBucket');

const insertIntoDB = require('./database/databaseHandler')
const retrieveFilesFromDB = require('./database/retrieveFromDB')
const updateFilesInDB = require('./database/updateDB')
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
        req.session['currentUser'] = email;
        req.session.cookie.maxAge = 1800000;
        res.send(response);
        console.log("received response in app.database");
    },(error)=>{
        console.log(error.message);
        res.send({status: 404 , error: error});
    }).catch(() => {
        res.send({status: 404});
    });
});

app.post('/verify', function (req, res) {
    console.log(TAG + " Received verify post request");
    console.log(req.body);
    const code = req.body.verificationCode;
    const email = req.body.email;
    const response = verifyUser(email,code);
    response.then((response)=>{
        res.send({status: 200});
        console.log(TAG + " Verification Success");
        console.log(response.toString());
    },(error)=>{
        console.log(TAG + " Verification Failed");
        console.log(error.code);
        console.log(error.message);
        res.send({status: 404});
    }).catch(() => {
        res.send({status: 404});
    });
});

app.post('/signIn', function (req, res) {
    console.log(TAG + " Received signIn post request");
    console.log(req.body);
    const email = req.body.email;
    const pwd = req.body.password;
    const response = signInUser(email,pwd);
    response.then((response)=>{
        req.session['currentUser'] = email;
        req.session.cookie.maxAge = 1800000;
        res.send(response);
        console.log(TAG + " SignIn Success");
        console.log(response);
        console.log('gunjan: '+email);
    },(error)=>{
        console.log(TAG + " SignIn Failed");
        console.log(error.statusCode);
        console.log(error.response);
        res.send({status: 404});
    }).catch(() => {
        res.send({status: 404});
    });
});

app.get('/cognito/users', function (req, res) {
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

// S3 Related Fetch
app.post('/upload', function (req, res) {
    // new formidable.IncomingForm().parse(req, (err, fields, files) => {
    console.log("Post Upload Request");
    const form = new formidable.IncomingForm();
    form.parse(req, function(err, fields, files) {
        console.log("Post Upload Request");
        // console.log(files);
        // console.log(files.folder);
        // console.log(fields);
        console.log(req.session.currentUser);
        const response = uploadFilesToS3(files.file, req.session.currentUser);
        response.then((response) => {
            res.send(response);
            console.log(TAG + " Upload Success");
            console.log(response);
        }, (error) => {
            console.log(TAG + " Upload Failed");
            console.log(error.statusCode);
            console.log(error.response);
            res.send(error);
        }).catch(() => {
            res.send();
        });
    });
});

app.delete('/delete', function (req, res) {
    console.log("Delete Request");
    const response =  deleteFilesFromS3(req.body.folder,req.body.name);
    response.then((response)=>{
        res.send(response);
    },(error)=>{
        res.send(error);
    }).catch(() => {
        res.send();
    });
});

app.post('/db/insert', function (req, res) {
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

app.post('/db/retrieve', function (req, res) {
    console.log("Post Retrieve Request");
    //const response =  retrieveFilesFromS3();
    console.log('gunjan gunjan gunjan');
    console.log(req.session);
    console.log(req.session['currentUser']);
    var email;
    if(req.body.email){
        email = req.body.email;
    }
    else{
        email = req.session['currentUser'];
    }
    const response = retrieveFilesFromDB(email);
    response.then((response)=>{
        res.send(response);
    },(error)=>{
        res.send(error);
    }).catch(() => {
        res.send();
    });
});

app.post('/db/update', function (req, res) {
    console.log("POST Update Request");
    const response = updateFilesInDB(req.body.updateTime,req.body.userId);
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

app.post('/logout', function (req, res) {
        console.log("logout");
        req.session.destroy();
        res.send({status: 200});
});

const server = app.listen(3000);

module.exports = server;
