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


  var   sql = "INSERT INTO user (first_name, last_name, username, email, password, country, birth_date, gender, datetime_entered, user_id)VALUES ?";
  var values = [
      ['hans','Rheinhard', 'hleid', 'hlaus@gmail.com','hfest','germany','1980-03-7','M','2018-02-09 03:53:01','24776'],
      ['bill','Rheinhard', 'bleid', 'blaus@gmail.com','bfest','germany','1980-04-7','M','2018-02-09 03:53:01','24777'],
      ['gunter','Rheinhard', 'gleid', 'glaus@gmail.com','gfest','germany','1980-05-7','M','2018-02-09 03:53:01','24778']
              ];
    conn.query(sql,[values],function (err,result) {
        if (err) {
            throw err;
        }
 console.log(result.affectedRows +': record inserted ! :) ');
    });
});
