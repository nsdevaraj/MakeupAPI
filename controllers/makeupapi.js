var User = require('../models/user.js');
var Product = require('../models/product.js');
var MakeUp = require('../models/makeup.js');
var Provider = require('../models/provider.js');
var Instance = require('../models/instance.js');
var Review = require('../models/review.js');
var mongoose = require('mongoose')

//Add New User
exports.new= function(req, res) {
	res.render('makeups/new.jade');
};

exports.create= function(req, res) {
    User.findOne({userid: req.body.muserid}, function(error, finduser) { 
        var makeup = new MakeUp({name: req.body.name, instanceid:req.body.instanceid, photoid:req.body.photoid, author: finduser._id}); 
        if (Object.prototype.toString.call( req.body.productid ) === '[object Array]'){ 
		    for(var i = 0; i < req.body.productid.length; i++){
           		var prod = new Product({productId:"0", alphaValue:"1"}); 
           		prod.productId = req.body.productid[i];
           		prod.alphaValue = req.body.productalpha[i];
           		prod.save();
           		makeup.products[i] = prod;
        	}
	 	} else { 
     		var prod = new Product({productId:req.body.productid, alphaValue:req.body.productalpha});
     		prod.save();
			makeup.products = prod;
		}
        makeup.save(function() {
          res.send(makeup); 
        });              
    })
};

exports.update = function(req, res) {
    MakeUp.findById(req.params.id,function(err, makeup) {
      if(makeup){
        while (makeup.products.length != 0){
            makeup.products.shift();
        }
        if (Object.prototype.toString.call( req.body.productid ) === '[object Array]'){ 
            for(var i = 0; i < req.body.productid.length; i++){
                   var prod = new Product({productId:"0", alphaValue:"1"}); 
                   prod.productId = req.body.productid[i];
                   prod.alphaValue = req.body.productalpha[i];
                   prod.save();
                   makeup.products[i] = prod;
            }
         }else{ 
             var prod = new Product({productId:req.body.productid, alphaValue:req.body.productalpha});
             prod.save();
            makeup.products = prod;
        }
        makeup.update({products: makeup.products}, function(err) {
          res.send(makeup); 
        });  
      } else{
           res.send({'error': "No record found"}); 
      }          
  });
};

exports.index = function(req, res) {
  MakeUp.find(function(err, makeups) {
    res.send(makeups);
  });
};

exports.show = function(req, res) {	
    MakeUp.findById(req.params.id,function(err, makeup) {
      if(makeup){
		res.send(makeup);    
      } else{
	       res.send({'error': "No record found"}); 
      }	      
  });
};

exports.edit = function(req, res) { 
    MakeUp.findOne({_id: req.params.id},function(err, makeup) {
      if(makeup){	    
         res.render('makeups/edit.jade', { makeup: makeup });
       } else{
	  res.send("No record found"); 
      }
  });
};
 
exports.missingphoto = function(req, res) {
 MakeUp.remove({photoid: req.params.id}, function(err, record) {
    res.send('done');  
 });  
};              

exports.delete = function(req, res) {
  MakeUp.findById(req.params.id,function(err, makeup) {
      if(makeup){
        makeup.remove();	  
	res.send('done');    
      } else{
	       res.send({'error': "No record found"}); 
      }	      
  });
}; 

exports.allmakeups = function(req, res) {
	MakeUp.find(function(err, makeups) {
		res.render('makeups/index.jade', { makeups: makeups });
	});
}; 

exports.topproducts = function(req, res) {
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
        mongoose.connection.db.executeDbCommand({mapreduce:"makeups", 
            map: mapProd.toString(),
            reduce: reduceProd.toString(),  
            out: "prod_collection"}, function(err, dbres) {
	    mongoose.connection.db.collection('prod_collection', function(err, collection) { 
               collection.find({}).sort({'value': -1}).toArray(function(err, results) {
                  res.send(results);
               });
            });
	}); 
};





