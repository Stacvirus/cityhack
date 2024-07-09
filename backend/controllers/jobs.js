const jobRouter = require("express").Router();
const Job = require("../models/job");
const { userExtractor } = require("../utils/middlewares");

//permits the admin to post new job offer
jobRouter.post(
  "/",
  // userExtractor,
  async (req, res, next) => {
    const { body } = req;
    console.log(body);
    if (!body.description || !body.title || !body.location)
      return res.json({ error: "inputs missing!" });

    const job = new Job(body);

    try {
      const savedJob = await job.save();

      res.send(savedJob).status(200);
    } catch (error) {
      next(error);
    }
  }
);

//permits users to postulate to job offers
jobRouter.post("/candidates/:id", userExtractor, async (req, res, next) => {
  const { id } = req.params;
  const { user } = req;

  try {
    const job = await Job.findById(id);

    job.seekers = job.seekers.concat(user.id);

    await job.save();

    res.send(job).status(200);
  } catch (error) {
    next(error);
  }
});

//get all job offers
jobRouter.get("/", async (req, res, next) => {
  console.log("in get job router");
  try {
    const allJobs = await Job.find().populate("seekers", { email: 1, id: 1 });

    if (!allJobs) return res.status(404).send({ error: "job list empty!" });

    res.send(allJobs);
  } catch (error) {
    next(error);
  }
});

//get a specific job
jobRouter.get("/:id", async (req, res, next) => {
  const { id } = req.params;
  try {
    const job = await Job.findById(id).populate("seekers", { email: 1, id: 1 });

    if (!job) return res.status(404).send({ error: "object not found!" });

    res.send(job);
  } catch (error) {
    next(error);
  }
});

//delete a specific job
jobRouter.delete("/:id", userExtractor, async (req, res, next) => {
  const { id } = req.params;
  try {
    await Job.findByIdAndDelete(id);

    res.status(202);
  } catch (error) {
    next(error);
  }
});

// modify a specific job
jobRouter.put("/", async (req, res, next) => {
  const { body } = req;
  const { id } = body;

  try {
    const updatedCourse = await Course.findByIdAndUpdate(body, id, {
      new: true,
    });
    res.send({
      ...updatedCourse.toJSON(),
      image: imageLinkRefactoring(updatedCourse.image),
    });
  } catch (error) {
    next(error);
  }
});

module.exports = jobRouter;
