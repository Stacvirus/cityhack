const hackathonRouter = require("express").Router();
const Hackathon = require("../models/hackathon");
const multer = require("multer");
const { userExtractor } = require("../utils/middlewares");
const imageLinkRefactoring = require("../utils/imageLink");

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

//create an hackathon post
hackathonRouter.post(
  "/",
  // userExtractor,
  //upload.single("file"),
  async (req, res, next) => {
    // if (!req.file) return res.json({ error: "invalid file extension" });

    const { body } = req;
    console.log(body);
    if (!body.description || !body.name || !body.dueDate)
      return res.json({ error: "inputs missing!" });

    const due = body.dueDate;
    const date = new Date(due);

    if (isNaN(date.getTime())) {
      return res.status(400).json({ error: "invalid date format!" });
    }

    const hackathon = new Hackathon({
      ...body,
      dueDate: date,
      image: "req.file.path",
    });

    try {
      let savedHackathon = await hackathon.save();

      res
        .send({
          ...savedHackathon.toJSON(),
          image: imageLinkRefactoring(savedHackathon.image),
        })
        .status(200);
    } catch (error) {
      next(error);
    }
  }
);

// post winners for an hackathon
hackathonRouter.post("/winner/:id", userExtractor, async (req, res, next) => {
  const { id } = req.params;
  const { user } = req;

  try {
    const hackathon = await Hackathon.findById(id);

    hackathon.winners = hackathon.winners.concat(user.id);

    user.won = user.won.concat(hackathon.id);

    await hackathon.save();
    await user.save();
    res
      .send({
        ...hackathon.toJSON(),
        image: imageLinkRefactoring(hackathon.image),
      })
      .status(200);
  } catch (error) {
    next(error);
  }
});

//permit user to join an hackathon
hackathonRouter.post("/join/:id", userExtractor, async (req, res, next) => {
  const { user } = req;
  const { id } = req.params;

  try {
    const hackathon = await Hackathon.findById(id);
    hackathon.participants = hackathon.participants.concat(user.id);
    user.hackathons = user.hackathons.concat(hackathon.id);

    await user.save();
    await hackathon.save();

    res
      .send({
        ...hackathon.toJSON(),
        image: imageLinkRefactoring(hackathon.image),
      })
      .status(200);
  } catch (error) {
    next(error);
  }
});

//permits user to quit and hackathon
hackathonRouter.post("/quit/:id", userExtractor, async (req, res, next) => {
  const { user } = req;
  const { id } = req.params;
  try {
    const hackathon = await Hackathon.findById(id);
    user.hackathons = user.hackathons.filter((h) => h.toString() != id);
    hackathon.participants = hackathon.participants.filter(
      (p) => p.toString() != user.id.toString()
    );

    await hackathon.save();
    await user.save();
    res
      .send({
        ...hackathon.toJSON(),
        image: imageLinkRefactoring(hackathon.image),
      })
      .status(200);
  } catch (error) {
    next(error);
  }
});

//get all hackathons
hackathonRouter.get("/", async (req, res, next) => {
  console.log("in get hackathon router");
  try {
    const allHackathon = await Hackathon.find()
      .populate("winners", { email: 1, id: 1 })
      .populate("participants", { email: 1, id: 1 });

    if (!allHackathon)
      return res.status(404).send({ error: "hackathon list empty!" });
    let refactoredHackathons = [];
    allHackathon.map((b) => {
      refactoredHackathons = refactoredHackathons.concat({
        ...b.toJSON(),
        image: imageLinkRefactoring(b.image),
      });
    });

    res.send(refactoredHackathons);
  } catch (error) {
    next(error);
  }
});

//get a specific hackathon
hackathonRouter.get("/:id", async (req, res, next) => {
  const { id } = req.params;
  try {
    const hackathon = await Hackathon.findById(id);

    if (!hackathon) return res.status(404).send({ error: "object not found!" });

    res.send({
      ...hackathon.toJSON(),
      image: imageLinkRefactoring(hackathon.image),
    });
  } catch (error) {
    next(error);
  }
});

//delete a specific hackathon
hackathonRouter.delete("/:id", userExtractor, async (req, res, next) => {
  const { id } = req.params;
  try {
    await Hackathon.findByIdAndDelete(id);

    res.status(200);
  } catch (error) {
    next(error);
  }
});

// modify a specific hackathon
hackathonRouter.put("/", async (req, res, next) => {
  const { body } = req;
  const { id } = body;

  try {
    const updatedHackathon = await Hackathon.findByIdAndUpdate(body, id, {
      new: true,
    });
    res.send({
      ...updatedHackathon.toJSON(),
      image: imageLinkRefactoring(updatedHackathon.image),
    });
  } catch (error) {
    next(error);
  }
});

module.exports = hackathonRouter;
