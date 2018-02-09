var mysql = require('mysql');
var conn = mysql.createConnection({
    host :'localhost',
    user : 'root',
    password : 'SOEN341W18',
    database : 'soen341_project' // insert to the actual database
});

conn.connect(function(err){
    if (err) {
        throw err;
    }
    console.log('Connected ! :) ');


var sql = "SELECT first_name, country FROM user where last_name='rheinhard' ";
    conn.query(sql,function (err,result) {
        if (err) {
            throw err;
        }
 console.log(result);
    });
});
