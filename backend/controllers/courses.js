const courseRouter = require("express").Router();
const Course = require("../models/course");
const multer = require("multer");
const { userExtractor } = require("../utils/middlewares");
const imageLinkRefactoring = require("../utils/imageLink");
const Candidate = require("../models/candidate");
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

//permits the admin to post new courses
courseRouter.post(
  "/",
  // userExtractor,
  //upload.single("fileCourse"),
  async (req, res, next) => {
    // if (!req.file) return res.json({ error: "invalid file extension" });

    const { body } = req;
    console.log(body);
    if (!body.description || !body.title)
      return res.json({ error: "inputs missing!" });

    const course = new Course({
      ...body,
      image: "req.file.path",
    });

    try {
      const savedCourse = await course.save();

      res
        .send({
          ...savedCourse.toJSON(),
          image: imageLinkRefactoring(course.image),
        })
        .status(200);
    } catch (error) {
      next(error);
    }
  }
);

// permit admin to add mentors to a course
courseRouter.post("/mentor/:id", userExtractor, async (req, res, next) => {
  const { id } = req.params;
  const { body } = req;

  try {
    const mentor = await Candidate.findOne({ email: body.email });
    const course = await Course.findById(id);

    course.mentors = course.mentors.concat(mentor.id);
    mentor.courses = mentor.courses.concat(course.id);

    await course.save();
    await mentor.save();

    res.send(course).status(200);
  } catch (error) {
    next(error);
  }
});

// permit admin to add mentors to a LMSs
courseRouter.post("/lms/:id", userExtractor, async (req, res, next) => {
  const { id } = req.params;
  const { body } = req;

  try {
    const lms = await LMS.findOne({ name: body.name });
    const course = await Course.findById(id);

    console.log(lms);

    course.lms = course.lms.concat(lms.id);

    await course.save();

    res.send(course).status(200);
  } catch (error) {
    next(error);
  }
});

//permits users to signal their graduation
courseRouter.post("/graduates/:id", userExtractor, async (req, res, next) => {
  const { id } = req.params;
  const { body } = req;
  const { user } = req;

  try {
    // const lms = await LMS.findOne({ name: body.name });
    const course = await Course.findById(id);

    // console.log(lms);

    course.graduates = course.graduates.concat(user.id);

    await course.save();

    res.send(course).status(200);
  } catch (error) {
    next(error);
  }
});

//get all hackathons
courseRouter.get("/", async (req, res, next) => {
  console.log("in get courses router");
  try {
    const allCourses = await Course.find()
      .populate("mentors", { email: 1, id: 1 })
      .populate("lms", {
        name: 1,
        description: 1,
      })
      .populate("graduates", { email: 1, id: 1 });

    if (!allCourses)
      return res.status(404).send({ error: "course list empty!" });

    let refactoredCourses = [];
    allCourses.map((b) => {
      refactoredCourses = refactoredCourses.concat({
        ...b.toJSON(),
        image: imageLinkRefactoring(b.image),
      });
    });

    res.send(refactoredCourses);
  } catch (error) {
    next(error);
  }
});

//get a specific course
courseRouter.get("/:id", async (req, res, next) => {
  const { id } = req.params;
  try {
    const course = await Course.findById(id)
      .populate("mentors", { email: 1, id: 1 })
      .populate("lms", {
        name: 1,
        description: 1,
      })
      .populate("graduates", { email: 1, id: 1 });

    if (!course) return res.status(404).send({ error: "object not found!" });

    res.send({
      ...course.toJSON(),
      image: imageLinkRefactoring(course.image),
    });
  } catch (error) {
    next(error);
  }
});

//delete a specific course
courseRouter.delete("/:id", userExtractor, async (req, res, next) => {
  const { id } = req.params;
  try {
    await Course.findByIdAndDelete(id);

    res.status(202);
  } catch (error) {
    next(error);
  }
});

// modify a specific hackathon
courseRouter.put("/", async (req, res, next) => {
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

module.exports = courseRouter;
