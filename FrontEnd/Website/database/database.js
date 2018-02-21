var mysql = require('mysql');

var db = mysql.createConnection({
	host     : 'localhost',
	user     : 'root',
	password : 'SOEN341W18',
	database: 'soen341_project',
	port: '3306'
});

db.connect(function(err) {
	if (err) throw err;
	console.log("Connected!");
});

module.exports = db;

