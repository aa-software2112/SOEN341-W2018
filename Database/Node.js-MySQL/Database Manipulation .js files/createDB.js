var mysql = require('mysql');
var conn = mysql.createConnection({
    host :'localhost',
    user : 'root',
    password : 'SOEN341W18'
});

conn.connect(function(err){
    if (err) {
        throw err;
    }
    console.log('Connected ! :) ');
   // you might change the name of the database that you want to create
    conn.query("CREATE DATABASE soen341db",function (err,result) {
        if (err) {
            throw err;
        }
     console.log(' Database Created  ! :) ');
    });
});
