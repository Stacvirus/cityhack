const mongoose = require("mongoose");

const schema = mongoose.Schema({
  title: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    required: true,
  },
  companyName: String,
  location: {
    type: String,
    required: true,
    default: "Remote",
  },
  createdAt: {
    type: Date,
    default: Date.now(),
  },
  skills: [{ type: String }],
  find: {
    type: Boolean,
    default: false,
  },
  seekers: [
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

module.exports = mongoose.model("Job", schema);
