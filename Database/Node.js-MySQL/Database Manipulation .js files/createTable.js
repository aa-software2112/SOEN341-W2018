var mysql = require('mysql');
var conn = mysql.createConnection({
    host :'localhost',
    user : 'root',
    password : 'SOEN341W18',
    database : 'soen341db' // test database
});

conn.connect(function(err){
    if (err) {
        throw err;
    }
    console.log('Connected ! :) ');

    var sql = " CREATE TABLE user (first_name varchar(30) NOT NULL, last_name varchar(30) NOT NULL,username varchar(30) NOT NULL,email varchar(60) NOT NULL, password varchar(60) NOT NULL, country varchar(40) DEFAULT NULL, birth_date date DEFAULT NULL, gender enum('M','F','O') NOT NULL,datetime_entered datetime NOT NULL,user_id int(10) unsigned NOT NULL AUTO_INCREMENT, PRIMARY KEY (user_id,email) ) ENGINE=InnoDB DEFAULT CHARSET=utf8";

    conn.query(sql,function (err,result) {
        if (err) {
            throw err;
        }
     console.log(' Table Created  ! :) ');
    });
});
