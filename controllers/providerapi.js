var User = require('../models/user.js');
var Product = require('../models/product.js');
var MakeUp = require('../models/makeup.js');
var Provider = require('../models/provider.js');
var Instance = require('../models/instance.js');
var Review = require('../models/review.js');

//Add New User
exports.new= function(req, res) {
	res.render('providers/new.jade');
};

exports.create= function(req, res) {
    var code = new Buffer(req.body.name).toString('base64')
    var provider = new Provider({pname: code,name: req.body.name}); 
   res.send(provider.save());    
};

exports.index = function(req, res) {
  Provider.find(function(err, providers) {
    res.send(providers);
  });
};

exports.update = function(req, res) {
    Provider.findById(req.body.id,function(err, provider) {
      if(provider){
        provider.name = req.body.name;
	res.send(provider.save());    
      } else{
	       res.send({'error': "No record found"}); 
      }	      
  });
}; 

exports.delete = function(req, res) {
  Provider.findById(req.params.id,function(err, provider) {
      if(provider){
	  Instance.remove({providerName: provider._id}, function(err, dbres) {
            console.log('done');
	});  
        provider.remove();	  
	res.send('done');    
      } else{
	       res.send({'error': "No record found"}); 
      }	      
  });
}; 

exports.edit = function(req, res) { 
    Provider.findOne({_id: req.params.id},function(err, provider) {
      if(provider){	    
         res.render('providers/edit.jade', { provider: provider });
       } else{
	  res.send({'error': "No record found"}); 
      }
  });
}; 

exports.allproviders = function(req, res) {
	Provider.find(function(err, providers) {
		res.render('providers/index.jade', { providers: providers });
	});
}; 

exports.shops= function(req, res) {   	
     Provider.findOne({pname: req.params.id}, function(error, provider) {
        var instance = Instance.find({providerName: provider._id}, function(error, instances) { 
          res.send(instances);
        });
    })
};

exports.registerinstance= function(req, res) {   
  Instance.findOne({deviceid: req.params.device, registered: true}, function(error, instance) {
     if(instance){
         res.send(instance);
     }else{	
        Instance.findOne({providerName: req.params.id, registered: false}, function(error, instance) {
            if(instance){
                instance.deviceid = req.params.device;
                instance.registered = true;
                instance.save();	
                res.send(instance);
            }else{
                res.send({'error': "No record found"});
            }
        })
    }
  })
};

exports.providerid = function(req, res) { 
    Provider.findOne({pname: req.params.id},function(err, provider) {
      if(provider){	    
         res.send(provider.id); 
       } else{
	  res.send({'error': "No record found"}); 
      }
  });
}; 