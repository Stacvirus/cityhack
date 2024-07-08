const lmsRouter = require("express").Router();
const Course = require("../models/course");
const multer = require("multer");
const { userExtractor } = require("../utils/middlewares");
const imageLinkRefactoring = require("../utils/imageLink");
const LMS = require("../models/lms");

const storage = multer.diskStorage({
  destination: (req, file, fn) => {
    fn(null, "./images/hackathons");
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

//permits the admin to post new lms
lmsRouter.post(
  "/",
  // userExtractor,
  //upload.single("fileLms"),
  async (req, res, next) => {
    // if (!req.file) return res.json({ error: "invalid file extension" });

    const { body } = req;
    console.log(body);
    if (!body.description || !body.name)
      return res.json({ error: "inputs missing!" });

    const lms = new LMS({
      ...body,
      image: "req.file.path",
    });

    try {
      const savedLms = await lms.save();

      res
        .send({
          ...savedLms.toJSON(),
          image: imageLinkRefactoring(savedLms.image),
        })
        .status(200);
    } catch (error) {
      next(error);
    }
  }
);

//get all lms
lmsRouter.get("/", async (req, res, next) => {
  console.log("in get lms router");
  try {
    const allCourses = await LMS.find();

    if (!allCourses) return res.status(404).send({ error: "lms list empty!" });

    let refactoredlms = [];
    allCourses.map((b) => {
      refactoredlms = refactoredlms.concat({
        ...b.toJSON(),
        image: imageLinkRefactoring(b.image),
      });
    });

    res.send(refactoredlms);
  } catch (error) {
    next(error);
  }
});

//get a specific lms
lmsRouter.get("/:id", async (req, res, next) => {
  const { id } = req.params;
  try {
    const lms = await Course.findById(id);

    if (!lms) return res.status(404).send({ error: "lms not found!" });

    res.send({
      ...lms.toJSON(),
      image: imageLinkRefactoring(lms.image),
    });
  } catch (error) {
    next(error);
  }
});

//delete a specific lms
lmsRouter.delete("/:id", userExtractor, async (req, res, next) => {
  const { id } = req.params;
  try {
    await LMS.findByIdAndDelete(id);

    res.status(202);
  } catch (error) {
    next(error);
  }
});

// modify a specific lms
lmsRouter.put("/", async (req, res, next) => {
  const { body } = req;
  const { id } = body;

  try {
    const updateLms = await Course.findByIdAndUpdate(body, id, {
      new: true,
    });
    res.send({
      ...updateLms.toJSON(),
      image: imageLinkRefactoring(updateLms.image),
    });
  } catch (error) {
    next(error);
  }
});

module.exports = lmsRouter;
