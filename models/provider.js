// The Makeup model  
var mongoose = require('mongoose')
   ,Schema = mongoose.Schema
   ,ObjectId = Schema.ObjectId;

var providerSchema = new Schema({
    pname:{type:String, unique: true, index: true},
    name: String
});

module.exports = mongoose.model('Provider', providerSchema);
