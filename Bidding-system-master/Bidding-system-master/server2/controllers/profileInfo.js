'use strict';
 const bodyParser = require('body-parser');
 const request = require('request');
 const async = require('async');
 const redis = require('redis');
 const client = redis.createClient(6379); 
  
//*******************************************************
function loadProfile(userid, callback){

client.get("profileinfo", function(err, res){
	if (err){
		console.log("cache error.....");
		callbakc(err, null);
	} else if (res && res.length > 0) {
			console.log("Getting User profile infor from Cache:",JSON.parse(res));
			callback(null,JSON.parse(res));
		} else {
		console.log("Cache miss ... Getting User profile infor from DB");
			console.log("line 50:",userid);
			var options = {
			uri:'https://localhost:9443/api/user/profileInfo',
				qs:{userid},
 				method :'GET',
 				headers:{
 					'Authorization':'SecureConnection'
 						},
 				json:true,
 				rejectUnauthorized: false,
    			requestCert: true,
    			agent: false
 				}
			request(options, function(err, response, body){
 				if(err) { 
 					console.log(err); 
 					callback(true); 
 					return; 
 				}
 				client.set("profileinfo",JSON.stringify(body), function(err, res){
 					if (err){
 						console.log("user profile not stored in cache");
 					}else {
 						console.log("user profile successfully stored in cache");
 					}
 			});		
        			callback(false, body);
        		});
        	}
    });
}
//******************************************************
function editprofile(userid, firstname, lastname, email, callback){
	var options = {
		uri:'https://localhost:9443/api/user/updateprofile',
		method :'POST',
		body:{userid, firstname, lastname, email},
 		headers:{
 				'Authorization':'SecureConnection'
 				},
 		json:true,
 		rejectUnauthorized: false,
    	requestCert: true,
    	agent: false
 		}
	request(options, function(err, response, body){
 		if(err) { 
 			console.log(err); 
 			callback(true); 
 			return; 
 		}
			console.log("line 50",body);
        		callback(false, body);
	});
}

//******************************************************
//******************************************************
exports.profileInfo = function(req, res){
var userid ;
async.waterfall([
  	getuserid, 
  	loaduser
  ], function(err, result){
  		if(err){
 			console.log("line 199",err);
 			res.status(404).send("cache error occured");
 		}else{
 			res.status(200).send("User successfully logged out");			
        	}
  });
  
  function getuserid (callback){
  console.log("Getting User login information from cache...");
  	client.get("userid",function(err, data){
 		if(err){
 			console.log("line 199",err);
 			callback(null);
 		}else{
 			userid = parseInt(data);
 			console.log("line 202", data ,"; ", userid);
 			callback(null,userid);				
        	}
 	});
  }
  
  function loaduser(args1, callback){
		console.log("line 50:",userid);		loadProfile(userid, function(err, data){
			if (err){
// 				console.log(err, null);
				res.send(err);
			}else {
// 				console.log(null, data);
				res.send(data);
			}
		});
	}
}

	
//*********************************************************
exports.updateprofile = function(req, res){
	var firstname = req.body.firstname ? req.body.firstname :null;
	var lastname = req.body.lastname ? req.body.lastname :null;
	var email = req.body.email ? req.body.email :null;

async.waterfall([
  	getuserid, 
  	edituser
  ], function(err, result){
  		if(err){
 			console.log("line 199",err);
 			res.status(404).send("cache error occured");
 		}else{
 			res.status(200).send("Profile updated Successfully");			
        	}
  });
  
  function getuserid (callback){
  console.log("Getting User login information from cache...");
  	client.get("userid",function(err, data){
 		if(err){
 			console.log("line 199",err);
 			callback(null);
 		}else{
 			callback(null,parseInt(data));				
        	}
 	});
  }
  
  function edituser(arg1, callback){
		editprofile(arg1, firstname, lastname, email, function(err, data){
	 	if (err){
			callback(err, null);
		}else {
			callback(null, data);
		}
	 });
	}
	
	
	client.del("profileinfo", function(err, res){
		if (err){
			console.log("profile info is not consistent");
		}else {
			console.log("profile information is removed from cache");
		}
	})
}
	
