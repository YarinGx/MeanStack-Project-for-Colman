
const express = require("express");
const passport = require('passport');

const Review = require("../models/review");


const extractFile = require("../lib/file");
const mongoose = require("mongoose");
const {emit} = require("cluster");
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

  // Review.find().populate('creator', 'username').then(revArr => {
  //   revArr.forEach(rev => {
  //     if(rev.creator.id!==req.userId){
  //       res.status(401).json({
  //         message: "unauthorized"
  //       });
  //     }
  //   })
  // })
  const review = new Review({
    _id: req.body.id,
    title: req.body.title,
    review: req.body.review,
    creator: req.userId,
  });
  Review.updateOne({
    _id: req.params.id,
    creator: req.userId
  }, review).then(result => {
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

exports.getpostTitleD3MapReduce = (req, res, next) => {
  var o = {}
  o.map = function () {
    emit(this.title, 1);
  };
  o.reduce = function (k, vals) {
    return vals.length;
  };

  Post.mapReduce(o).then(docs => {
    return res.status(200).json({
      docs
    });
  }).catch(docs1 => {})
};
router.get("/mapreduce", (req, res, next) => {
  var o = {}
  o.map = function () {
    emit(this.title, 1);
  };
  o.reduce = function (k, vals) {
    return vals.length;
  };

  Review.mapReduce(o).then(docs => {
    return res.status(200).json({
      docs
    });
  }).catch(docs1 => {})
})

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

router.delete("/:id", passport.authenticate('jwt', {session: false}), (req, res, next) => {
  // Review.find().populate('creator', 'username').then(revArr => {
  //   revArr.forEach(rev => {
  //     if(rev.creator.id!==req.userId){
  //       res.status(401).json({
  //         message: "unauthorized"
  //       });
  //     }
  //   })
  // })
  Review.deleteOne({
    _id: req.params.id,
    creator: req.userId
  }).then(result => {
    if (result.n > 0) {
      res.status(200).json({
        message: "Success Delete"
      });
    } else {
      res.status(401).json({
        message: "Not authorized!"
      });
    }
  }).catch(error => {
    res.status(500).json({
      message: "Fetching comment failed!"
    });
  });
});



module.exports = router;
