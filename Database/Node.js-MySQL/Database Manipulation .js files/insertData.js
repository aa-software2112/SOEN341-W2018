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


  var   sql = "INSERT INTO user (first_name, last_name, username, email, password, country, birth_date, gender, datetime_entered, user_id)VALUES ('Klaus','Rheinhard', 'Kleid', 'klaus@gmail.com','fest','germany','1980-02-7','M','2018-02-09 03:53:01','24775')";

    conn.query(sql,function (err,result) {
        if (err) {
            throw err;
        }
     console.log(' Table Created  ! :) ');
    });
});
