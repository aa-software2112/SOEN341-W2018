// Database connection
const mysql = require('mysql');
var db = require('../database/database');

exports.delete_question = function(req,res){
    
    var aId = req.params.a_id;

	db.query("DELETE FROM answer WHERE answer_id = ? ", [aId], function (err, rows) {
	
		if (err) {
			res.status(500).json({"status_code": 500,"status_message": "internal server error"});
			console.log("Error deleting : %s ", err );
		} else {
			res.redirect('/user_profile/?tab=answers');
		};
	});
}; 