  var express = require("express");
  var router = express.Router();

  var path = require("path");
  var util = require("util");
  var bodyParser = require("body-parser");
  var date = require("date-and-time");

  // Database connection
  const mysql = require("mysql");
  var db = require("../database/database");

  /** <<<<<<<<<<<<<<< Forum page >>>>>>>>>>>>>>
  * ============================================================================
  * Add comments here
  * ============================================================================
  */

  //* Listens for the question page request - done through the search */
  router.get("/:q_id", (req, res) => {
    var qId = req.params.q_id;
    // Verify that the question id is a number
    if (isNaN(req.params.q_id))
    {
      res.render("invalid_page", null);
      return;
    }
  //query from question table joined with user's table user_id
  var sql_getQuestion = "select question.question_title,question.question_body, question.datetime_asked, user.user_id, \
  question.question_id, user.username AS asked_by FROM question JOIN user ON question.user_id = user.user_id \
  WHERE question_id = ?";

  db.query(sql_getQuestion,[qId], function(err,result){
    if(err){
      console.log(err);
      return;
    }
    //debugging to show question object
    console.log("FORUM RESULT " + util.inspect(result));
    
    //second query getting answer table and also joined with user's table user_id (yes, this is a query inside a query)
    var sql_getAnswers ="select answer.answer_body, answer.answer_id, answer.datetime_answered, user.user_id, \
    user.username AS answered_by FROM answer JOIN user ON answer.user_id = user.user_id \
    WHERE answer.question_id = ?";

    var sql_totalAnswer = "SELECT answer.answer_id, SUM(CASE WHEN score= '1' THEN 1 ELSE 0 END) AS positiveScore, Sum(CASE WHEN score = '-1' THEN 1 ELSE 0 END) AS negativeScore FROM answer JOIN score_answer \
    ON score_answer.answer_id = answer.answer_id GROUP BY score_answer.answer_id"

    db.query(sql_getAnswers,[qId], function(err,answer){
      if (err) res.redirect('/home');
      
      else
        db.query(sql_totalAnswer,function(err,total_ans){

          //debugging to show total votes of answers
          console.log("Total answers votes "+ util.inspect( total_ans));

                    //This function compares the answer and score_answer tables. If there is a row with same answer_if on both table
                    //It takes its sum of votes as positiveScore or negativeScore and also the answer id, and stores them in an array commonAnsId.
                    function intersect_arrays(answer, total_ans) {
                      var sorted_a = answer.concat().sort();
                      var sorted_b = total_ans.concat().sort();
                      var commonAnsId =[];
                      var a_i = 0;
                      var b_i = 0;

                      while (a_i < answer.length && b_i < total_ans.length)
                      {
                        if (sorted_a[a_i].answer_id === sorted_b[b_i].answer_id) {
                          commonAnsId.push(
                          {
                            answer_id: sorted_b[b_i].answer_id,
                            positiveScore: sorted_b[b_i].positiveScore,
                            negativeScore: sorted_b[b_i].negativeScore
                          });
                          a_i++;
                          b_i++;
                        }
                        else if(sorted_a[a_i].answer_id < sorted_b[b_i].answer_id) {
                          a_i++;
                        }
                        else if (sorted_a[a_i].answer_id > sorted_b[b_i].answer_id){
                          b_i++;
                        }
                        else {
                          res.redirect("/question_forum/" + req.params.q_id);
                        }
                      }
                      return commonAnsId;
                    }
                    var FirstInter = intersect_arrays(answer, total_ans);
                    console.log("Intersetction " + util.inspect(FirstInter));

          //debugging to show list of answers
          console.log("List of answers "+util.inspect(answer));

            //Object to be sent to forum page
            var outputQ = {

              //takes the last object in the result array and gets its respective parameter 
              q_id : result[result.length-1].question_id,
              title : result[result.length-1].question_title,
              body : result[result.length-1].question_body,
              userID: result[result.length-1].user_id,
              // following code implemented using SQL2 query
              user_asked: result[result.length-1].asked_by,
              question_pts: null,
              datetime_asked:(new Date(result[result.length-1].datetime_asked)).toISOString().split("T")[0],

              // for answers, we store all the answers related to the given question_id in an array, where we iterate through the ANSWER object that was posted to the database from SQL2 query
              answers:      
              (function() {
                arr = [];
                /*The following code uses the function created before. From the intersection we can have 3 scenarios. When there are no 
                common answer_id between both tables. When the number of answer_id in common between both tables is less than the num of answer for 
                that question (answer.lenth) and when the number of common answer_id between both tables is the same as num of answers (answer.length)*/

                //First Scenario
                //Meaning no answer has a vote yet.
                //totalScoreAnsArr is the array that stores the sum of scores from the answer_id given the function.
                //This array is then passed to the for loop on line .
                //If there are no common answer_id between the tables, I instantiated all its entries to 0.
                if(FirstInter.length == 0){
                  var totalScoreAnsArr = new Array(answer.length)
                  for(var i = 0; i<answer.length;i++){
                    totalScoreAnsArr[i]=0;
                  }
                }

                //Second Scenario 
                //Meaning some answer have votes in it.
                //I make a Second intersection that looks for common answer_id between the first intersection and the answer object taken from the query database (can explain more in person)
                //Then it iterates in a for loop looking for answers that has the exact same answer_id of second intersection
                //When found, we populate the totalScoreAnsArr.
                else if (FirstInter.length < answer.length){
                  var totalScoreAnsArr = new Array(answer.length)
                  var SecondInter =intersect_arrays(answer, FirstInter )
                  console.log("Second intersection "+ util.inspect(SecondInter))
                  for(var j=0;j<SecondInter.length;j++){
                    for (var n =0; n<answer.length;n++){
                      var totalScoreAns = 0;

                      if(SecondInter[j].answer_id==answer[n].answer_id){
                        if (SecondInter[j].positiveScore != null){
                          totalScoreAns += SecondInter[j].positiveScore;
                        }

                        if (SecondInter[j].negativeScore != null){
                          totalScoreAns -= SecondInter[j].negativeScore;
                        }

                        totalScoreAnsArr[n]=totalScoreAns;
                        console.log("Total answer = "+ totalScoreAns);  
                      }

                      if(totalScoreAnsArr[n]==null){
                        totalScoreAnsArr[n]=0;
                      }
                    }

                  }
                  //Debugging to get the array fo total score of answers
                  console.log(totalScoreAnsArr);
                }

                //Third scenario when length of first intersection is the same as number of answer
                //Meaning all answer have some votes.
                else if (FirstInter.length == answer.length){

                  var totalScoreAnsArr = new Array(answer.length)
                  for(var k = 0; k< answer.length; k++){
                    if (FirstInter[k].answer_id == answer[k].answer_id){
                      var totalScoreAns = 0;

                      if (FirstInter[k].positiveScore != null)
                        totalScoreAns += FirstInter[k].positiveScore;

                      if (FirstInter[k].negativeScore != null)
                        totalScoreAns -= FirstInter[k].negativeScore;

                      totalScoreAnsArr[k]=totalScoreAns;
                      //Another debugging measure to get total answer arrays, making sure it is getting updated
                      console.log("Total answer = "+ totalScoreAnsArr);                 
                    }               
                  }
                }

                //Same as before, it iterates through num of answers and now answer_pts is set to values in
                //totalScoreAnsArr array, which we also made sure its the same length as answer output.
                for(var i = 0; i< answer.length; i++){                
                  arr.push(
                  {
                    answer_id: answer[i].answer_id,
                    answer: answer[i].answer_body,
                    user_answered: answer[i].answered_by,
                    userID: answer[i].user_id,
                    answer_pts:totalScoreAnsArr[i],
                    datetime_answered: (new Date(answer[i].datetime_answered)).toISOString().split("T")[0]
                  });
                }return arr

              })()
            };
          // Get the question points
          //Query takes the sum of the total positive score, and total negative score for the question_id from the score_question table.
          var sql_totalScore = "SELECT SUM(CASE WHEN score= '1' THEN 1 ELSE 0 END) AS positiveScore, Sum(CASE WHEN score = '-1' THEN 1 ELSE 0 END) AS negativeScore FROM score_question WHERE question_id = ?";
          db.query(sql_totalScore, [qId], function(err, result_q1)
          {
            if (err)
            {
              console.log("Select Sum query failed " + err);
              return;
            }

            //The totalScore of the question_id is the substraction between the positive score and the negative score.
            var totalScore = 0;

            if (result_q1[0].positiveScore != null)
              totalScore += result_q1[0].positiveScore;

            if (result_q1[0].negativeScore != null)
              totalScore -= result_q1[0].negativeScore;
            outputQ.question_pts = totalScore;
            // Debugging measure to show if the outputQ object is being sent with the proper values
            console.log("outputQ "  + util.inspect(outputQ) + " " + (new Date(outputQ.datetime_asked)).toISOString().split("T")[0]);
            res.render('forum_page.ejs', {forum: outputQ});
          });
        }); 

});
});
});

  /*POST THE ANSWER ON THE ANSWER BOX, THERE IS A QUERY INSIDE. AND YES THIS APP.POST IS INSIDE THE APP.GET FROM ABOVE*/
  router.post("/answer_to/:q_id/:user_answered", function(req, res) {

  //OBJECTED TO BE POSTED TO ANSWER TABLE
  var newA = {
    answer_body : req.body.answer_body,
    user_id : req.params.user_answered, // Can also be accessed by req.session.user_id
    question_id : req.params.q_id,
    datetime_answered :  date.format(new Date(), 'YYYY-MM-DD h:m:s'), 
  }

  //MYSQL QUERRY
  var sql_insertAnswer =" insert into answer set ?";
  db.query(sql_insertAnswer, newA, function(err,result){
    if(err){
      console.log(err);
      return;
    }
    console.log("Answer succesfully added ")
    res.redirect("/question_forum/" + req.params.q_id);
  });
});

  module.exports = router;