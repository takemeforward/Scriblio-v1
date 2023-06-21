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
  },
  dateTime: {
    type: Date,
    default: Date.now
  },
  image: {
    data: Buffer,
    contentType: String
  }
});

const Blog = mongoose.model('Blog', blogSchema);

const commentSchema = new mongoose.Schema({
  user:{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  },
  post:{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Blog'
  },
  comment: String,
  dateTime:{
    type: Date,
    default: Date.now
  },
  replies: [
    {
        user: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User'
          },
        reply: String,
        dateTime:{
          type: Date,
          default: Date.now
      }
    }
  ]
});

const Comment = mongoose.model('Comment', commentSchema);

const likeSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  postId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Blog',
    required: true
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

const Like = mongoose.model('Like', likeSchema);

module.exports = {
  User,
  Blog,
  Visiter,
  Comment,
  Like
};
