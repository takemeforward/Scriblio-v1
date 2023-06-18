require('dotenv').config();
const express = require("express");
const bodyParser = require("body-parser");
const ejs = require("ejs");
const _ = require("lodash");
const mongoose = require("mongoose");
const session = require("express-session");
// const session = require("cookie-session");
const passport = require("passport");
const googleStrategy = require("passport-google-oauth20").Strategy;

const { User, Blog, Visiter } = require('./models');
// mongoose.connect("mongodb://127.0.0.1:27017/blogr").then(() => console.log("Connected! blogr"));
async function connectMongoose(){
 await mongoose.connect("mongodb+srv://takemeforward:ERRORinPASSWORD30@cluster0.yi2ewuw.mongodb.net/ScriblioDB").then(()=> console.log("Connected to atlas database"));
}

connectMongoose();
const app = express();



app.set("view engine", "ejs");
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static("public"));

app.use(session({
  secret: "Main Nahi bataunga",
  resave: false,
  saveUninitialized: false
}));

app.use(passport.initialize());
app.use(passport.session());

passport.use(User.createStrategy());

passport.serializeUser(function (user, done) {
  done(null, user.id);
});

passport.deserializeUser(async function (id, done) {
  try {
    const user = await User.findById(id);
    done(null, user);
  } catch (err) {
    done(err, null);
  }
});

// google stratgy
passport.use(new googleStrategy({
  clientID: process.env.CLIENT_ID,
  clientSecret: process.env.CLIENT_SECRET,
  callbackURL: "http://localhost:3000/auth/google/scriblio"
},
function(accessToken, refreshToken, profile, cb) {
  // console.log(profile);

  User.findOrCreate({ googleId: profile.id}, { firstName: profile.name.givenName, lastName: profile.name.familyName }, function (err, user) {
    return cb(err, user);
  });
}
));
//some variables
const homeStartingContent = "";

// get request functions starts
let pageVisiter = 0;
// home route
app.get("/", async function (req, res) {
  try {
    pageVisiter++;
    const blogs = await Blog.find();
    res.render("home", {
      startingContent: pageVisiter,
      posts: blogs,
      user: req.user
    });
  } catch (err) {
    console.log("An error occurred", err);
  }
});

// about get router
app.get("/about", async function(req, res){
  try{
    res.render("about",{aboutContent: "Starting about text"});
  } catch(err){
    console.log("ploblem loading page");
  }
})

// about get router
app.get("/contact", async function(req, res){
  try{
    res.render("contact",{contactContent: "Starting contact text"});
  } catch(err){
    console.log("ploblem loading page");
  }
})

app.post("/contact", (req, res)=>{
  const newVisiter = new Visiter({
    name: req.body.name,
    email: req.body.email,
    message: req.body.message
});
newVisiter.save().then((res)=>{
  if(res){
      console.log("Response save successfully");
  }
})

res.render("thankyou",{
  name: req.body.name
});
})

//register with google

app.get("/auth/google", 
passport.authenticate('google',{ scope: ["profile"] }) 
);
app.get('/auth/google/scriblio', 
  passport.authenticate('google', { failureRedirect: '/login' }),
  function(req, res) {
    // Successful authentication, redirect secrets
    res.redirect('/');
  });

// login route
app.get("/login", (req, res) => {
  res.render("login");
});

// post Login
// app.post("/login", (req, res) => {
//   const user = new User(req.body);

//   req.login(user, (err) => {
//     if (err) {
//       console.log(err);
//       res.redirect("/login");
//     } else {
//       passport.authenticate("local")(req, res, () => {
//         res.redirect("/");
//       });
//     }
//   });
// });

app.post("/login", (req, res, next) => {
  passport.authenticate("local", (err, user, info) => {
    if (err) {
      console.log(err);
      return next(err);
    }
    if (!user) {
      // Authentication failed
      return res.redirect("/login");
    }
    req.login(user, (err) => {
      if (err) {
        console.log(err);
        return next(err);
      }
      // Authentication successful, redirect to home page
      return res.redirect("/");
    });
  })(req, res, next);
});


// logout route
app.get("/logout", (req, res) => {
  req.logout(() => { console.log("logging out"); });

  res.redirect("/");
});

// register route
app.get("/register", (req, res) => {
  res.render("register");
});

// post route register
app.post("/register", (req, res) => {
  const newUser = new User(req.body);
  User.register(newUser, req.body.password, (err, user) => {
    if (err) {
      console.log(err);
      res.redirect("/register");
    } else {
      passport.authenticate("local")(req, res, () => {
        res.redirect("/");
      });
    }
  });
});

// compose blog get route
app.get("/compose", (req, res) => {
  if (req.isAuthenticated()) {
    res.render("compose");
  } else {
    res.redirect("/login");
  }
});

// compose blog post route
app.post("/compose", async (req, res) => {
  try {
    const newBlog = new Blog({
      title: req.body.postTitle,
      content: req.body.postContent,
      author: req.user._id
    });
    const result = await newBlog.save();
    if (result) {
      res.redirect("/");
    } else {
      console.log("Having some issue with posting Blog");
    }
  } catch (err) {
    console.log("An error occurred", err);
  }
});

// full view of post blog
app.get("/posts/:postName", async function (req, res) {
  await Blog.findOne({title: req.params.postName})
  .populate({
    path: 'author',
    select: 'firstName lastName',
    model: 'User'
  })
  .exec()
  .then((blog) => {
    // console.log(blog.comments[0].user.id);
    // blog.content.replace('\n','<br>');
      res.render("post", {
      title: blog.title,
      content: blog.content,
      comments: blog.comments,
      author: blog.author.firstName + " " + blog.author.lastName
    });
    // console.log('Blog:', blog);
    // console.log('Author Name:', blog.author.firstName, blog.author.lastName);
  })
  .catch((err) => {
    console.log(err);
  });
});

app.post("/comment",async (req, res)=>{
  if(req.isAuthenticated()){
    const name = req.user.firstName + " " + req.user.lastName;
    console.log(req.body);
    const comment = {
      user: {
        id: req.user.id,
        name: name,
        comment: req.body.comment
      },
      replies: []
    }
    await Blog.findOne({title: req.body.postTitle})
    .exec()
    .then((blog) => {
      blog.comments.push(comment);
      blog.save();
      res.redirect(`/posts/${req.body.postTitle}`);
    })
    .catch((err) => {
      console.log(err);
    });
  }else{
    res.redirect(`/posts/${req.body.postTitle}`);
  }
  
});

app.post("/comment/reply", async (req, res)=>{
  if(req.isAuthenticated()){
  const name = req.user.firstName + " " + req.user.lastName;

  const reply = {
    id: req.user.id,
    name: name,
    reply: req.body.reply
  }
  await Blog.findOne({title: req.body.postTitle})
    .exec()
    .then((blog) => {
      blog.comments.forEach((comment)=>{
        console.log(comment._id);
        if(comment._id == req.body.commentId){
          console.log(comment._id);
          comment.replies.push(reply);
        }
      })
      blog.save();
      res.redirect(`/posts/${req.body.postTitle}`);
    })
    .catch((err) => {
      console.log(err);
    });
  }else{
    res.redirect(`/posts/${req.body.postTitle}`);
  }
})
app.listen(3000, function () {
  console.log("Server started on port 3000");
});
