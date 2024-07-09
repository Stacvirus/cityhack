const mongoose = require("mongoose");

const validateURL = (url) => {
  const urlRegex = /^(https?|chrome):\/\/[^\s$.?#].[^\s]*$/;
  return urlRegex.test(url);
};

const schema = mongoose.Schema({
  name: {
    type: String,
    required: true,
    unique: true,
  },
  description: {
    type: String,
    required: true,
  },
  link: {
    type: String,
    required: true,
    validate: [validateURL, "please enter a valid URL"],
  },

  image: {
    type: String,
    default: "/images/lms/lms_default_images.png",
    required: true,
  },
});

schema.set("toJSON", {
  transform: (document, returnedObject) => {
    returnedObject.id = returnedObject._id.toString();
    delete returnedObject._id, delete returnedObject.__v;
  },
});

module.exports = mongoose.model("LMS", schema);
