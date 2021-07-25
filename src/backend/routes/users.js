const mongoose = require('mongoose');
const router = require('express').Router();
const User = mongoose.model('User');
const passport = require('passport');
const utils = require('../lib/Utils');


router.get("/:id", (req, res, next) => {
  try {
    mongoose.Types.ObjectId(req.params.id)
  } catch (error) {
    res.status(500).json({
      message: "Fetching comment failed"
    });
  }

  User.find({_id : mongoose.Types.ObjectId(req.params.id)}).then(user => {
    if (user) {
      res.status(200).json(user.username);
    } else {
      res.status(404).json({
        message: "user not found"
      });
    }
  }).catch(error => {
    res.status(500).json({
      message: "Fetching comment failed"
    });
  });
})

router.get('/protected', passport.authenticate('jwt', {session: false}), (req, res, next) => {
  res.status(200).json({sucess: true, msg: "user permitted"})
});

router.get('/', passport.authenticate('jwt', {session: false}), (req, res, next) => {
  // User.find({_id : mongoose.Types.ObjectId(req.userId)}).then(user=>{
  //   if(user.role !== "Admin"){
  //     res.status(401).json({
  //       message: "unauthorized"
  //     });
  //     return;
  //   }
  // })
  User.find()
    .then((users) => {
      res.status(200).json({
        message: "users fetched successfully",
        users: users
      });
    }).catch(error => {
    res.status(500).json({
      message: "users get failed"
    });
  });
});

router.post('/login', function(req, res, next){
  console.log(req.body)
  User.findOne({username: req.body.username})
    .then((user) => {
      if (!user){
        console.log("could not find the specified user.")
        res.status(401).json({success: false, msg: "could not find the specified user."});
        return
      }
      const isValid = utils.validPassword(req.body.password, user.hash, user.salt);
      if(isValid){
        const token = utils.issueJWT(user);
        console.log("success")
        res.status(200).json({success: true, user: user, token: token.token, expiresIn: token.expires});
      } else{
        console.log("wrong password!")
        res.status(401).json({success: false, msg: "wrong password!"});
      }
    })
    .catch(error => next(error));

});

router.post('/register', function(req, res, next){
  console.log(req.body)
  User.findOne({username: req.body.username})
    .then((user) => {
      if (user) {
        console.log("user already exists")
        res.status(401).json({success: false, msg: "user already exists"});
        return user;
      }
    }).then(user => {
      if(user)
        return
      const saltHash = utils.genPassword(req.body.password);

      const salt = saltHash.salt;
      const hash = saltHash.hash;

      const newUser = new User({
        username: req.body.username,
        hash: hash,
        salt: salt,
        role: "User",
        firstname: req.body.firstname,
        lastname: req.body.lastname,
        email: req.body.username

      });
      newUser.save()
        .then(user => {
          const jwt = utils.issueJWT(user);
          res.json({sucess: true, user: user, token: jwt.token, expiresIn: jwt.expires});
        })
        .catch(error=>next(error));


  })




});

module.exports = router;
