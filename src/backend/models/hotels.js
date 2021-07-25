const mongoose = require("mongoose");

const Schema = mongoose.Schema;
const hotelSchema = new Schema({
	name: {type: String, required: true},
	address: {type: String, required: true},
  latitude: {type: String, required: false,default:null},
  longitude: {type: String, required: false,default:null},
  img: {type: String, required: false,default:null},
  description: {type: String},
  city: {type: String}
});

// hotelSchema.index({hotel_name: 1, city: 1, state: 1}, {unique: true, dropDups: true});

//TODO: IGNORE DUPLICATE
module.exports = mongoose.model("hotel", hotelSchema);
