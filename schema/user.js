const mongoose = require("mongoose");
const passportLocalMongoose = require("passport-local-mongoose");

const userschema = new mongoose.Schema({
  email: {
    type: String,
    required: true
  }
});

// Apply the plugin to the schema
userschema.plugin(passportLocalMongoose);

module.exports = mongoose.model("User", userschema);
