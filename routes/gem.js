const express = require("express");
const router = express.Router();
const Gem = require("../models/Gem");

// route to create a new gem
router.post("/", (req, res) => {

 const {title, description, good_to_know,image_url="",category} = req.body

  Gem.create({
    title,
    description,
    good_to_know,
    image_url,
    category
  })
    .then(gem => {
      req.json(gem);
    })
    .catch(err => {
      res.json(err);
    });
});

// to get the list of all gems
router.get("/", (req, res) => {
  Gem.find()
    .then(gems => {
      res.json(gems);
    })
    .catch(err => {
      res.json(err);
    });
});


/*
router.get("/:id", (req, res) => {
  const id = req.params.userId;

  User.findById(id)
    .then(user => {
      res.json(user);
    })
    .catch(err => {
      res.json(err);
    });
});

router.patch("/:id", (req, res) => {
  const { username, profilePic, travelInterests } = req.body;
  const userId=req.params.id;
  console.log('########',req.params.id,'#################');
  User.findByIdAndUpdate(
    userId,
    { username, profilePic, travelInterests },
    { new: true }
  )
    .then(user => {
      console.log('########',user);
      res.json(user);
    })
    .catch(err => {
      res.json(err);
    });
});
*/

module.exports = router;