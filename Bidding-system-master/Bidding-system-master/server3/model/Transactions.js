/*
 * This js implements the main logic and interacts with the database
 */ 
 
 'use strict';
 const db = require('../db.js');
 const bodyParser = require('body-parser');
 const mailer = require('./mailer.js');
 //***************************************************************
 //Register the items posted by the user in Items table
 // function itemstatusupdateDb(itemid, cb){
 
 // 	 	var q = "update items set status = 'soldout' where item_id ="+itemid;
 // 	 	db.query(q, function(err, data){
 // 		if (err){
 // 		console.log(err);
 // 			cb(err, null);
 // 		}else {
 // 			console.log("Item status updated to soldout");
 // 			cb(null,"Item status updated to soldout");
 // 		}
 // 	});
 // }
 //***************************************************************
 exports.updatetransactionsDb = function(bidid, itemid, bidamount, cb){
 	console.log(bidid, itemid, bidamount);
 	var q = "insert into transactions (bid_id, item_id, trans_value)"
 			+"values(?,?,?)";
 	var values =[
 		bidid,
 		itemid,
 		bidamount
 	];
 	
 	db.query(q,values, function(err, data){
 		if (err){
 		console.log(err);
 			cb(err, null);
 		}else {
 			cb(null,data);
 		}
 	});
 }
 //***************************************************************
 function itemsuserpurchasedDB(userid, cb){
 	
 	var q = "select i.item_id, i.item_desc, t.trans_id, t.bid_id, t.trans_value ,t.Rec_mtn_time from items i, bids b, transactions t  where t.bid_id=b.bid_id and b.item_id = i.item_id and i.status ='soldout'and b.user_id = ?";
 	
 	db.query(q, userid, function(err, data){
 		if (err){
 			cb(err, null);
 		}else {
 			cb(null,data);
 		}
 	});
 } 
 //*********************************************************
 // function sendmail(bidid, itemid, callback){
 // 	var values= [
 // 			bidid, 
 // 			itemid
 // 		]
 	
 // 	var q = "select u.user_id userid, u.email to_email , t.trans_id transid, i.item_desc description from bids b, users u , transactions t , items i where u.user_id = b.user_id and t.bid_id = b.bid_id and t.item_id = b.item_id and i.item_id = b.item_id and b.bid_id="+bidid+" and b.item_id ="+itemid;
 	
 // 		db.query(q,function(err, data){
 // 			if (err){
 // 				console.log(err);
 // 				callback(err, null);
 // 			}else{
 // 				console.log('Line 78: ', data );
 //        			var string=JSON.stringify(data);
 //        			var json =  JSON.parse(string);
 //        			console.log('email : ', json[0].to_email);
        			
 //        			mailer.sendMail(json, function(err,data){
 // 					if (err){
 // 						console.log(err);
 // 						callback(err, null);
 // 					}else{
 // 						console.log(err);
 // 						callback(null,data);
 // 					}
 // 				});
 // 			}
 // 		});
//  		console.log("line 72:",details);
 	// mailer.sendMail(json, function(err,data){
//  	console.log("line 74:",values);
// 
//  		if (err){
//  			console.log(err);
//  			callback(err, null);
//  		}else{
//  			console.log(err);
//  			callback(null,data);
//  		}
//  	})
// }

 //***************************************************************
 //***************************************************************
 exports.registertransactions = function(req, res){
	var bidid = req.body.bidid ? req.body.bidid : null;
	var itemid = req.body.itemid ? req.body.itemid :null;
	var bidamount = req.body.bidamount ? req.body.bidamount: null;

 	updatetransactionsDb(bidid, itemid, bidamount, function(err, data){
 	
 		if (err){
 			res.status(404).send(err);
 		}else {
 			itemstatusupdateDb(itemid, function(err, logs){
 				if (err){
 					console.log(err);
 				}else{
 					console.log(logs);
 				}
 			});
 			sendmail(bidid, itemid, function(err, data){
 				if (err){
 					console.log(err, null);
 				}else {
 					console.log(null, data);
 				}
 			})
 			res.status(200).send("Transaction completed for the item :"+itemid);
 		}
 	});
 }
//*****************************************************************
exports.itemsuserpurchase = function(req, res){
	var userid = req.query.userid ? req.query.userid : null;
	
	itemsuserpurchasedDB(userid, function(err, data){
		if (err){
			console.log(err);
			res.status(404).send(err);
		}
		else {
			console.log(null, data);
			res.status(200).send(data);
		}
	});
}