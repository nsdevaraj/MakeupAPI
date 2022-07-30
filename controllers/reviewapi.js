var User = require('../models/user.js');
var Product = require('../models/product.js');
var MakeUp = require('../models/makeup.js');
var Provider = require('../models/provider.js');
var Instance = require('../models/instance.js');
var Review = require('../models/review.js');

exports.index = function(req, res) {
	Review.find(function(err, review) {
		res.send(review);
	});
}; 

exports.allreviews = function(req, res) {
	Review.find(function(err, reviews) {
		res.render('reviews/index.jade', { reviews: reviews });
	});
}; 

exports.new= function(req, res) {
     res.render('reviews/new.jade');
};

exports.create= function(req, res) {
    User.findOne({userid: req.body.userid}, function(error, finduser) { 
	Product.findOne({productId:req.body.productid}, function(error, findproduct) { 
	var prod;
	if(findproduct){
		prod = findproduct;
	}else{
        prod = new Product({productId:req.body.productid,alphaValue:0})
		prod.save();
	}    	
	var review = new Review({rating:req.body.rating, comment:req.body.comment, uniqueId:(req.body.userid +'_'+req.body.productid),author: finduser._id,product:prod._id}); 
    	res.send(review.save()); 
	})
    })
};

exports.getByID = function(req, res) {
     Review.findOne({uniqueId: req.params.id},function(err, review) {
      if(review){	    
         res.send(review);
       } else{
	  res.send("No record found"); 
      }
  });

}

exports.update = function(req, res) {
     Review.findOne({uniqueId: req.params.id},function(err, review) {
      if(review){
        review.rating = req.body.rating;
        review.comment = req.body.comment;
        res.send(review.save());    
      } else{
	       res.send("No record found"); 
      }	      
  });
}; 

exports.delete = function(req, res) {
  Review.findById(req.params.id,function(err, review) {
      if(review){
        review.remove();	  
        res.send('done');    
      } else{
	       res.send("No record found"); 
      }	      
  });
}; 

exports.edit = function(req, res) { 
    Review.findOne({_id: req.params.id},function(err, review) {
      if(review){	    
         res.render('reviews/edit.jade', { review: review });
       } else{
	  res.send("No record found"); 
      }
  });
}; 
