var mongoose = require('mongoose')
   ,Schema = mongoose.Schema
   ,ObjectId = Schema.ObjectId;

var reviewSchema = new Schema({
 author: {type : Schema.ObjectId, ref : 'User'}, 
 product: {type: Schema.ObjectId, ref: 'Product'}, 
 uniqueId     : {type:String, unique:true, required: true, index: true}, 
 rating     : Number, 
 comment     : String, 
 date: {type: Date, default: Date.now}
});
module.exports = mongoose.model('Review', reviewSchema);