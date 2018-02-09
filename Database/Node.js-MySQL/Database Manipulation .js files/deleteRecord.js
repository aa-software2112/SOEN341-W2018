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

    var sql = "DELETE FROM user WHERE user_id=24779";
        conn.query(sql,function (err,result) {
            if (err) {
                throw err;
            }
     console.log(result.affectedRows +': record deleted ! :) ');
        });
    });
