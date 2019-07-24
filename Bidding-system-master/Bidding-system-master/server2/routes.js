/*
 *These are the standard routes for the Bidding system server
 */
 'use strict';
 const express = require('express');
 const request = require('request');
 const c_signup = require('./controllers/signup.js');
 const c_loginout = require('./controllers/LogInOut.js');
 const c_items = require('./controllers/Items.js');
 const c_bids= require('./controllers/Bids.js');
 const c_trans = require('./controllers/Transactions.js');
 const c_profile = require('./controllers/profileInfo.js');
 const jwt = require('jsonwebtoken');
 const redis = require('redis');
 const client = redis.createClient(6379); 
 
 var router = express.Router();
 
 router.use(function (req, res, next){
 	console.log("verifying Web service Authorization")
 	console.log("request headers:", req.headers);
 	if ( req.headers.authorization === 'SecureConnection'){
 		console.log("Client is Authorized");
 		next();
 	}else{
 		console.log("client is not Authorized");
 		res.status(404).send("Unauthorized Request....");
 	}
 });
 
router.post('/login', c_loginout.login);

var auth = function(req, res, next){
	client.get('session', function(err, data){
		if (data === null){
			console.log("44:session expired. Please login again");
			res.status(401).send("session expired. Please login again");
		}else{
			return next();
		}
	})
  }

 router.use(function timeLog(req, res,next){
 	console.log("Time Log:"+Date.now());
 	next();
 });
 
 router.get('/allitems',c_items.allitems);
 router.post('/signup', c_signup.signup); 

 router.post('/logout',auth,c_loginout.logout);
 router.get('/user/profileInfo', auth,c_profile.profileInfo);
 router.post('/user/editprofile', auth,c_profile.updateprofile);
 
 router.get('/user/userbidstatus', auth, c_bids.bidstatus);
 router.post('/user/postbids', auth, c_bids.postbids);
 router.delete('/user/deletebid',auth, c_bids.deletebids);

 
 router.get('/user/useritems',auth, c_items.useritems);
 router.get('/user/bidsonitem', auth,c_bids.bidsonitem);
 router.post('/user/postitems', auth, c_items.postitems);
 router.delete('/user/deleteitems',auth, c_items.deleteitems);
 
 router.get('/user/purchaseorder', auth, c_trans.purchaseorder);
 router.get('/user/searchitems', auth, c_items.searchitems);


 module.exports = router;