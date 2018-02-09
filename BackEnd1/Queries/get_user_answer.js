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
  var sql = "SELECT question.question_id, question.question_title, answer.answer_body, answer.datetime_answered,
			(SELECT COUNT(*) FROM score_answer WHERE answer_id=answer.answer_id) AS answer_score  
			From question, answer, score_answer
			WHERE answer.user_id=1";
			// Replace the # with values from GET in -> answer.user_id=#
  
  con.query(sql, function (err, result) {
    if (err) throw err;
    console.log("1 record inserted");
  });
});
