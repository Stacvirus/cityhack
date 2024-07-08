const mongoose = require("mongoose");

const schema = mongoose.Schema({
  title: {
    type: String,
    required: true,
    unique: true,
  },
  description: {
    type: String,
    required: true,
  },
  roadMap: {
    type: String,
    default: "/images/roadmaps/not_available_road_map.png",
  },
  lms: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "LMS",
    },
  ],
  // participants: [
  //   {
  //     type: mongoose.Schema.Types.ObjectId,
  //     ref: "Candidate",
  //   },
  // ],
  mentors: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Candidate",
    },
  ],
  graduates: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Candidate",
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

module.exports = mongoose.model("Course", schema);
