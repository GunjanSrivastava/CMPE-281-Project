
const mysql = require('mysql');
const TAG = 'databaseInsert';

const connection = mysql.createConnection({
    host : 'cloud-mysql-db.cuugnp7uvzmh.us-west-2.rds.amazonaws.com',
    user : 'admin',
    password : 'Gunjan1504',
    port :'3306'
});

connection.connect(function(err) {
    if (err) {
        console.error(TAG + ' Database connection failed... ');
        console.log(err.stack);
        return;
    }
    console.log(TAG + ' Connected to database...');
    connection.query('CREATE DATABASE IF NOT EXISTS Bucket',
        function(error, result, fields) {
            if(error){
                console.log(error.code);
                console.log(error.value);
            }
            else console.log(result.toString());
        });
    connection.query('USE Bucket',
        function(error, result, fields) {
            if(error){
                console.log(error.code);
                console.log(error.value);
            }
            else console.log(result.toString());
        });
    connection.query('CREATE TABLE IF NOT EXISTS fileSystems(userId varchar(255), firstName varchar(255), lastName varchar(255), emailAddress varchar(255), bucketName varchar(255), objectKey varchar(255), objectLocation varchar(255), uploadTime DATETIME, updatedTime DATETIME, description varchar(255), PRIMARY KEY (userId))',
        function(error, result, fields) {
        console.log(fields);
        if(error){
            console.log(error.code);
            console.log(error);
        }
        else {
            console.log(result.toString());}
    });
});


function insertIntoDB(userData) {
    const fName = userData.fName;
    const lName = userData.lName;
    const email = userData.email;
    const bucket = userData.bucket;
    const key = userData.key;
    const location = userData.location;
    const userId = userData.userId;
    const uploadTime = userData.uploadTime;
    const updateTime = userData.updateTime;
    const desc = userData.desc;

    return new Promise((resolutionFunc, rejectionFunc) => {
        connection.query(`INSERT INTO fileSystems(userId, firstName, lastName, emailAddress, bucketName, objectKey, objectLocation, uploadTime, updatedTime, description) VALUES (
        '${userId}','${fName}','${lName}','${email}','${bucket}','${key}','${location}',
        '${uploadTime}', '${uploadTime}', '${desc}')`, function (err, result) {
            if (err) {
                console.log(TAG + " Insert Failed");
                console.log(err);
                rejectionFunc(err);
            }
            if (result) {
                console.log(TAG + " Insert Success");
                console.log(result);
                resolutionFunc(result);
            }
        })
    });
}

module.exports = insertIntoDB;


