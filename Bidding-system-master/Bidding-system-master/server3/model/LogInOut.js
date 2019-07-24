/*
 *This a LogIn and LogOut routes in Controller
 */
 
 'use strict';
 const bodyParser = require('body-parser');
 const jwt = require('jsonwebtoken');
 const db = require('../db.js');
 const md5 = require('md5'); //to hash function to create a token and store it.
//***********************************************************
//verify if a user exists with the given credentials
var checkUserDb = function (email,password, callback) {
console.log("email:",email,"password:",password);
	var q = 'select email, password, salt, user_id from users where '
		+ 'email = "' + email + '"';
	//console.log(username);
	db.query(q, function(err, res){
		if (err) {
			console.error('line 19: ' + err);
			callback(err, null);
		} else if (res && res.length) {
			if (md5(password+res[0].salt) === res[0].password) {
				console.log("password verified",res);
				callback(null, res);
			}
		} else {
			console.info('email doesnot exist/not verified');
			callback(null, null);
		}
	});
}
//***********************************************************
//Create a session and store the data in sessions table and send the cookie in response
 var storeSessionDB = function(userid, cookie, callback) {
	var url = 'http://localhost:9443/api/login';
	var q = 'insert into sessions (user_id, sesskeyapi) values(?,?)';
	var values =[
	userid, 
	cookie
	]
	console.log("sessions values are stored in user_id and sesskeyapi columns")
	db.query(q, values, function(err, res){
		if (err) {
			console.error('LogInOut.js: createSessionDb: err: ' + err);
			callback(err, null);
		} else if (res) {
			var q1 = 'update users set status ="active" where user_id='+userid;
			db.query(q1, function(err, res){
				if(err){
					callback(err,null)
				}else {
					console.log("User status is Active and session is created...",userid);
					callback(null,{userid:userid});
				}
			});
		} else {
			callback(null, null);
		}
	});
}
//***********************************************************
//Create a new session when user logs in and stores the session in cookie
var createSessionDb = function(userid, callback) {

	var token = jwt.sign({ userid: userid },'SecureKey',{expiresIn: '24h'});
	

	storeSessionDB(userid, token, function(err, res){

		if (err) {
			callback(err, null);
		} else if (res) {
			callback (null, {userid: userid, sessionToken: token});
		} else {
			callback(null, null);
		}
	});
}
//***********************************************************
var updatelogininfoDb = function(loginlocation,userid, callback){
	var q = 'update users set curloginlocation = ? where user_id = ? ';
	var values =[
		loginlocation,
		userid
		]

	db.query(q, values,function(err, data){
		if (err) {
			callback(err, null);
		} else {
			callback(null, data);
		} 
	});
}

//***********************************************************
//kills session when user logs out and update the user status
var killSessionDb = function(userid, callback){
	var q = 'delete from sessions where '
		+ 'user_id = ' + userid ;

	db.query(q, function(err, data){
		if (err) {
			callback(err, null);
		} else {
			var q1 = "update users set status ='suspended' where user_id =" + userid;
			db.query(q1,function(err, data){
				if (err){
					callback(err, null);
				}else {
				console.log("User status is Suspended and session is killed...");
					callback(null,true);
				}
			});
		} 
	});
}
//***********************************************************
//Last login time and location updates
var lastlogintimelocationDb = function(userid, callback){
	var q = 'update users set lastlogintime = curlogintime , lastloginlocation = curloginlocation where user_id ='+userid ;

	db.query(q, function(err, data){
		if (err) {
			console.log(err, null);
		} else {
			console.log(null ,data)
		} 
	});
}

// ***********************************************************
// ***********************************************************
exports.checkuser = function(req, res){
	var email = req.body.email ? req.body.email : null;
	var password = req.body.password ? req.body.password : null;
	
	checkUserDb(email, password , function(err , data){
		if (err){
			res.status(404).send(err);
		}else {
			
			res.status(200).send(data);
		}
	})
	
}
// ***********************************************************
exports.createsession = function(req, res){
	var userid = req.body.userid ? req.body.userid : null;
		
	createSessionDb(userid,function(err , data){
		if (err){
			res.status(404).send(err);
		}else {
			console.log("line 156: session info:",data);
		res.status(200).send({"userid":data.userid,"sessionToken":data.sessionToken});
		}
	});
	
}
// ***********************************************************
exports.updatelogininfo = function(req, res){
	var loginlocation = req.body.loginlocation ? req.body.loginlocation : null;
	var userid = req.body.userid ? req.body.userid : null;
	
	updatelogininfoDb(loginlocation, userid,function(err , data){
		if (err){
			res.status(404).send(err);
		}else {
			res.status(200).send("User Locaiton updated ");
		}
	});

	
}
// ***********************************************************
exports.killsession = function(req, res){
	var userid = req.body.userid ? req.body.userid : null;
	console.log("line 168",userid);
	if (userid === null){
		res.status(404).send("Please provide userid to logout");
		return;
	}
	lastlogintimelocationDb(userid , function(err, data){
		if (err) {
			console.log(err, null);
		} else {
			console.log(null ,"Last login location and time information updated");
		} 
	});
	killSessionDb(userid,function(err , data){
		if (err){
			res.status(404).send(err);
		}else {
			res.status(200).send("User Logout Successfully");
		}
	});
}
