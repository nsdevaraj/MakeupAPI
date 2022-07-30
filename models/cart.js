// The Cart model  
var Product = require('./product.js');
var mongoose = require('mongoose')
   ,Schema = mongoose.Schema
   ,ObjectId = Schema.ObjectId;

var cartSchema = new Schema({
    author: {type : Schema.ObjectId, ref : 'User'}, 
    instanceid: String,
    name: {type:String, required: false},
    date: {type: Date, default: Date.now}, 
    products : [],
    productids : []
});

module.exports = mongoose.model('Cart', cartSchema);