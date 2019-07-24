/*
 * Transactions.js : Completes a transaction once the shelf time is completed.
 */
 'use strict';
 const bodyParser = require('body-parser');
 const request = require('request');
 const async = require('async');
 const redis = require('redis');
 const client = redis.createClient(6379); 

//***************************************************
function purchaseditems(userid, callback){
	var options = {
		uri:'https://localhost:9443/api/user/purchaseorder',
 		method :'GET',
 		headers:{
 				'Authorization':'SecureConnection'
 				},
 		qs:{userid},
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
			console.log("line 77",body);
        		callback(false, body);
	});
}
//************************************************************
//************************************************************
exports.purchaseorder = function(req, res){
				
async.waterfall([
  	getuserid, 
  	itemspurchased
  ], function(err, result){
  		if(err){
 			console.log("line 199",err);
 			res.status(404).send("cache error occured");
 		}else{
 			res.status(200).send(result);			
        	}
  });
  
  function getuserid (callback){
  	client.get("userid",function(err, data){
 		if(err){
 			console.log("line 199",err);
 			callback(null);
 		}else{
 			callback(null,parseInt(data));				
        	}
 	});
  }
  
  function itemspurchased(arg1, callback){
		purchaseditems( arg1, function(err, data){
		if (err){
			console.log(err, null);
			callback(err, null);
		}else {
			console.log(null, data);
			callback(null, data);
		}
	});
	}
}