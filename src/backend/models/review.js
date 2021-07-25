const mongoose = require('mongoose');

const reviewSchema = mongoose.Schema({
  hotelId: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    ref: "hotel",
    required: true
  },
  title: {
    type: String,
    required: true
  },
  review: {
    type: String,
    required: true
  },
  creator: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    ref: "User",
    required: true
  },
  reviewDate: {
    type: Date,
    required: true
  }
});

module.exports = mongoose.model('Review', reviewSchema)
