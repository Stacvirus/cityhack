const adminRouter = require("express").Router();
const Admin = require("../models/admin");

const bcrypt = require("bcrypt");

adminRouter.post("/admin", async (req, res, next) => {
  const { password, email } = req.body;

  const hashedPassword = await bcrypt.hash(password, 10);
  const admin = new Admin({
    email,
    password: hashedPassword,
  });

  try {
    const savedAdmin = await admin.save();
    res.send(savedAdmin).status(200);
  } catch (error) {
    next(error);
  }
});
