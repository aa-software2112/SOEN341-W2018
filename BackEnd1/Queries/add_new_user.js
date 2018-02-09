var mysql = require('mysql');

var con = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "SOEN341W18",
  database: "soen341_project"
});

con.connect(function(err) {
  if (err) throw err;
  console.log("Connected!");
  
  //Insert a record in the "user" table:
  var sql = "INSERT INTO user (first_name, last_name, username, email, password, country, birth_date, gender, datetime_entered, user_id) VALUES ('john', 'doe', 'commonguy', 'commonguy222', 'password', 'canada', '1996-01-01', 'M', '2018-02-09 23:59:59', NULL)";
			// Replace the # with values from POST in -> INSERT INTO user(#)
			
  con.query(sql, function (err, result) {
    if (err) throw err;
    console.log("1 record inserted");
  });
});
