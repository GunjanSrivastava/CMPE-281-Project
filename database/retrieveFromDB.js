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
});

function retrieveFilesFromDB(email) {
    return new Promise((resolutionFunc, rejectionFunc) => {
        const sql = 'SELECT * FROM fileSystems WHERE emailAddress = ?';
        connection.query(sql , [email], function (err, result, fields) {
            if (err) {
                console.log(TAG + " Retrieve Failed");
                console.log(err);
                rejectionFunc(err);
            }
            if (result) {
                console.log(TAG + " Retrieve Success");
                console.log(result);
                resolutionFunc(result);
            }
        });
    });
}

module.exports = retrieveFilesFromDB;