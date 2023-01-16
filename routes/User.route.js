const express = require("express");
const { UserModel } = require("../models/User.model");
require("dotenv").config();
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const userRouter = express.Router();

userRouter.post("/register", async (req, res) => {
  
  // hashing
  const { name,email,gender,password } = req.body;
  try {
    
    bcrypt.hash(password, 5, async (err, secure_pass) => {
      
      if (err) {
        console.log(err);
      } else {
        const user = new UserModel({ name, email, gender, password:secure_pass});
        await user.save();
        res.send("Registered successfully");
      }
    });
  } catch (err) {
    res.send("Error while Registration try again!!!");
    console.log(err);
  }
});

userRouter.post("/login", async (req, res) => {
  const { email,password} = req.body;
  try {
    const user = await UserModel.find({ email });
    if (user.length > 0) {
      console.log(password, user[0].password);
      bcrypt.compare(password, user[0].password, (err, result) => {
        // result == true
        if (result) {
          const token = jwt.sign({ userID: user[0]._id }, process.env.key);
          res.send({ msg: "Login successfull", token: token });
        } else {
          res.send("Wrong credential,, Check again");
        }
      });
    } else {
      res.send("Wrong credential");
    }
  } catch (err) {
    res.send("Something went wrong");
    console.log(err);
  }
});



// userRouter.get("/data", (req, res) => {
//   const token = req.headers.authorization;
//   console.log(token);
//   // if(token=="abc"){
//   //    res.send("Data....");
//   // }else{
//   //     res.send("Login first")
//   // }
//   jwt.verify(token, "masai", (err, decoded) => {
//     if (err) {
//       res.send("Invalid token");
//       console.log(err);
//     } else {
//       res.send("Data...");
//     }
//     // err
//     // decoded undefined
//   });
// });
// userRouter.get("/cart", (req, res) => {
//   const token = req.query.token;
//   jwt.verify(token, "masai", (err, decoded) => {
//     if (err) {
//       res.send("Invalid token");
//       console.log(err);
//     } else {
//       res.send("Cart Page...");
//     }
//     // err
//     // decoded undefined
//   });
// });
// userRouter.get("/contact", (req, res) => {
//   res.send("Contact page");
// });

module.exports = {
  userRouter,
};
