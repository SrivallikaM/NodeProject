/*
 * This js implements the main logic and interacts with the database
 */ 
 
 'use strict';
 const db = require('../db.js');
 const bodyParser = require('body-parser');
 //***************************************************************
 //To verify if the item posted is a duplicate
 function verifyItemsDB(desc, userid, cb){
 var values = [
 	desc, 
 	userid
 ]
 var q = "select * from items where item_desc like ? and user_id = ?";
 	db.query(q, values, function(err, data){
 		if (err){
 			cb(err, null);
 		}else {
 			cb(null, data);
 		}
 	})
 	
 }
 //***************************************************************
 //Register the items posted by the user in Items table
 function registerItemsDB(desc, userid, initbid, shelftime, cb){
 	
 	var q = "insert into items (item_desc, user_id, init_bid, shelf_time, highest_bid)"
 			+"values(?,?,?,?,?)";
 	var values =[
 		desc,
 		userid,
 		initbid,
 		shelftime, 
 		initbid
 	];
 	
 	db.query(q,values, function(err, data){
 		if (err){
 			cb(err, null);
 		}else {
 			cb(null,data);
 		}
 	});
 }
 //***************************************************************
 function listitemsDb (cb){
 	
 	var q = "select * from items where status = 'available'";
 	
 	db.query(q, function(err, data){
 		if (err){
 			cb(err, null);
 		}else {
 			cb(null,data);
 		}
 	});
 }
 //***************************************************************
 function deleteitemsDb(itemid, cb){
 	
 	var q = "delete from items where item_id = ?";
 	
 	db.query(q, itemid, function(err, data){
 		if (err){
 			cb(err, null);
 		}else {
 			cb(null,data);
 		}
 	});
 }
 //***************************************************************
 function itemstatusDb(itemid, cb){
 	
 	var q = "select status from items where item_id =?";
 	
 	db.query(q, itemid, function(err, data){
 		if (err){
 			cb(err, null);
 		}else {
 			cb(null,data);
 		}
 	});
 }
 //***************************************************************
 function listuseritemsDb(userid, cb){
 	
 	var q = "select * from items where user_id =?";
 	
 	db.query(q, userid, function(err, data){
 		if (err){
 			cb(err, null);
 		}else {
 			cb(null,data);
 		}
 	});
 }

 //***************************************************************
 function highestbidonitemDb(itemid, cb){
 	
 	var q = "select * from bids b, items i where i.item_id = b.item_id and b.item_id = ? order by bid_amount desc limit 1 ";
 	
 	db.query(q, itemid, function(err, data){
 		if (err){
 			cb(err, null);
 		}else {
 			cb(null,data);
 		}
 	});
 }
 //***************************************************************
 function searchitemsDb(desc, cb){
 	
 	var q = "select * from items where status= 'available' and  item_desc like '%"+desc+"%'";
 	
 	db.query(q, desc, function(err, data){
 		if (err){
 			cb(err, null);
 		}else {
 			cb(null,data);
 		}
 	});
 }
 //***************************************************************
 //***************************************************************
 
 exports.registeritems = function(req, res){
 	console.log("line 52:",req.body);
	var desc = req.body.desc ? req.body.desc :null;
	var userid = req.body.userid ? req.body.userid :null;
	var initbid = req.body.initbid ? req.body.initbid :null;
	var shelftime = req.body.shelftime ? req.body.shelftime :null;
	
 	verifyItemsDB(desc, userid , function(err, data){
 		if (err){
 			res.status(404).send(err);
 		}else if(data.length===0){
 			registerItemsDB(desc, userid, initbid, shelftime , function(err, data){
 				if (err){
 					console.log("post item error:", err);
 					res.status(404).send(err);
 				}else {
 					res.status(200).send("Items Successfully registered");
 				}
 			});
 		}
 	});
 }
//***************************************************************
 exports.allitems = function(req, res){
 	listitemsDb (function(err, data){
 		if (err){
 			res.status(404).send(err);
 		}else{
 			res.status(200).send(data);
 		}
 	});
 }
//****************************************************************
 exports.deleteitems = function(req, res){
	var itemid = req.body.itemid ? req.body.itemid : null;
	
		deleteitemsDb(itemid, function(err, data){
		if (err){
			console.log(err);
			res.status(404).send(err);
		}
		else {
			console.log(null, data);
			res.status(200).send(data);
		}
	})
}
//****************************************************************
 exports.highestbidonitem = function(req, res){
	var itemid = req.body.itemid ? req.body.itemid : null;
	
		highestbidonitemDb(itemid, function(err, data){
		if (err){
			console.log(err);
			res.status(404).send(err);
		}
		else {
			console.log(null, data);
			res.status(200).send(data);
		}
	})
}
//****************************************************************
 exports.searchitems = function(req, res){
	var desc = req.query.desc ? req.query.desc : null;
	
		searchitemsDb(desc, function(err, data){
		if (err){
			console.log(err);
			res.status(404).send(err);
		}
		else {
			console.log(null, data);
			res.status(200).send(data);
		}
	})
}
//****************************************************************
 exports.listuseritems = function(req, res){
	var userid = req.query.userid ? req.query.userid : null;
	
		listuseritemsDb(userid, function(err, data){
		if (err){
			console.log(err);
			res.status(404).send(err);
		}
		else {
			console.log(null, data);
			res.status(200).send(data);
		}
	})
}



