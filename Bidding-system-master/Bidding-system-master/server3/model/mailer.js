'use strict';
const nodemailer = require('nodemailer');
const db = require('../db.js');
const async = require('async');
const trans = require('./Transactions.js');
const redis = require('redis');
 const client = redis.createClient(6379); 
// create reusable transporter object using the default SMTP transport
var transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: 'abhi.4125@gmail.com',
        pass: '10bch0032'
    }
});
//***********************************************
function sendMail(json, cb){
	var text ;
	if (json[2] ==="buyer"){
		text='Hello, Congratulation you own the auction on item '+ json[1] +' .Please, Check your account for purchase order details. Thank you :):)'
	}else {
		text='Hello, Congratulation your item '+ json[1] +' on auction is being sold.Please, Check your account for purchase order details. Thank you :):)'

	}
	var mailOptions = {
    	from: 'abhi.4125@gmail.com',
    	to: json[0],
    	subject: 'Auction Confirmation',    	
    	text: text
    	};
	
	// send mail with defined transport object
	transporter.sendMail(mailOptions, function(error, info){
    	if (error) {
        	return console.log(error);
        	cb(error, null);
    	}
    	console.log('Message %s sent: %s', info.messageId, info.response);
    	cb(null,info);
	});
}
//*************************************************
//*************************************************
/*
 * This script triggers transaction completion and send emails to both buyer and seller
 */
 setInterval(function(){
	timedoutitems(function(err, res){
		if (err){
			console.log(err);
		}else{
			console.log("emails sent to both seller and buyer.");
		}
	})
 },6000);

 
function timedoutitems(callback) {
		
    var q = "select item_id, user_id ,item_desc from items where shelf_time=0 and notification_status ='N' and status ='available'";
    db.query(q,function(err, data){
    	if (err){
    		callback(err, null);
    	}else if(data && data.length >0){
    	console.log("line 57:",data.length);
    	    		data.forEach(id =>{
    			var values =[
    			 id.item_id,
    			 id.user_id,
    			 id.item_desc
    			]
    			
//     			console.log("values passed:", values);
    			mailer(values, function(err, data){
    				if (err){
							callback(err, null);
					}else {
						
						callback(null, data);
					}
    			});
    				console.log("line 74 :", values[0]);
    			var q = "update items set notification_status ='Y',status ='soldout' where item_id = "+values[0];
						db.query(q,function(err, res){
							if (err){
								console.log("Notification status not updated");
							}else{

								console.log("Notification status is updated");
							}
						});
    		});
    	}else{
    	
    		console.log("timed out items :", data);
    	}
    });
}


function mailer(values, callback){

var itemid = values[0];
var userid = values[1];
var description = values[2];
// console.log("values passed:", itemid, userid, description);

 	async.series([
 		function emailbuyer(callback){
			var type = "buyer";
			var q = "select u.user_id, u.email, b.bid_amount, b.bid_id from bids b, users u where item_id =? and u.user_id = b.user_id order by b.bid_amount desc limit 1";
			db.query(q, itemid, function(err, data){
				if (err){
					callback(err, null);
				}else{
					console.log("lin 107:",data[0]);
					var email = data[0].email;
					var details = [
						email,
						description,
						type
					]
					console.log("line 114:", details);
					
					var bidid = data[0].bid_id;
					var bidamount = data[0].bid_amount;

					trans.updatetransactionsDb(bidid, itemid, bidamount, function(err, res){
						if (err){
							console.log("transactions table not updated");
						}else{
							console.log("transaction table is updated");
						}
					});
// 					console.log("values passed:",details);
					sendMail( details,function(err, data){
    					if (err){
							callback(err, null);
						}else {

							callback(null, data);
						}
					});
					client.del("allitems",function(err, res){
						if (err){
							console.log("error in deleting all items from cache");
						}else{
							console.log("Deleted all items from cache");
						}
					})
				}
			})
		},
		function emailseller(callback){
			var type = "seller";
			var q = "select email from users where user_id = ? ";
			db.query(q, userid, function(err, data){
				if (err){
					callback(err, null);
				}else {
					var email =data[0].email;
					var details = [
						email,
						description,
						type
					]
					sendMail( details,function(err, data){
    					if (err){
							callback(err, null);
						}else {
							callback(null, data);
						}
					});
				}
			})
		}
	], function(err, result){
		if (err){
			callback("line 57",err);
		}else {
			callback("line 57",result);
		}
	});
}
