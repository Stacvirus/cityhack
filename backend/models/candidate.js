const mongoose = require("mongoose");

const schema = mongoose.Schema({
  email: {
    type: String,
    require: true,
  },
  password: {
    type: String,
    required: true,
    minlength: 8,
  },

  role: {
    type: String,
    enum: ["candidate", "trainee", "mentor"],
    default: "candidate",
  },

  level: {
    type: Number,
    min: 0,
    max: 10,
    default: 0,
  },

  hackathons: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Hackathon",
    },
  ],
  won: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Hackathon",
    },
  ],
  courses: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Course",
    },
  ],
  mentors: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Candidate",
    },
  ],
  lms: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "LMS",
    },
  ],
  trainee: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Candidate",
    },
  ],
  jobs: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Job",
    },
  ],
  missions: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Mission",
    },
  ],
  notes: [
    {
      type: Number,
      min: 1,
      max: 10,
      default: 1,
    },
  ],
});

schema.set("toJSON", {
  transform: (document, returnedObject) => {
    returnedObject.id = returnedObject._id.toString();
    delete returnedObject._id;
    delete returnedObject.__v;
  },
});

module.exports = mongoose.model("Candidate", schema);
