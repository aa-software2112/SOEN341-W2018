// var mysql = require('mysql');
// var db = require('./database');


// var Task = {
//     TenNewestQuestions: {
//         getTenNewestQuestions: 
//         (function(callback) {
//             var result;
//             var sql = "SELECT DISTINCT question.question_title, \
//             question.question_body, question.datetime_asked, \
//             (SELECT COUNT(*) FROM answer WHERE question_id=question.question_id) \
//             AS number_question_replies, (SELECT COUNT(*) \
//             FROM score_question WHERE question_id=question.question_id) \
//             AS question_score From question, answer, score_question WHERE question.user_id=24776";
            
            
//             db.query(sql, function (err, result) {
//                 if (err) {
//                     throw err;
//                 }
//                 console.log(result);
                
//                 // Testing
                
               
//             });
//             return (result, callback);
//         })()
        
//     },
// };

// module.exports = Task;  

