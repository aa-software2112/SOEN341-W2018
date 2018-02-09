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
  
  //Insert a record in the "score_question" table:
  var sql = "INSERT INTO score_question (score, user_id, question_id, datetime_scored_question) VALUES ('1', '1', '1', '2018-02-09 23:59:59')";
		// Replace the # with values from POST in -> INSERT INTO score_question(#)
		
  con.query(sql, function (err, result) {
    if (err) throw err;
    console.log("1 record inserted");
  });
});

