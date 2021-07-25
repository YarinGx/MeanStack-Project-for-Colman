
const express = require("express");
const passport = require('passport');

const Review = require("../models/review");


const extractFile = require("../lib/file");
const mongoose = require("mongoose");
const User = mongoose.model('User');

const router = express.Router();

router.post("", passport.authenticate('jwt', {session: false}), extractFile, (req, res, next) => {
  User.find({_id:mongoose.Types.ObjectId(req.userId)}).then(us => {
    const review = new Review({
      hotelId: req.body.hotelId,
      title: req.body.title,
      review: req.body.review,
      creator: req.userId,
      reviewDate: new Date().toLocaleString()
    });
    review.save().then(createdComment => {
      res.status(201).json({
        message: "review added successfully",
        post: {
          hotelId: req.body.hotelId,
          title: req.body.title,
          review: req.body.review,
          creator: {_id: req.userId, username: us[0].username},
          reviewDate: new Date().toLocaleString(),
          id: createdComment._id
        }
      });
    })
      .catch(error => {
        res.status(500).json({
          message: "Creating a review failed!"
        });
      });

  })
})


router.put("/:id",passport.authenticate('jwt', {session: false}) , (req, res, next) => {
  const review = new Review({
    _id: req.body.id,
    title: req.body.title,
    review: req.body.review,
    creator: req.userData.userId,
  });
  Comment.updateOne({
    _id: req.params.id,
    creator: req.userData.userId
  }, comment).then(result => {
    if (result.n > 0) {
      res.status(200).json({
        message: "Update successful!"
      });
    } else {
      res.status(401).json({
        message: "Not authorized!"
      });
    }
  })
    .catch(error => {
      res.status(500).json({
        message: "Couldn't update comment!"
      });
    });

});




router.get("", (req, res, next) => {
  Review.find().populate('creator', 'username')
    .then((documents) => {
      res.status(200).json({
        message: "reviews fetched successfully",
        reviews: documents
      });
    }).catch(error => {
    res.status(500).json({
      message: "Fetching reviews failed"
    });
  });
});

router.get("/:id", (req, res, next) => {
  try {
    mongoose.Types.ObjectId(req.params.id)
  } catch (error) {
    res.status(500).json({
          message: "Fetching comment failed"
        });
  }

  Review.find({hotelId : mongoose.Types.ObjectId(req.params.id)}).then(review => {
    if (review) {
      res.status(200).json(review);
    } else {
      res.status(404).json({
        message: "review not found"
      });
    }
  }).catch(error => {
    res.status(500).json({
      message: "Fetching review failed"
    });
  });
})
//
// router.delete("/:id", passport.authenticate('jwt', {session: false}), CommentController.deleteComment);

module.exports = router;