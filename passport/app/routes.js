// app/routes.js
var User            = require('../app/models/user');
var TCMailer=require('../config/TCMailer');
var TCAddresses=require('../config/TCMailer').addresses;

module.exports = function(app, passport) {

    // =====================================
    // HOME PAGE (with login links) ========
    // =====================================
    app.get('/', function(req, res) {
        res.render('index.ejs'); // load the index.ejs file
    });

    // =====================================
    // LOGIN ===============================
    // =====================================
    // show the login form
    app.get('/login', function(req, res) {

        // render the page and pass in any flash data if it exists
        res.render('login.ejs', { message: req.flash('loginMessage'), email:"" }); 
    });

    // process the login form
      app.post('/login', passport.authenticate('local-login', {
        successRedirect : '/profile', // redirect to the secure profile section
        failureRedirect : '/login', // redirect back to the signup page if there is an error
        failureFlash : true // allow flash messages
    }));
    // =====================================
    // SIGNUP ==============================
    // =====================================
    // show the signup form
    app.get('/signup', function(req, res) {

        // render the page and pass in any flash data if it exists
        res.render('signup.ejs', { message: req.flash('signupMessage') });
    });
    
    		// process the signup form	
    app.post('/signup', passport.authenticate('local-signup', {
			successRedirect : '/profile', // redirect to the secure profile section
			failureRedirect : '/signup', // redirect back to the signup page if there is an error
			failureFlash : true // allow flash messages
		}));

    // =====================================
    // AUTHENTICATE ACCOUNT ===============
    // =====================================
	// called from /profile, if this user is not authenticated
	 app.get('/sendauthenticate', function(req, res) {
		authenticateUser (req.user.local.email, req.user);
        // render the page and pass in any flash data if it exists
        res.render('authenticate.ejs', {user: req.user, context: req.query.context} );
    });
	app.get('/authenticateTC', function(req, res) {
		 // find the user with this hash; check datestamp; authenticate and save
        User.findOne({ 'local.hash' :  req.query.hash }, function(err, user) {
 			if (user) {
 				//check the time stamp. If more than one hour ago, ask for redo
				var timeNow= new Date().getTime();
				var diff=timeNow-user.local.timestamp;
				if (diff>60*60*1000) res.render('forgothourpassed.ejs', {greeting: 'Authentication link expired', greeting2: 'For security, links to authenticate accounts expire after one hour. Try logging in again to have a new authentication link sent.', authenticate:"1"});
				else {
					req.user.local.authenticated= "1";
					req.user.local.hash= "";
					req.user.save();
					res.redirect('/profile');
				}
 			} else {
				res.render('forgothourpassed.ejs', {greeting: 'No user to be authenticated found for that link', greeting2: 'You are likely using an old authentication link. Try logging in again to have a new authentication link sent.', authenticate:"1"});
			}
 		});
     });
    // =====================================
    // FORGOT PASSWORD ==============================
    // =====================================
    // show the forgot password form
    app.get('/forgot', function(req, res) {
        // render the page and pass in any flash data if it exists
        res.render('forgot.ejs', { message: req.flash('forgotMessage') });
    });
    
    app.get('/resetpw', function(req, res) {
        // find the user with this hash; check datestamp; get a new password
        User.findOne({ 'local.hash' :  req.query.hash }, function(err, user) {
        	if (user) {
        	//check the time stamp. If more than one hour ago, ask for redo
				var timeNow= new Date().getTime();
				var diff=timeNow-user.local.timestamp;
				if (diff>60*60*1000) res.render('forgothourpassed.ejs', {greeting: 'Reset password link expired', greeting2: 'For security, links to reset passwords expire after one hour.', authenticate:"0"});
				else res.render('resetpw.ejs', { message: req.flash('resetMessage'), name: user.local.name, email: user.local.email});
			} else {
				res.render('forgothourpassed.ejs', {greeting: 'No request found for that link', greeting2: 'You are likely using an old reset password link.', authenticate:"0"});
			}
        });
    });
    
     app.post('/resetpw',  function(req, res) {
 //    	console.log("resetting password for " +req.body.password+" pwd2 "+req.body.passwordconfirm+" email "+req.body.email+" name "+req.body.displayName);
        if (req.body.password!=req.body.passwordconfirm) {
        	 res.render('resetpw.ejs', {message: "Password and confirm password do not match", name: req.body.displayName, email: req.body.email});
        } else {
 //       	console.log("Match!")
        	 User.findOne({ 'local.email' :  req.body.email }, function(err, user) {
        	 	if (user) {
        	 		user.local.password = user.generateHash(req.body.password);
        	 		user.local.hash="";
        	 		user.save();
        	 		res.render('login.ejs', { message: 'You can now log in with your new password', email: req.body.email });
        	 	} //can't be here if there is no user!
        	 });
        }
    });

   

    // process the forgot password form
     app.post('/forgot', passport.authenticate('local-forgot', {
        successRedirect : '/resetpwmsg', // redirect to the secure profile section
        failureRedirect : '/forgot', // redirect back to the signup page if there is an error
        failureFlash : true // allow flash messages
    }));
    
      app.get('/resetpwmsg', function(req, res) {
        // render the page and pass in any flash data if it exists
        res.render('resetpwmsg.ejs');
    });

    // =====================================
    // PROFILE SECTION =====================
    // =====================================
    // we will want this protected so you have to be logged in to visit
    // we will use route middleware to verify this (the isLoggedIn function)
    app.get('/profile', isLoggedIn, function(req, res) {
        res.render('profile.ejs', {
            user : req.user, // get the user out of session and pass to template
            context: req.query.context
        });
    });
   // =====================================
    // FACEBOOK ROUTES =====================
    // =====================================
    // route for facebook authentication and login
    app.get('/auth/facebook', passport.authenticate('facebook', { scope : 'email' }));

    // handle the callback after facebook has authenticated the user
    app.get('/auth/facebook/callback',
        passport.authenticate('facebook', {
        	scope : 'email',
            failureRedirect : '/'
        }), function(req, res) {
    // The user has authenticated with Facebook.  Now check to see if the profile
    // is "complete".  If not, send them down a form to fill out more details.
		 if (isValidProfile(req, res)) {
			  res.redirect('/profile');
			} else {
			  res.redirect('/facebookemail');
			}
	 }); 
	app.get('/facebookemail', function(req, res) {
		//can only be here because facebook has registered user, but as yet not associated with any main email
		//so check: if our facebook email does not belong to an existing user, then just write primary fb email to local email
		// and pass on to profile, to carry out authentication
		console.log("who I am in facebook: "+req.user);
		 User.findOne({ 'local.email' :  req.user.facebook.email }, function(err, user) {
		 	if (!user) {
		 		req.user.local.email=req.user.facebook.email;
		 		req.user.local.name=req.user.facebook.name;
		 		req.user.local.password=req.user.generateHash("X"); //place holder
        		req.user.local.authenticated= "0";
        		req.user.save();
        		res.redirect('/profile?context=facebook');
		 	} else {
		 		//by facebook rules -- this email can ONLY be assoc with one account.  So just link them
		 		//if there is no facebook account associated with the account -- just link this facebook ac to that
		 		if (user.facebook.token==undefined) {
		 			user.facebook=req.user.facebook;
		 			user.save();
		 			res.redirect('/profile?context=facebook');
		 		}  
		 		else res.render('error.ejs', { message: "Error linking Facebook account", name:req.user.facebook.name, email: req.user.facebook.email }); //should not happen! if there is a fb for this user we should be in it now
		 	}
		 });
    });

 	// =====================================
    // TWITTER ROUTES ======================
    // =====================================
    // route for twitter authentication and login
    app.get('/auth/twitter', passport.authenticate('twitter'));

    // handle the callback after twitter has authenticated the user
    app.get('/auth/twitter/callback',
        passport.authenticate('twitter', {
            failureRedirect : '/'
        }), function(req, res) {
    // The user has authenticated with Twitter.  Now check to see if the profile
    // is "complete".  If not, send them down a form to fill out more details.
		 if (isValidProfile(req, res)) {
			  res.redirect('/profile');
			} else {
			  res.redirect('/twitteremail');
			}
	 }); 

	 //we don't have a twitter email! get one 
	app.get('/twitteremail', function(req, res) {
        // render the page and pass in any flash data if it exists
        res.render('twitteremail.ejs', { message: req.flash('twitterMessage'), name:req.user.twitter.displayName });
    });
    app.get('/twittercancel', function(req, res) {
       //logout, delete the user
 //      console.log("who I am in delete: "+req.user);
       var twitterid=req.user.twitter.id;
    	req.logout();
    	User.findOne({'twitter.id': twitterid}, function(err, deleteUser) {
    		deleteUser.remove({});
    	});
        res.redirect('/');
    });
    app.post('/twitteremail', function(req, res) {
        // render the page and pass in any flash data if it exists
//        	console.log("who I am: "+req.user);
        	if (req.body.email!=req.body.emailconfirm) {
        		res.render('twitteremail.ejs', { message: "Email '"+req.body.email+"' and confirm email '"+req.body.emailconfirm+"' do not match. Try again", name:req.user.twitter.displayName});
        		return;
        	}
        	var mailformat = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;  
        	if (!req.body.email.match(mailformat)) {
        		res.render('twitteremail.ejs', { message: "'"+req.body.email+"' is not a valid email. Try again", name:req.user.twitter.displayName});
        		return;
        	}
        	//ok! we have a valid email.  Write it into the local account, with the display name, and send an activation email
        	//does this email already exist for an account? if so, and there is no twitter account for this user -- just link!
        
        	User.findOne({'local.email': req.body.email}, function(err, existingUser) {
        		 if (existingUser) {
        		 	//if there is no twitter person reg'd with this local email -- just write the details there!
        		 	if (existingUser.twitter.token==undefined) {
        		 		console.log("who I am twittering: "+req.user);
        		 		console.log("who I am already: "+existingUser);
        		 		existingUser.twitter=req.user.twitter;
        		 		existingUser.save();
        		 		
        		 		User.findOne({'twitter.id': req.user.twitter.id}, function(err, deleteUser) {
    						deleteUser.remove({});
    					});
    					//log out current user; log in existingUser
    					req.logout();
    					req.logIn(existingUser, function (err) {
               				 if(!err){
               				     res.redirect('/profile');
               				 }else{
								//handle error
							}
						})
    	 		 		return;
        		 	}
        		 	else {
        		 		res.render('twitteremail.ejs', { message: "There is already a Textual Communities user identified by the email '"+req.body.email+"'. If you want to link this twitter account to that account, log in with that email address and then link the twitter account.", name:req.user.twitter.displayName});
        				return;
        			}
        		 }
        		 //there isn't one! so, just set the local email and display name to the values here
        		 req.user.local.email=req.body.email;
        		 req.user.local.name=req.user.twitter.displayName;
        		 req.user.local.password=req.user.generateHash("X"); //place holder
        		 req.user.local.authenticated= "0";
        		 req.user.save();
        		 res.redirect('/profile?context=twitter');
        	});
    });

	// =====================================


	    // GOOGLE ROUTES =======================
    // =====================================
    // send to google to do the authentication
    // profile gets us their basic information including their name
    // email gets their emails
    app.get('/auth/google', passport.authenticate('google', { scope : ['profile', 'email'] }));

    // the callback after google has authenticated the user
    app.get('/auth/google/callback',
            passport.authenticate('google', {
                    successRedirect : '/profile',
                    failureRedirect : '/'
     }));

// =============================================================================
// AUTHORIZE (ALREADY LOGGED IN / CONNECTING OTHER SOCIAL ACCOUNT) =============
// =============================================================================

    // locally --------------------------------
        app.get('/connect/local', function(req, res) {
            res.render('connect-local.ejs', { message: req.flash('loginMessage') });
        });
        app.post('/connect/local', passport.authenticate('local-signup', {
            successRedirect : '/profile', // redirect to the secure profile section
            failureRedirect : '/connect/local', // redirect back to the signup page if there is an error
            failureFlash : true // allow flash messages
        }));

    // facebook -------------------------------

        // send to facebook to do the authentication
        app.get('/connect/facebook', passport.authorize('facebook', { scope : 'email' }));

        // handle the callback after facebook has authorized the user
        app.get('/connect/facebook/callback',
            passport.authorize('facebook', {
                successRedirect : '/profile',
                failureRedirect : '/'
            }));

    // twitter --------------------------------

        // send to twitter to do the authentication
        app.get('/connect/twitter', passport.authorize('twitter', { scope : 'email' }));

        // handle the callback after twitter has authorized the user
        app.get('/connect/twitter/callback',
            passport.authorize('twitter', {
                successRedirect : '/profile',
                failureRedirect : '/'
            }));


    // google ---------------------------------

        // send to google to do the authentication
        app.get('/connect/google', passport.authorize('google', { scope : ['profile', 'email'] }));

        // the callback after google has authorized the user
        app.get('/connect/google/callback',
            passport.authorize('google', {
                successRedirect : '/profile',
                failureRedirect : '/'
            }));
            
    // =============================================================================
// UNLINK ACCOUNTS =============================================================
// =============================================================================
// used to unlink accounts. for social accounts, just remove the token
// for local account, remove email and password
// user account will stay active in case they want to reconnect in the future

    // local -----------------------------------
    app.get('/unlink/local', function(req, res) {
        var user            = req.user;
        user.local.email    = undefined;
        user.local.password = undefined;
        user.save(function(err) {
            res.redirect('/profile');
        });
    });

    // facebook -------------------------------
    app.get('/unlink/facebook', function(req, res) {
        var user            = req.user;
        user.facebook.token = undefined;
        user.save(function(err) {
            res.redirect('/profile');
        });
    });

    // twitter --------------------------------
    app.get('/unlink/twitter', function(req, res) {
        var user           = req.user;
        user.twitter.token = undefined;
        user.save(function(err) {
           res.redirect('/profile');
        });
    });

    // google ---------------------------------
    app.get('/unlink/google', function(req, res) {
        var user          = req.user;
        user.google.token = undefined;
        user.save(function(err) {
           res.redirect('/profile');
        });
    });
    
    // =====================================
    // LOGOUT ==============================
    // =====================================
    app.get('/logout', function(req, res) {
        req.logout();
        res.redirect('/');
    });
};

// route middleware to make sure a user is logged in
function isLoggedIn(req, res, next) {

    // if user is authenticated in the session, carry on 
    if (req.isAuthenticated())
        return next();

    // if they aren't redirect them to the home page
    res.redirect('/');
}


// route middleware to make sure our user has a primary email, for Twitter etc
//also check here for fb, google?: is this new account linked to a user when it is already linked to another local user?
//or do that later
function isValidProfile(req, res, next) {
	console.log("who I am in authenticate: "+req.user);
	if (Object.keys(req.user.local).length==0 || typeof req.user.local.email === "undefined") return false;
	return true;
}

var crypto = require('crypto');
var base64url = require('base64url');

/** Sync */
function randomStringAsBase64Url(size) {
  return base64url(crypto.randomBytes(size));
}

function authenticateUser (email, user) {
	console.log("to "+email+" dir "+__dirname);
	var ejs = require('ejs'), fs = require('fs'), str = fs.readFileSync(__dirname + '/../views/authenticatemail.ejs', 'utf8'); 
  	var hash=randomStringAsBase64Url(20);
  	var rendered = ejs.render(str, {email:email, hash:hash, username:user.local.name, url: nodeJSurl});
  	console.log( TCAddresses.replyto+" "+TCAddresses.from);
  	user.local.timestamp=new Date().getTime();
  	user.local.hash=hash;
  	user.save();
	TCMailer.nodemailerMailgun.sendMail({
	  from: TCAddresses.from,
	  to: email, 
	  subject: 'Authenticate your Textual Communities account',
	  'h:Reply-To': TCAddresses.replyto,
	  html: rendered,
	  text: rendered.replace(/<[^>]*>/g, '')
	}, function (err, info) {
	 if (err) {console.log('Error: ' + err);}
	});
}