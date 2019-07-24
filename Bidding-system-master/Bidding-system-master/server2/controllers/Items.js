/*
 * Items.js : Registers items posted by users in the bidding system.
 */
 
 'use strict';
 const bodyParser = require('body-parser');
 const request = require('request');
 const async = require('async');
 const redis = require('redis');
 const client = redis.createClient(6379);
 const c_profile = require('./profileinfo.js');
 const zlib = require('zlib');

//***************************************************
function loaditems( userid, desc,initbid, shelftime, callback){
	var options = {
		uri:'https://localhost:9443/api/user/items',
 		method :'POST',
 		headers:{
 				'Authorization':'SecureConnection'
 				},
 		body:{desc, userid, initbid, shelftime},
 		json:true,
 		rejectUnauthorized: false,
    	requestCert: true,
    	agent: false
 		}
	request(options, function(err, response, body){
 		if(err) { 
 			console.log("error in items:line 29",err);
 			callback(true); 
 			return; 
 		}
        		callback(false, body);
	});
}

//************************************************
function listitems(callback){
	client.get('allitems', function(err, res){
		if (err) {
			console.log("cache error items:line 41",err);
			callback(err, null);
		} else if (res && res.length > 0) {
			console.log("Getting allitems from Cache:",JSON.parse(res));
			callback(null,JSON.parse(res));
		} else {
			console.log("Cache miss ... Getting allitems list from DataBase");
			var options = {
				uri:'https://localhost:9443/api/allitems',
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
// 			console.log(response);
 				if(err) { 
 					console.log("error in bids:line 60",err);
 					callback(true); 
 					return; 
 				} 
 				console.log("output from Database:", body);
 				client.set('allitems', JSON.stringify(body),function(err, added){
 					if(err){
        					console.log("error with cache in items : line 66", err);	
 					}else{
        					console.log("updated all items cached",body); 	
        				}
 				})
 				callback(null, body);
			});
		}
	});
}
//************************************************
function deleteitemsuser(itemid, callback){
	var options = {
		uri:'https://localhost:9443/api/user/deleteitems',
 		method :'DELETE',
 		headers:{
 				'Authorization':'SecureConnection'
 				},
 		body:{itemid},
 		json:true,
 		rejectUnauthorized: false,
    	requestCert: true,
    	agent: false
 		}
	request(options, function(err, response, body){
 		if(err) { 
 			console.log("error in items: line  93",err); 
 			callback(true); 
 			return; 
 		}
        		callback(false, body);
	});
}
//************************************************
function searchitemsuser(desc, callback){
	var options = {
		uri:'https://localhost:9443/api/user/searchitems',
 		method :'GET',
 		headers:{
 				'Authorization':'SecureConnection'
 				},
 		qs:{desc},
 		json:true,
 		rejectUnauthorized: false,
    	requestCert: true,
    	agent: false
 		}
	request(options, function(err, response, body){
 		if(err) { 
 			console.log("error in items: line  116",err); 
 			callback(true); 
 			return; 
 		}
        		callback(false, body);
	});
}
//************************************************
function listuseritems(userid, callback){
	var options = {
		uri:'https://localhost:9443/api/user/useritems',
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
 			console.log("error in items: line  139",err); 
 			callback(true); 
 			return; 
 		}
        		callback(false, body);
	});
}
//************************************************
//************************************************
exports.postitems = function(req, res){
var desc = req.body.desc ? req.body.desc :null;
var initbid = req.body.initbid ? req.body.initbid :null;
var shelftime = req.body.shelftime ? req.body.shelftime :null;

client.del("allitems", function(err, res){
	if (err){
		console.log("allitems in cache is not in sync");
	}else{
		console.log("all items in cache is consistent");
	}
});
 
async.waterfall([
  	getuserid, 
  	loadingitems
  ], function(err, result){
  		if(err){
 			console.log("error in items:line 166",err);
 			res.send(err);
 		}else{
 			res.send(result);
        	}
  });
  
  function getuserid (callback){
  	client.get("userid",function(err, data){
 		if(err){
 			console.log("error in items:line 176",err);
 			callback(null);
 		}else{
 			callback(null,parseInt(data));				
        	}
 	});
  }
  function loadingitems(arg1, callback){
  var userid = arg1;
  	loaditems(userid, desc,initbid, shelftime, function(err, data){
			if (err){
				callback(err, null);
			}else {
				callback(null, data);
			}
		});
  	}
}
	

//************************************************
exports.allitems = function(req, res){
	
	listitems(function(err, data){
		if (err){
			res.status(404).send(err);
		}
		else {
				// var result = zlib.gzip(data, function(_, resp){
// 				//res.end(resp);
// 				res.status(200).send(resp);
// 			})
			res.status(200).send(data);
		}
	})
}
//*************************************************
exports.deleteitems = function(req, res){
	var itemid = req.body.itemid ? req.body.itemid : null;
	
	deleteitemsuser(itemid, function(err, data){
		if (err){
			console.log("error in items:line 215",err);
			res.status(404).send(err);
		}
		else {
			res.status(200).send("item deleted successfully");
		}
	})
}
//*************************************************
exports.searchitems = function(req, res){
	var desc = req.query.desc ? req.query.desc : null;
	
	searchitemsuser(desc, function(err, data){
		if (err){
			console.log("error in items: line 228",err);
			res.status(404).send(err);
		}
		else {
			res.status(200).send(data);
		}
	})
}
//*************************************************
exports.useritems = function(req, res){
		
async.waterfall([
  	getuserid, 
  	listitemsuser
  ], function(err, result){
  		if(err){
 			console.log("error in items:line 244",err);
 			res.status(404).send("cache error occured");
 		}else{
 			res.status(200).send(result);			
        	}
  });
  
  function getuserid (callback){
  	client.get("userid",function(err, data){
 		if(err){
 			console.log("error in items:line 254",err);
 			callback(null);
 		}else{
 			callback(null,parseInt(data));				
        	}
 	});
  }
  
  function listitemsuser(arg1, callback){
		listuseritems(arg1, function(err, data){
		if (err){
			console.log("error in items:line 265",err);
			callback(err, null);
		}
		else {
			callback(null, data);
		}
	})
	}
}


