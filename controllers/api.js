var tty = require('tty');
var child_process = require('child_process');
var path = require('path');
var querystring = require("querystring"),
    fs = require("fs"),
    utils =require("util");
var execute = require('child_process').exec,
    child
var User = require('../models/user.js');
var Product = require('../models/product.js');
var MakeUp = require('../models/makeup.js');
var Provider = require('../models/provider.js');
var Instance = require('../models/instance.js');
var Review = require('../models/review.js');
var Cart = require('../models/cart.js');

exports.activmakeups = function(req, res) {
    var userids="";
     User.find({'userid' : { $in : req.body.userids.split(',') }}, function(error, users) {
        users.forEach(function(user, index, array) {
            if(index < array.length-1){
                userids += user._id+",";
            }else{
                userids += user._id;
            }
        })
        makeups(userids,res);
     })
}

function makeups(userids,res) {
    MakeUp.find({'author' : { $in :userids.split(',') }}, function(err, makeups) {
        res.send(makeups);
    }).limit(10);
}

//remove all entries
exports.emptydb = function(req, res) {
  MakeUp.find(function(err, records) {
    res.send(records);
  }).remove();

  Cart.find(function(err, records) {
    res.send(records);
  }).remove();

  User.find(function(err, records) {
    res.send(records);
  }).remove();

  Provider.find(function(err, records) {
    res.send(records);
  }).remove();

  Product.find(function(err, records) {
    res.send(records);
  }).remove();

  Instance.find(function(err, records) {
    res.send(records);
  }).remove();

  Review.find(function(err, records) {
    res.send(records);
  }).remove();
};

// display XML
exports.getXML = function(req, res){
   var xmlname=req.params.uuid+'.xml';
   fs.readFile(xmlname, "binary", function(error, xmlfile) {
      res.writeHead(200, {"Content-Type": "text/plain"});
      res.write(xmlfile, "binary");
      res.end();
  });
};

//display IMG
exports.getIMG = function(req, res){
  var imgname = req.params.uuid+'.jpg';
  fs.readFile(imgname, "binary", function(error, imgfile) {
      res.writeHead(200, {"Content-Type": "image/jpg"});
      res.write(imgfile, "binary");
      res.end();
  });
};

//Edit
exports.edit = function(req, res) {
  res.render('edit.jade');
};

//upload fb photo
exports.fbuploads= function(req,res){
    var uniqueid = utils.inspect(req.body.name);
    uniqueid = uniqueid.replace("\'","");
    uniqueid = uniqueid.replace("\'","");
    User.findOne({userid: uniqueid}, function(error, user) {
    var newuser = User.update({userid: uniqueid}, { photocount: user.photocount+1}, function(err){
       if(err){
           console.log("some error happened when update")
           res.send({'ERROR': "error happened when update"});
        }else{
        uniqueid = uniqueid + '_'+user.photocount;
        var imagefile = uniqueid+".jpg";
        var imagetxtfile = uniqueid+".xml";
        child = execute('wget -O '+imagefile+' '+req.body.fbsrc+' --no-check-certificate', function (error, stdout, stderr) {
            if (error == null) {
            	child = execute('stasm4.1.0/minimal '+imagefile+' '+imagetxtfile+' '+uniqueid+' '+req.body.fbsrc, function (error, stdout, stderr) {

            			var filePath = path.join(process.cwd(), uniqueid+'.xml');
                        var stat = fs.statSync(filePath);
                        res.writeHead(200, {
                            'Content-Type': 'text/plain',
                            'Content-Length': stat.size});
                        var readStream = fs.createReadStream(filePath);
                        readStream.on('data', function(data) {
                            res.write(data);
                        });
                        readStream.on('end', function() {
                            child = execute('rm '+imagefile, function (error, stdout, stderr) {
                                if (error !== null) {
                                    console.log('exec error: ' + error);
                                }else{
                                    res.end();
                                }
                            });
                        });

            	});
            } else{
              MakeUp.remove({photoid: uniqueid}, function(err, record) {
                    console.log('done');
	          });
              res.send({'ERROR': "URL not found"});
	        }
        });
      }
    });
  })
};
