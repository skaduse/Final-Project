const mongoose = require('mongoose');
const express = require("express");
const router = express.Router();

const users = require("./users.js");
const photos = require("./photos.js");
const User = users.model;
const Photo = photos.model;
const validUser = users.valid;

const commentSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.ObjectId,
    ref: 'User'
  },
  photo: {
    type: mongoose.Schema.ObjectId,
    ref: 'Photo'
  },
  comment: String,
  created: {
    type: Date,
    default: Date.now
  },
});

const Comment = mongoose.model('Comment', commentSchema);

router.post("/:id", validUser, async (req, res) => {

  let photo = await Photo.findOne({_id: req.params.id});
  if (!photo) {
    res.send(404);
  }
  let comment = new Comment({
      comment: req.body.comment,
      user: req.user,
      photo: photo,
    });
  try {
    await comment.save();
    return res.sendStatus(200);
  } catch (error) {
    console.log(error);
    return res.sendStatus(500);
  }
});

router.get("/:id", async (req, res) => {
  try {
    let photo = await Photo.findOne({_id: req.params.id});

  if (!photo) {
    res.sendStatus(404);
  }
    let comments = await Comment.find({
      photo: photo
    }).sort({
      created: -1
    }).populate('user') ;
    return res.send(comments);
  } catch(error) {
    console.log(error);
  }

});





module.exports = {
  model: Comment,
  routes: router,
}
