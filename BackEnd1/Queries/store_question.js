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
  
  //Insert a record in the "question" table:
  var sql = "INSERT INTO question (question_title, question_body, user_id, datetime_asked, question_id) VALUES ('How many years does it take to earn a Software Engineering degree', 'Hello, just enrolled in Software engineering in y University. If I take a full course load in university, how long will it take me to complete my degree?', '1', '2018-02-09 23:59:59', NULL)";
			// Replace the # with values from POST in -> INSERT INTO question(#)
			
  con.query(sql, function (err, result) {
    if (err) throw err;
    console.log("1 record inserted");
  });
});

