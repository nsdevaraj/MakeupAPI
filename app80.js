var express = require('express');
var routes = require('./routes');
var mongoose = require('mongoose');
var app = module.exports = express();
app.set('views', __dirname + '/views');

mongoose.connect('mongodb://localhost/glitzs');

app.configure(function(){
  app.use(express.json());
  app.use(express.urlencoded());
  app.use(express.methodOverride());
  app.use(express.static(__dirname + '/public'));
  app.use(express.favicon(__dirname + '/public/images/favicon.ico'));
  app.set('showStackError', false);
});

//global exception handler
process.on('uncaughtException', function(err) {
  console.log(err);
});

var api = require('./controllers/api.js');
var reviews = require('./controllers/reviewapi.js');
var products = require('./controllers/productapi.js');
var users = require('./controllers/userapi.js');
var providers = require('./controllers/providerapi.js');
var instances = require('./controllers/instanceapi.js');
var makeups = require('./controllers/makeupapi.js');
var carts = require('./controllers/cartapi.js');

//Carts
app.get('/carts/new', carts.new);
app.get('/carts', carts.index);
app.post('/carts', carts.create);
app.put('/carts/:id', carts.update);
app.del('/carts/:id', carts.delete);
app.get('/carts/:id', carts.show);
app.get('/allcarts', carts.allcarts); //form for delete

//Reviews
app.get('/reviews', reviews.index);
app.get('/reviews/new', reviews.new);
app.get('/reviews/:id', reviews.getByID);
app.post('/reviews', reviews.create);
app.get('/reviews/edit/:id', reviews.edit);
app.del('/reviews/:id', reviews.delete);
app.post('/reviews/:id', reviews.update)
app.get('/allreviews', reviews.allreviews); //form for delete


//Products
app.get('/products/:id/:uniqueid/reviews', products.reviews);
app.get('/products', products.index);
app.get('/products/toprated', products.toprated);
app.get('/products/mostreviewed', products.mostreviewed);
app.get('/products/:id/cartproducts', products.cartproducts);


//Users
app.get('/users/new', users.new);
app.get('/users', users.index);
app.post('/users', users.create);
app.get('/users/edit/:id', users.edit);
app.del('/users/:id', users.delete);
app.put('/users/:id', users.update);
app.get('/users/:id/makeups', users.makeups);
app.get('/users/:id/carts', users.carts);
app.get('/users/:id/shops', users.shops);
app.get('/users/:id/updatephoto', users.updatephoto);
app.get('/allusers', users.allusers); //form for delete

//Providers
app.get('/providers/new', providers.new);
app.get('/providers', providers.index);
app.post('/providers', providers.create);
app.get('/providers/edit/:id', providers.edit);
app.del('/providers/:id', providers.delete);
app.put('/providers/:id', providers.update);
app.get('/providers/:id/shops', providers.shops);
app.get('/providers/:id/registerinstance/:device', providers.registerinstance);
app.get('/providers/:id', providers.providerid);
app.get('/allproviders', providers.allproviders); //form for delete

//Shops
app.get('/instances/new', instances.new);
app.get('/instances', instances.index);
app.post('/instances', instances.create);
app.get('/instances/edit/:id', instances.edit);
app.del('/instances/:id', instances.delete);
app.put('/instances/:id', instances.update);
app.get('/instances/:id/makeups', instances.makeups);
app.get('/instances/:id', instances.show);
app.get('/allinstances', instances.allinstances); //form for delete

//Makeups
app.get('/makeups/new', makeups.new);
app.get('/makeups', makeups.index);
app.post('/makeups', makeups.create);
app.post('/makeups/:id', makeups.update);
app.del('/makeups/:id', makeups.delete);
app.get('/makeups/missingphoto/:id', makeups.missingphoto);
app.get('/makeups/edit/:id', makeups.edit);
app.get('/makeups/:id', makeups.show);
app.get('/allmakeups', makeups.allmakeups); //form for delete
app.get('/topproducts', makeups.topproducts);

//general functions
app.post('/activmakeups', api.activmakeups);
app.post('/fbuploads', api.fbuploads);
app.get('/emptydb', api.emptydb);
app.get('/getXML/:uuid', api.getXML);
app.get('/getIMG/:uuid', api.getIMG);

//Edit
app.get('/', routes.index);
app.listen(80);
console.log("Express server listening on port %d", 80);
