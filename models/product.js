// The Post model

var mongoose = require('mongoose')
   ,Schema = mongoose.Schema
   ,ObjectId = Schema.ObjectId;

var productSchema = new Schema({
    productId     : {type:Number, unique: true, required: true, index: true}, 
    prodName        : {type:String, required: false},
    price           : {type:Number, required: false},
    alphaValue      : {type:Number},
    productcount    : {type:Number}
});

module.exports = mongoose.model('Product', productSchema);
