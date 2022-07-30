var User = require('../models/user.js');
var Cart = require ('../models/cart.js')
var Product = require('../models/product.js');
var MakeUp = require('../models/makeup.js');
var Provider = require('../models/provider.js');
var Instance = require('../models/instance.js');
var Review = require('../models/review.js');

//Add New User
exports.new= function(req, res) {
	res.render('users/new.jade');
};

exports.create= function(req, res) {
  User.findOne({userid: req.body.userid},function(err, founduser) {
     if(founduser){
      res.send(founduser); 
     }else{
        var user = new User({name: req.body.name, userid: req.body.userid});
        res.send(user.save());    
     }
  });
};

exports.index = function(req, res) {
  User.find(function(err, users) {
    res.send(users);
  });
};

exports.update = function(req, res) {
    User.findById(req.body.id,function(err, user) {
      if(user){
        user.name = req.body.name;
        user.userid = req.body.userid; 
	res.send(user.save());    
      } else{
	       res.send({'error': "No record found"}); 
      }	      
  });
}; 

exports.delete = function(req, res) {
  User.findById(req.params.id,function(err, user) {
      if(user){
	 MakeUp.remove({author: user._id}, function(err, dbres) {
            console.log('done');
	});       
        user.remove();	  
        res.send("done");    
      } else{
	       res.send({'error': "No record found"}); 
      }	      
  });
}; 

exports.edit = function(req, res) { 
    User.findOne({userid: req.params.id},function(err, user) {
      if(user){	    
         res.render('users/edit.jade', { user: user });
       } else{
	  res.send({'error': "No record found"}); 
      }
  });
}; 

exports.allusers = function(req, res) {
	User.find(function(err, users) {
		console.log(users);
		res.render('users/index.jade', { users: users });
	});
}; 

exports.makeups = function(req, res) {
   User.findOne({userid: req.params.id}, function(error, user) {
        var makeups = MakeUp.find({author: user._id}, function(error, makeups) { 
          res.send(makeups);
        }).limit(5);
    })
};

exports.carts = function(req, res) {
   User.findOne({userid: req.params.id}, function(error, user) {
        var carts = Cart.find({author: user._id}, function(error, carts ) { 
          res.send(carts );
        });
    })
};

exports.shops = function(req, res) {
   User.findOne({userid: req.params.id}, function(error, user) {
        var  u = {}, a = [];
        var makeups = MakeUp.find({author: user._id}, function(error, makeups) { 
            makeups.forEach(function(elem, index, array) {
                 if(!u.hasOwnProperty(elem.instanceid)) { 
                    a.push(elem.instanceid);                    
                    u[elem.instanceid] = 1; 
                  }                  
            });
            res.send(a);
        });
    })
};

exports.updatephoto = function(req, res) {
   User.findOne({userid: req.params.id}, function(error, user) {
       var newuser = User.update({userid: req.params.id}, { photocount: user.photocount+1}, function(err){
            if(err){
                console.log("some error happened when update")
                res.send({'ERROR': "error happened when update"});  
            }else{
                res.send(newuser);
            }
        });
    })
};
