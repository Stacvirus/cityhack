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

candidateRouter.get("/:id", async (req, res, next) => {
  const { id } = req.params;
  try {
    const findCandidate = await Candidate.findById(id)
      .populate("won", { name: 1, id: 1 })
      .populate("hackathons", { name: 1, id: 1 });
    if (!findCandidate)
      return res.status(404).json({ error: "condidate not found!" });
    res.send(findCandidate).status(200);
  } catch (error) {
    next(error);
  }
});

module.exports = candidateRouter;
