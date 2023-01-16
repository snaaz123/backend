const express = require("express");
const { PostModel } = require("../models/Post.model");
const postRouter = express.Router();

postRouter.get("/", async (req, res) => {
  // verify the token
  try {
    const data = await PostModel.find();
    res.send(data);
  } catch (err) {
    console.log(err);
  }
});



postRouter.patch("/update/:id", async (req, res) => {
  const payload = req.body;
  const id = req.params.id;
  const note = await PostModel.findOne({ _id: id });
  console.log("Note", note);
  const userID_in_note = note.userID;
  console.log(userID_in_note);
  const userID_making_req = req.body.userID;
  try {

    if (userID_making_req !== userID_in_note) {
      res.send({ msg: "You are not authorizred" });
    } else {
      await PostModel.findByIdAndUpdate({ _id: id }, payload);
      res.send("Updated the Data");
    }
  } catch (err) {
    console.log(err);
    res.send({ msg: "Something went wrong" });
  }
});

postRouter.delete("/delete/:id",async(req, res) => {
    const ID = req.params.id;
    try {
      await PostModel.findByIdAndDelete({ _id: ID });
      res.send(`Post id is ${ID} deleted`);
    } catch (error) {
      console.log(error);
      res.send("something went wrong");
    }
  });

module.exports = {
  postRouter,
};

