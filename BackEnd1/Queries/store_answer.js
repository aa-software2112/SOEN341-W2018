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
  
  //Insert a record in the "answer" table:
  var sql = "INSERT INTO answer (answer_body, user_id, question_id, datetime_answered, answer_id) VALUES ('It takes 4 years', '1', '1', '2018-02-09 23:59:59', NULL)";
			// Replace the # with values from POST in -> INSERT INTO answer(#)
  
  con.query(sql, function (err, result) {
    if (err) throw err;
    console.log("1 record inserted");
    console.log(result);
  });
});

