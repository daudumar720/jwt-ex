const express = require("express");
const jwt = require("jsonwebtoken");
const app = express();
const port = 3000;
const securityKey = "securityKey";

app.get("/", (req, res) => {
  res.send("Hello");
});

app.post("/login", (req, res) => {
  const user = {
    id: 1,
    username: "daud",
    email: "dawoodumar@gmail.com",
  };

  jwt.sign({ user }, securityKey, { expiresIn: "300s" }, (err, token) => {
    res.json({ token });
  });
});

const verifyToken = (req, res, next) => {
  const bearerHeader = req.headers["authorization"];
  if (typeof bearerHeader !== "undefined") {
    const bearer = bearerHeader.split(" ");
    const token = bearer[1];
    req.token = token;
    next();
  } else {
    res.send({
      Result: "Token is invalid",
    });
  }
};

app.post("/profile", verifyToken, (req, res) => {
  jwt.verify(req.token, securityKey, (err, authData) => {
    if (err) {
      res.send({ Result: "Invalid Token" });
    } else {
      res.json({
        Message: "Profile Accessed",
        authData,
      });
    }
  });
});

app.listen(port, () => {
  console.log("App is running on port " + port);
});
