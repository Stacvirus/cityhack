const jwt = require("jsonwebtoken");
const Candidate = require("../models/candidate");

const unknownEndpoint = (req, res) => {
  res.status(404).send({ error: "unknown endpoint" });
};

const errorHandler = (error, req, res, next) => {
  console.log(error.message);
  switch (error.message) {
    case "CastError":
      return res.status(400).sent({ error: "malformed id" });
    case "ValidationError":
      return res.status(400).send({ error: error.message });
    case "jsonWebTokenError":
      return res.status(401).send({ error: "invalid token" });
    case "jsonWebExpiredError":
      return res.status(401).send({ error: "token expired" });
    default:
      next(error);
      break;
  }
};

const logger = (req, res, next) => {
  console.log("Method:", req.method);
  console.log("Path:", req.path);
  console.log("Body:", req.body);
  console.log("---");
  next();
};

const tokenExtractor = (req, res, next) => {
  const authorization = req.get("authorization");
  if (authorization && authorization.startsWith("Bearer ")) {
    req.token = authorization.replace("Bearer ", "");
  }
  next();
};

async function userExtractor(req, res, next) {
  let user;
  try {
    user = jwt.verify(req.token, process.env.SECRET);
  } catch (error) {
    return next(error);
  }
  req.use = await Candidate.findById(user.id);
  next();
}

module.exports = {
  errorHandler,
  unknownEndpoint,
  logger,
  tokenExtractor,
  userExtractor,
};
