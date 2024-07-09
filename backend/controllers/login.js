const loginRouter = require("express").Router();
const Candidate = require("../models/candidate");
const Admin = require("../models/admin");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");

loginRouter.post("/candidate", async (req, res, next) => {
  const { email, password } = req.body;

  const findCandidate = await Candidate.findOne({ email });

  const passwordCorrect =
    findCandidate === null
      ? false
      : bcrypt.compare(password, findCandidate.password);

  if (!(findCandidate && passwordCorrect)) {
    return res.status(404).json({ error: "wrong credentials" });
  }

  const candidateToken = {
    email,
    id: findCandidate.id,
  };
  const token = jwt.sign(candidateToken, process.env.SECRET, {
    expiresIn: "1h",
  });

  try {
    res.status(200).send({ token, email });
  } catch (error) {
    next(error);
  }
});

loginRouter.post("/admin", async (req, res, next) => {
  const { email, password } = req.body;

  const admin = await Admin.findOne({ email });

  const passwordCorrect =
    admin === null ? false : bcrypt.compare(password, admin.password);

  if (!(admin && passwordCorrect)) {
    return res.status(404).json({ error: "wrong credentials" });
  }

  const adminToken = {
    email,
    id: admin.id,
  };
  const token = jwt.sign(adminToken, process.env.SECRET, {
    expiresIn: "1h",
  });

  try {
    res.status(200).send({ token, email });
  } catch (error) {
    next(error);
  }
});

module.exports = loginRouter;
