
 'use strict';
 const bodyParser = require('body-parser');
 const request = require('request');
 const async = require('async');
 const zlib = require('zlib');
 //**********************************************************
 //**********************************************************
 exports.signup= function(req, reply){
 
 	var body = req.body;
		async.waterfall([
			verfiyUser,
    		addUser
    	], function (err, result) {
    		if (err){
    			console.log("line 17",err);
    			reply.status(404).send(err);
    		}else{
    			console.log(result);
    			reply.status(200).send(result);
    		}
    	});
		
		function verfiyUser(callback) {
		console.log("verifying if the user exists");
			var options={
 					uri:'https://localhost:9443/api/signup/verifyuser',
 					method :'POST',
 					headers:{
 							'Authorization':'SecureConnection'
 							},
 					body:req.body,
 					json:true,
 					rejectUnauthorized: false,
    				requestCert: true,
    				agent: false,
    				gzip:true
 				}
 			request(options, function(err, response, body){

 					if(err) { 
 						console.log("line 71:",err); 
 						callback(err); 
 						return; 
 					}
 					callback(false, body);
        		});
		}
		
		function addUser(arg1, callback) {
		console.log("Adding user");
    		if (arg1.length===0){
    			var options={
 					uri:'https://localhost:9443/api/signup/adduser',
 					method :'POST',
 					headers:{
 							'Authorization':'SecureConnection'
 							},
 					body:req.body,
 					json:true,
 					rejectUnauthorized: false,
    				requestCert: true,
    				agent: false,
    				gzip:true
 				 	}
 				request(options,function(err, response, body){
						
 					if(err) { 
 						console.log("line 71:",err); 
 						callback(err); 
 						return; 
 					}
        					callback(false, body);
 				});
    		} else {
    		callback(null, "User Already Exists with this email");
    		}
    	};
 }
