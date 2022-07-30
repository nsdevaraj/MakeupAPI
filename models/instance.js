// The Makeup model  
var mongoose = require('mongoose')
   ,Schema = mongoose.Schema
   ,ObjectId = Schema.ObjectId;

var intanceSchema = new Schema({
    providerName: {type : Schema.ObjectId, ref : 'Provider'},
    sname : {type:String, unique: true, required: true, index: true},
    deviceid : {type:String},
    registered : {type:Boolean, "default":false}
});

module.exports = mongoose.model('Instance', intanceSchema);
