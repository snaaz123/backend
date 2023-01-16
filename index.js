const express = require("express");
require("dotenv").config();
const { connection } = require("./configs/db");
const { userRouter } = require("./routes/User.route");
const cors = require("cors");
const { postRouter } = require("./routes/Post.route");
const { authenticate } = require("./middlewares/authenticate.middleware");

const app = express();
app.use(
  cors({
    origin: "*",
  })
);
app.use(express.json());

app.get("/", (req, res) => {
  res.send("Welcome to Home page");
});

app.use("/users", userRouter);
app.use(authenticate);
app.use("/posts",postRouter);

app.listen(process.env.port, async () => {
  try {
    await connection;
    console.log("Connected to the DB");
  } catch (err) {
    console.log("Trouble connecting to the DB");
    console.log(err);
  }
  console.log(`Running at ${process.env.port}`);
});
