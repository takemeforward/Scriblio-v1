const mongoose = require('mongoose');
const passportLocalMongoose = require("passport-local-mongoose");
const findOrCreate = require("mongoose-findorcreate");

const visiterSchema = new mongoose.Schema({
  name: String,
  email: String,
  message: String
});

const Visiter = new mongoose.model("Visiter", visiterSchema);
// User schema
const userSchema = new mongoose.Schema({
  firstName: {
    type: String,
    required: true
  },
  lastName: {
    type: String,
    required: true
  },
  username: {
    type: String,
    unique: true
  },
  password: {
    type: String
  },
  googleId: {
    type: String
  }
});
userSchema.plugin(passportLocalMongoose);

userSchema.plugin(findOrCreate);

const User = mongoose.model('User', userSchema);

// Blog schema
const blogSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true
  },
  content: {
    type: String,
    required: true
  },
  author: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  }
});

const Blog = mongoose.model('Blog', blogSchema);

module.exports = {
  User,
  Blog,
  Visiter
};
