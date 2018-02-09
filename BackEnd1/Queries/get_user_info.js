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
  
  //Se;ect a record in the "user, question, answer" table:
  var sql = "SELECT user.first_name, user.last_name, user.username, 
			(SELECT COUNT(*) FROM question WHERE user_id=user.user_id) AS number_question_asked,
			(SELECT COUNT(*) FROM answer WHERE user_id=user.user_id) AS number_question_answered  
			From user, question, answer
			WHERE user.user_id=1";
			// Replace the # with values from GET in -> user.user_id=#
  
  con.query(sql, function (err, result) {
    if (err) throw err;
    console.log("1 record inserted");
  });
});
