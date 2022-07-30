var User = require('../models/user.js');
var Product = require('../models/product.js');
var MakeUp = require('../models/makeup.js');
var Provider = require('../models/provider.js');
var Instance = require('../models/instance.js');
var Review = require('../models/review.js');
var mongoose = require('mongoose')

exports.index = function(req, res) {
  Product.find(function(err, products) {
    res.send(products);
  });
}; 

exports.reviews = function(req, res) {
  var prodRev;
  Review.findOne({uniqueId: req.params.uniqueid},function(err, review) {
      if(review){	    
         prodRev = review;
       } 
  })
  Product.findOne({productId: req.params.id},function(err, product) {
      if(product){
         Review.find({product: product._id}).populate('author').exec(function(error, reviews) {
		 var avg_rating = 0;  
		 var response ={rating:"",comments:[],selfcomment:Review};
		 reviews.forEach(function(review){
				var reviewdetail = {name:"Anonymous", comment:"", facebookId:"", rating:""};
			 	avg_rating += review.rating;   
                reviewdetail.name=review.author.name;
				reviewdetail.comment=review.comment;
				reviewdetail.facebookId=review.author.userid;
				reviewdetail.rating=review.rating;
				response.comments.push(reviewdetail);
	     });	
         if(prodRev){
            response.selfcomment =prodRev;
         }
		 response.rating = avg_rating/reviews.length;
		 res.send(response); 
	 });
       } else{
	  res.send("No record found"); 
      }
  })
  };
  
  exports.toprated = function(req, res) {
	var mapProd = function() {
	     var productId = this.uniqueId.split('_')[1];
              emit(productId, this.rating);
        };	
	var reduceProd = function(previous, records) { //reduce functio
	     var count = 0;
	     for (index in records) { 
	       count += records[index]; 
	     }
	     return count;
	}; 	
        mongoose.connection.db.executeDbCommand({mapreduce:"reviews", 
            map: mapProd.toString(),
            reduce: reduceProd.toString(),  
            out: "rate_collection"}, function(err, dbres) {
	    mongoose.connection.db.collection('rate_collection', function(err, collection) { 
               collection.find({}).sort({'value': -1}).toArray(function(err, results) {
                  res.send(results);
               });
            });
	}); 
};

exports.mostreviewed = function(req, res) {
	var mapProd = function() {
              emit(this.uniqueId, 1);
        };
	
	var reduceProd = function(previous, records) { //reduce functio
	     var count = 0;
	     for (index in records) { 
	       count += records[index]; 
	     }
	     return count;
	};
	
	
        mongoose.connection.db.executeDbCommand({mapreduce:"reviews", 
            map: mapProd.toString(),
            reduce: reduceProd.toString(),  
            out: "review_collection"}, function(err, dbres) {
	    mongoose.connection.db.collection('review_collection', function(err, collection) { 
               collection.find({}).sort({'value': -1}).toArray(function(err, results) {
                  res.send(results);
               });
            });
	}); 
};

exports.cartproducts = function(req, res) { 
    var mapProd = function() {
       this.products.forEach(function(task, index, array) { 
           emit(task.productId, 1);
       });
    };
    
    var reduceProd = function(previous, records) { //reduce functio
         var count = 0;
         for (index in records) { 
           count += records[index];
         }
         return count;
    };
     
    mongoose.connection.db.executeDbCommand({mapreduce:"carts", 
            map: mapProd.toString(),
            reduce: reduceProd.toString(),  
	    query: {'productids':req.params.id},
            out: "cartcollection"}, function(err, dbres) {
        mongoose.connection.db.collection('cartcollection', function(err, collection) { 
               collection.find({}).sort({'value': -1}).toArray(function(err, results) {
               newarray = [];
               results.forEach(function(task, index, array) { 
                if (task._id != req.params.id){
                  newarray.push(task);
                };  
               });
            
          if (newarray[0] == null){
            res.redirect('/products/toprated');
              }else{res.send(newarray); }
               });
            });
    }); 
};
