/*
 * Bid.js : Registers bids posted by users in Bids table.
 */
 
 'use strict';
 const bodyParser = require('body-parser');
 const request = require('request');
 const async = require('async');
 const redis = require('redis');
 const client = redis.createClient(6379); 
 
//***************************************************
function loadbids(userid, itemid, bidamount, callback){
	var options = {
		uri:'https://localhost:9443/api/user/bids',
 		method :'POST',
 		headers:{
 				'Authorization':'SecureConnection'
 				},
 		body:{userid, itemid, bidamount},
 		json:true,
 		rejectUnauthorized: false,
    	requestCert: true,
    	agent: false
 		}
	request(options, function(err, response, body){
 		if(err) { 
 			console.log("error in bids:line 28",err); 
 			callback(true); 
 			return; 
 		}
        		callback(false, body);
	});
}
//*********************************************************
function listbidsonitem(userid, callback){
	var options = {
		uri:'https://localhost:9443/api/user/bidsonitem',
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
 			console.log("error in bids:line 51",err); 
 			callback(true); 
 			return; 
 		}
			console.log("line 58",body);
        		callback(false, body);
	});
}
//*********************************************************
function listuserbids(userid, callback){
	var options = {
		uri:'https://localhost:9443/api/user/bidstatus',
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
 			console.log("error in bids:line 75",err); 
 			callback(true); 
 			return; 
 		}
        		callback(false, body);
	});
}
//*********************************************************
function deleteuserbids(bidid, callback){
	var options = {
		uri:'https://localhost:9443/api/user/deletebids',
 		method :'DELETE',
 		headers:{
 				'Authorization':'SecureConnection'
 				},
 		body:{bidid},
 		json:true,
 		rejectUnauthorized: false,
    	requestCert: true,
    	agent: false
 		}
	request(options, function(err, response, body){
 		if(err) { 
 			console.log("error in bids:line 98",err); 
 			callback(true); 
 			return; 
 		}
        		callback(false, body);
	});
}


//**********************************************************
//**********************************************************
exports.postbids = function(req, res){
	var itemid = req.body.itemid ? (req.body.itemid) : null;
 	var bidamount = req.body.bidamount ? (req.body.bidamount) : null;
 	
 	client.del("allitems", function(err, res){
	if (err){
		console.log("allitems in cache is not in sync");
	}else{
		console.log("all items in cache is consistent");
	}
});
	
	async.waterfall([
  	getuserid, 
  	listbidsuser
  ], function(err, result){
  		if(err){
 			console.log("error in bids:line 126",err);
 			res.status(404).send("cache error occured");
 		}else{
 			res.status(200).send("Bid posted Successfully");			
        	}
  });
  
  function getuserid (callback){
  	client.get("userid",function(err, data){
 		if(err){
 			console.log("error in bids:line 136",err);
 			callback(null);
 		}else{
 			callback(null,parseInt(data));				
        	}
 	});
  }
  
  function listbidsuser(arg1, callback){
			loadbids( arg1, itemid, bidamount, function(err, data){
			if (err){
				console.log(err, null);
				callback(err, null);
			}else {
				callback(null, data);
			}
		});
	}
}
	
//**********************************************************
exports.autocomplete = function(req, res){
	var body = req.body;
	
	completetransactions( body, function(err, data){
		if (err){
			console.log(err, null);
			res.status(404).send(err);
		}else {
			console.log(null, data);
			res.status(200).send(data);
		}
	});
}
//**********************************************************
exports.bidsonitem = function(req, res){
	async.waterfall([
  		getuserid, 
  		userbidsonitem
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
  	
  	function userbidsonitem(arg1, callback){
			listbidsonitem(arg1, function(err, data){
			if (err){
				console.log("error in bids:line 198", err);
				callback(err, null);
			}else {
				callback(null, data);
			}
		});
	}
}
	
//**********************************************************
exports.bidstatus = function(req, res){
		
async.waterfall([
  	getuserid, 
  	listbidsuser
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
 			console.log("error in bids:line 225",err);
 			callback(null);
 		}else{
 			callback(null,parseInt(data));				
        	}
 	});
  }
  
  function listbidsuser(arg1, callback){
		listuserbids(arg1, function(err, data){
		if (err){
			console.log("error in bids:line 237",err);
			callback(err, null);
		}else {
			callback(null, data);
		}
	});
	}
}


//**********************************************************
exports.deletebids = function(req, res){
	var bidid = req.body.bidid ? req.body.bidid : null;
	deleteuserbids(bidid, function(err, data){
		if (err){
			console.log("error in bids:line 251",err);
			res.status(401).send(err);
		}else {
			res.status(200).send(data);
		}
	});
	}