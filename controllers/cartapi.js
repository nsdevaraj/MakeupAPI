var User = require('../models/user.js');
var Product = require('../models/product.js');
var Cart = require('../models/cart.js');
var Provider = require('../models/provider.js');
var Instance = require('../models/instance.js');
var Review = require('../models/review.js');

//Add New Cart
exports.new= function(req, res) {
	res.render('carts/new.jade');
};

exports.create= function(req, res) {
    User.findOne({userid: req.body.muserid}, function(error, finduser) { 
        var cart = new Cart({name: req.body.name, instanceid:req.body.instanceid, author: finduser._id}); 
       
	 	if (Object.prototype.toString.call( req.body.prodId ) === '[object Array]'){
            for(var i = 0; i < req.body.prodId.length; i++){
          	  var prod =  new Product({productId:"",prodName:"",productcount:"",price:""});
          	  prod.productId = req.body.prodId[i];
	   	 	  prod.prodName = req.body.prodName[i];
	   	 	  prod.productcount = req.body.quantity[i];
	   	 	  prod.price = req.body.price[i];
              prod.save();
		  cart.productids.push(req.body.prodId[i]);
          	  cart.products[i] = prod;
      	     }
	 	} else{
	     var prod =  new Product({productId:req.body.prodId, prodName:req.body.prodName, productcount:req.body.quantity, price:req.body.price});
         prod.save();
	      cart.productids.push(req.body.prodId);
	     cart.products = prod;
	 	}
        cart.save(function() {
          res.send(cart); 
        });              
    })
};

exports.update = function(req, res) {
    Cart.findById(req.body.id,function(err, cart) {
      if(cart){
        cart.name = req.body.name;
        cart.instanceid = req.body.instanceid; 
       if (Object.prototype.toString.call( req.body.prodId ) === '[object Array]'){
            for(var i = 0; i < req.body.prodId.length; i++){
          	  var prod =  new Product({productId:"",prodName:"",productcount:"",price:""});
          	  prod.productId = req.body.prodId[i];
	   	 	  prod.prodName = req.body.prodName[i];
	   	 	  prod.productcount = req.body.quantity[i];
	   	 	  prod.price = req.body.price[i];
              prod.save(); 
		  cart.productids.push(req.body.prodId[i]);
          	  cart.products[i] = prod;
      	     }
	 	} else{
	     var prod =  new Product({productId:req.body.prodId, prodName:req.body.prodName, productcount:req.body.quantity, price:req.body.price});	     
         prod.save();
	     cart.productids.push(req.body.prodId);
	     cart.products = prod;
	 	}
        cart.save(function() {
          res.send(cart); 
        });  
    } else{
	       res.send({'error': "No record found"}); 
      }	      
  });
}; 

exports.index = function(req, res) {
  Cart.find(function(err, carts) {
    res.send(carts);
  });
};

exports.show = function(req, res) {
  Cart.findById(req.params.id,function(err, record) {
    res.send(record);
  });  
};

exports.delete = function(req, res) {
  Cart.findById(req.params.id,function(err, cart) {
      if(cart){
        cart.remove();	  
	res.send('done');    
      } else{
	       res.send({'error': "No record found"}); 
      }	      
  });
}; 

exports.allcarts = function(req, res) {
	Cart.find(function(err, carts) {
		res.render('carts/index.jade', { carts: carts });
	});
}; 


