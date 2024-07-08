const candidateRouter = require("express").Router();

const Candidate = require("../models/candidate");
const bcrypt = require("bcrypt");

candidateRouter.post("/", async (req, res, next) => {
  const { password, email } = req.body;

  const hashedPassword = await bcrypt.hash(password, 10);
  const candidate = new Candidate({
    email,
    password: hashedPassword,
  });

  try {
    const savedcandidate = await candidate.save();
    res.send(savedcandidate).status(200);
  } catch (error) {
    next(error);
  }
});

module.exports = candidateRouter;
