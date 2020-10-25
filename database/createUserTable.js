
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
    connection.query('CREATE DATABASE IF NOT EXISTS User',
        function(error, result, fields) {
            if(error){
                console.log(error.code);
                console.log(error.value);
            }
            else console.log(result.toString());
        });
    connection.query('USE User',
        function(error, result, fields) {
            if(error){
                console.log(error.code);
                console.log(error.value);
            }
            else console.log(result.toString());
        });
    connection.query('CREATE TABLE IF NOT EXISTS userInfo(firstName varchar(255), lastName varchar(255), emailAddress varchar(255), PRIMARY KEY (emailAddress))',
        function(error, result, fields) {
            console.log(fields);
            if(error){
                console.log(error.code);
                console.log(error);
            }
            else {
                console.log(result.toString());
            }
        });
});

function insertIntoUserTable(userData) {
    const fName = userData.fName;
    const lName = userData.lName;
    const email = userData.email;

    return new Promise((resolutionFunc, rejectionFunc) => {
        connection.query(`INSERT INTO userInfo(firstName, lastName, emailAddress) VALUES (
        '${fName}','${lName}','${email}')`, function (err, result) {
            if (err) {
                console.log(TAG + " User Insert Failed");
                console.log(err);
                rejectionFunc(err);
            }
            if (result) {
                console.log(TAG + " User Insert Success");
                console.log(result);
                resolutionFunc(result);
            }
        })
    });
}

module.exports = insertIntoUserTable;


