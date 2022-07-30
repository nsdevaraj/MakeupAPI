var User = require('../models/user.js');
var Product = require('../models/product.js');
var MakeUp = require('../models/makeup.js');
var Provider = require('../models/provider.js');
var Instance = require('../models/instance.js');
var Review = require('../models/review.js');

//Add New User
exports.new= function(req, res) {
	res.render('instances/new.jade');
};

exports.create= function(req, res) {
    Provider.findOne({pname: req.body.providerName}, function(error, provider) { 
    var count = parseInt(req.body.counts);
    for(var i = 0; i < count; i++){
        var instance = new Instance({sname: provider.name+'_'+req.body.sname+'_'+i, providerName: provider._id,registered:false})
        var t = instance.save(); 
    }
    res.send("done");    
   });
    
};

exports.index = function(req, res) {
  Instance.find(function(err, instances) {
    res.send(instances);
  });
};

exports.update = function(req, res) {
    Instance.findById(req.params.id,function(err, instance) {
      if(instance){
        instance.registered= true;
	res.send(instance.save());    
      } else{
	       res.send({'error': "No record found"}); 
      }	      
  });
}; 

exports.delete = function(req, res) {
  Instance.findById(req.params.id,function(err, instance) {
      if(instance){
        instance.remove();	  
	res.send('done');    
      } else{
	       res.send({'error': "No record found"}); 
      }	      
  });
}; 

exports.edit = function(req, res) { 
    Instance.findOne({sname: req.params.id},function(err, instance) {
      if(instance){	    
         res.render('instances/edit.jade', { instance: instance });
       } else{
	  res.send({'error': "No record found"}); 
      }
  });
}; 

exports.allinstances = function(req, res) {
	Instance.find(function(err, instances) {
		res.render('instances/index.jade', { instances: instances });
	});
}; 

exports.makeups = function(req, res) {
   Instance.findOne({sname: req.params.id}, function(error, instance) {
        var makeups = MakeUp.find({instanceid: instance.sname}, function(error, makeups) { 
          res.send(makeups);
        });
    })
};

exports.show = function(req, res) {
  Instance.findOne({sname: req.params.id},function(err, record) {
    res.send(record);
  });  
};