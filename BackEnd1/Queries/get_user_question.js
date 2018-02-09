//NOTE: This doesn't run yet with node.js, but you can use the query directly on MySQL (query found in var sql).

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
  
  //Select a record in the "question, answer, score_question" table:
  var sql = "SELECT question.question_title, question.question_body, question.datetime_asked,
			(SELECT COUNT(*) FROM answer WHERE question_id=question.question_id) AS number_question_replies,
			(SELECT COUNT(*) FROM score_question WHERE question_id=question.question_id) AS question_score  
			From question, answer, score_question
			WHERE question.user_id=1";
			// Replace the # with values from GET in -> question.user_id=#
  
  con.query(sql, function (err, result) {
    if (err) throw err;
    console.log("1 record inserted");
  });
});
