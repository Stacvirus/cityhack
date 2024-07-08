const candidateRouter = require("express").Router();
const candidate = require("../models/candidate");
const multer = require("multer");
const { userExtractor } = require("../utils/middlewares");

const { PORT, HOST } = process.env;

function candidateRefactoring(savedcandidate) {
  const link = savedcandidate.image.split(" ").join("%20");
  // console.log(link);
  return {
    header: savedcandidate.header,
    date: savedcandidate.date,
    description: savedcandidate.description,
    tags: savedcandidate.tags,
    image: `${HOST}${PORT}/${link}`,
  };
}

const storage = multer.diskStorage({
  destination: (req, file, fn) => {
    fn(null, "./images/");
  },
  filename: (req, file, fn) => {
    fn(null, Date.now() + file.originalname);
  },
});

const fileFilter = (req, file, fn) => {
  if (file.mimetype === "image/jpeg" || file.mimetype === "image/png") {
    fn(null, true);
  } else {
    fn(
      res.send({
        error: "invalid image extension, noly PNG & JPEG authorized!",
      }),
      false
    );
  }
};

const upload = multer({
  storage: storage,
  limits: {
    fileSize: 1024 * 1024 * 5,
  },
  fileFilter: fileFilter,
});

candidateRouter.post(
  "/",
  userExtractor,
  upload.single("file"),
  async (req, res, next) => {
    if (!req.file) return res.json({ error: "invalid file extension" });

    const days = {
      1: "Monday",
      2: "Tuesday",
      3: "Wednesday",
      4: "Thursday",
      5: "Friday",
      6: "Saturday",
      7: "Suncday",
    };

    const { body } = req;
    console.log(body);
    if (!body.description) return res.json({ error: "an input missing!" });

    let date = new Date();
    date = `${
      days[date.getDay()]
    }, ${date.getDate()} ${date.getMonth()} ${date.getFullYear()}`;
    const tags = body.tags.split("#");

    const candidate = new candidate({
      ...body,
      tags,
      date,
      image: req.file.path,
    });

    try {
      let savedcandidate = await candidate.save();
      const refactoredcandidate = candidateRefactoring(savedcandidate);
      res.send(refactoredcandidate).status(200);
    } catch (error) {
      next(error);
    }
  }
);

candidateRouter.get("/", userExtractor, async (req, res, next) => {
  console.log("in get candidate router");
  try {
    const allcandidates = await candidate.find();
    let refactoredcandidates = [];
    allcandidates.map((b) => {
      refactoredcandidates = refactoredcandidates.concat(
        candidateRefactoring(b)
      );
    });

    res.send(refactoredcandidates);
  } catch (error) {
    next(error);
  }
});

candidateRouter.get("/:id", async (req, res, next) => {
  const { id } = req.params;
  console.log(req.token);
  try {
    const candidate = await candidate.findById(id);
    res.send([candidateRefactoring(candidate)]);
  } catch (error) {
    next(error);
  }
});

candidateRouter.delete("/:id", userExtractor, async (req, res, next) => {
  const { id } = req.params;
  try {
    await candidate.findByIdAndDelete(id);
    res.status(200);
  } catch (error) {
    next(error);
  }
});

candidateRouter.put("/", userExtractor, async (req, res, next) => {
  const { body } = req;
  const { id } = body;

  try {
    const updatedcandidate = await candidate.findByIdAndUpdate(body, id, {
      new: true,
    });
    res.send(candidateRefactoring(updatedcandidate));
  } catch (error) {
    next(error);
  }
});

module.exports = candidateRouter;
