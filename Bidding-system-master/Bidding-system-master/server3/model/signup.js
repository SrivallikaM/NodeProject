/*
 *This is a sign up file in model
 */
 'use strict';
 
 const uuid = require('uuid');
 const db = require('../db.js');
 const url = require('url');
 const md5 = require('md5');
 
 //verify if the user already exists
 var checkUserDB = function(email, callback){
//  console.log("line13:");
 	var q = "select * from users where email= ?";
 	db.query(q, email, function(err, data){
//  	console.log("line 16",q);
 		if (err){
 			callback(err, null);
 		}else {
 			callback(null, data);
 		}
 	});
 };
 // Add new user if user does not exist
 var addUsersDB = function(body,callback){

 		var id =uuid.v1();
 		var q = "insert into users ( password, salt " 
 			+",email, first_name, last_name, curloginlocation"
 			+")values"
 			+"(?,?,?,?,?,?)";
 		var values = [
 		md5(body.password+id),
 		id,
 		body.email,
 		body.firstname,
 		body.lastname,
 		body.loginlocation
 		]
//  		console.log("line53:",body.password, id, md5(body.password+id));
 		
 		db.query( q, values, function(err, data){
//  		console.log("line 43",q);
 			if (err){
 				console.log(err);
 				callback(err, null);
 			}else {
//  				console.log("line 48:",data);
 				callback(null, data);
 			}
 		});
}

 /******************************************************
 *******************************************************/
 
 exports.verifyuser = (function(req, reply){
  var email = req.body.email;
 	checkUserDB(email, function(err,data){
//  	console.log("line 60", email);
 		if (err){
 		consloe.log(err);
 			reply.status(404).send(err)
 		}else {
//  		console.log("line 65",data);
 			reply.status(200).send(data)
 		}
 	});
  });
 exports.adduser = (function(req, reply){
 var body = req.body;
 	addUsersDB(body, function(err,data){
//  	console.log("line 72",body);
 		if (err){
 			reply.status(404).send(err)
 		}else {
 		 	// zlib.gzip(data, function(err, data){
//     			if (err){
//     				console.log("this is a zipping error");
//     				reply.status(404).send(err)
//     			}else{
//     				console.log("Response is compressed");
//     				reply.status(200).send(data)
//     			}
//  			});
			reply.status(200).send(data)

 		}
 	});
 });
 