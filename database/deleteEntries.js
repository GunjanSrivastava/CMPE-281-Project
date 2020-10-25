const mysql = require('mysql');
const TAG = 'deleteEntries';

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

function deleteFilesInDB(userId) {
    return new Promise((resolutionFunc, rejectionFunc) => {
        const sql = 'DELETE FROM fileSystems WHERE userId = ?';
        connection.query(sql , [userId], function (err, result, fields) {
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

module.exports = deleteFilesInDB;