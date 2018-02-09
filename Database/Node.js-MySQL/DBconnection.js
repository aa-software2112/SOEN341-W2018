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
});
