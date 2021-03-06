const express = require("express");
const router = express.Router();
const User = require("../models/User");

const uploader = require("../configs/cloudinary");

// router.get("/user/:creatorId", (req, res) => {
//   const creatorId = req.params.creatorId;
//   console.log("querying the database with", creatorId);
//   Gem.find({ creator: creatorId })
//     .then((gem) => {
//       res.json(gem);
//     })
//     .catch((err) => {
//       res.json(err);
//     });
// });

router.post("/", (req, res) => {
  const username = req.body.username;
  const profilePic = req.body.profilePic;
  const travelInterests = req.body.travelInterests;

  User.create({
    username: username,
    profilePic: profilePic,
    travelInterests: travelInterests
  })
    .then((user) => {
      req.json(user);
    })
    .catch((err) => {
      res.json(err);
    });
});

router.get("/:id", (req, res) => {
  const id = req.params.id;
  User.findById(id)
    .then((user) => {
      res.json(user);
    })
    .catch((err) => {
      res.json(err);
    });
});

router.get;

router.post("/add-image", uploader.single("profilePic"), (req, res, next) => {
  console.log(req.file);
  if (!req.file) {
    next(new Error("No file uploaded!"));
    return;
  }
  res.json({ secure_url: req.file.secure_url });
});

router.patch("/update", (req, res) => {
  const { username, profilePic, travelInterests } = req.body;
  const userId = req.user._id;
  User.findByIdAndUpdate(
    userId,
    { username, profilePic, travelInterests },
    { new: true }
  )
    .then((user) => {
      res.json(user);
    })
    .catch((err) => {
      res.json(err);
    });
});

router.put("/updateFollower", (req, res) => {
  console.log("hi");
  console.log("Here is the User I want to follow", req.body.creatorId);
  const id = req.body.creatorId; //profil dem ich folgen möchte
  const userId = req.user._id; //eingeloggter uiser
  console.log("User making request", req.user);
  const userArr = req.user.following; //Loggedin userse Array

  if (userArr.includes(id)) {
    User.findByIdAndUpdate(
      id,
      {
        $pull: { followers: userId }
      },
      { new: true }
    ).then((user) => {
      console.log("new user unfollowed");
      User.findByIdAndUpdate(
        userId,
        { $pull: { following: id } },
        { new: true }
      ).then((userSelf) => {
        console.log("new user loggedin");
        res.json(user);
      });
    });
  } else {
    User.findByIdAndUpdate(
      id,
      {
        $push: { followers: userId }
      },
      { new: true }
    ).then((user) => {
      console.log("new user gefollowed");
      User.findByIdAndUpdate(
        userId,
        { $push: { following: id } },
        { new: true }
      ).then((userSelf) => {
        console.log("new user loggedin");
        res.json(user);
      });
    });
  }
});

module.exports = router;
