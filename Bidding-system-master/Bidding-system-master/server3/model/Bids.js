/*
 * This js implements the main logic and interacts with the database
 */ 
 
 'use strict';
 const db = require('../db.js');
 const bodyParser = require('body-parser');
 //***************************************************************
 //Register the items posted by the user in Items table
 function registerBidsDB(userid, itemid, bidamount, cb){
 	
 	var q = "insert into bids (user_id, item_id, bid_amount)"
 			+" values(?,?,?)";
 	var values =[
 		userid,
 		itemid,
 		bidamount
 	];
 	
 	
 	
 	db.query(q,values, function(err, data){
 		if (err){
 			cb(err, null);
 		}else {

		 	var q = "update items set highest_bid ="+ bidamount +" where item_id ="+itemid;
		 	db.query(q, function(err, res){
		 		if (err){
		 			console.log("highest bid not updated", err);
		 		}else {
		 			console.log("highest bid updated");
		 		}
		 	});
 			cb(null, data);
 		}
 	});
 	
 }
 
 //***************************************************************
 function listbidsDb(userid, cb) {
 	var q = "select items.item_id, items.item_desc, bids.bid_id, bids.bid_amount, bids.Rec_mtn_time, items.status from bids, items where bids.item_id = items.item_id and items.user_id = ? ";
 	
 	db.query(q,userid, function(err, data){
 		if (err){
 			cb(err, null);
 		}else {
 			cb(null,data);
 		}
 	});
 }
 //***************************************************************
 function listuserbids(userid, cb) {
 	var q = "select * from bids, items where bids.item_id = items.item_id and bids.user_id =" +userid;
 	
 	db.query(q, function(err, data){
 		if (err){
 			cb(err, null);
 		}else {
 			cb(null,data);
 		}
 	});
 }
  //***************************************************************
 function deletebidsDb(bidid, cb) {
 	var q = "delete from bids where bid_id ="+bidid;
 	
 	db.query(q, function(err, data){
 		if (err){
 			cb(err, null);
 		}else {
 			cb(null,data);
 		}
 	});
 }
 //***************************************************************
 //***************************************************************
 exports.registerbids = function(req,res){
 	var userid = req.body.userid ? (req.body.userid) : null;
 	var itemid = req.body.itemid ? (req.body.itemid) : null;
 	var bidamount = req.body.bidamount ? (req.body.bidamount) : null;

 	registerBidsDB(userid, itemid, bidamount, function(err, data){
 		if (err){
 			res.status(404).send(err);
 		}else {
 			res.status(200).send(data);
 		}
 	});
 }
 //***************************************************************
 exports.bidsonitem = function(req,res){
 	var userid = req.query.userid ? (req.query.userid) : null;
 	
 	listbidsDb(userid, function(err, data){
 		if (err){
 			res.status(404).send(err);
 		}else {
 			res.status(200).send(data);
 		}
 	});
 }
 //***************************************************************
 exports.bidstatus = function(req,res){
 	var userid = req.query.userid ? (req.query.userid) : null;
 	
 	listuserbids(userid, function(err, data){
 		if (err){
 			res.status(404).send(err);
 		}else {
 			res.status(200).send(data);
 		}
 	});
 }
 //***************************************************************
 exports.deletebids = function(req,res){
 	var bidid = req.body.bidid ? req.body.bidid : null;
	
		deletebidsDb(bidid, function(err, data){
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

 