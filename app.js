//jshint esversion:6

const express = require("express");
const bodyParser = require("body-parser");
const ejs = require("ejs");
const _ = require("lodash");
const mongoose = require("mongoose");

const homeStartingContent = "Hello, my name is Jan. This is my first self-build webblog. Leave me a message, if you want to.";
const aboutContent = "Hac habitasse platea dictumst vestibulum rhoncus est pellentesque. Dictumst vestibulum rhoncus est pellentesque elit ullamcorper. Non diam phasellus vestibulum lorem sed. Platea dictumst quisque sagittis purus sit. Egestas sed sed risus pretium quam vulputate dignissim suspendisse. Mauris in aliquam sem fringilla. Semper risus in hendrerit gravida rutrum quisque non tellus orci. Amet massa vitae tortor condimentum lacinia quis vel eros. Enim ut tellus elementum sagittis vitae. Mauris ultrices eros in cursus turpis massa tincidunt dui.";
const contactContent = "Scelerisque eleifend donec pretium vulputate sapien. Rhoncus urna neque viverra justo nec ultrices. Arcu dui vivamus arcu felis bibendum. Consectetur adipiscing elit duis tristique. Risus viverra adipiscing at in tellus integer feugiat. Sapien nec sagittis aliquam malesuada bibendum arcu vitae. Consequat interdum varius sit amet mattis. Iaculis nunc sed augue lacus. Interdum posuere lorem ipsum dolor sit amet consectetur adipiscing elit. Pulvinar elementum integer enim neque. Ultrices gravida dictum fusce ut placerat orci nulla. Mauris in aliquam sem fringilla ut morbi tincidunt. Tortor posuere ac ut consequat semper viverra nam libero.";

const app = express();

app.set('view engine', 'ejs');

app.use(bodyParser.urlencoded({extended: true}));
app.use(express.static("public"));

mongoose.connect("mongodb://localhost:27017/dailyJournalDB", {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  useFindAndModify: false
});

const blogPostsSchema = {
  title: {
    type: String,
    required: [true, "No title added."]
  },
  content: {
    type: String,
    required: [true, "No content added."]
  }
};

const Post = new mongoose.model("BlogPost", blogPostsSchema);

const blogPost1 = new Post({
  title: "My fist blogpost",
  content: "Hello, welcome to my  very first webblog. This page was build while executing the udemy.com cours 'The complete web developter bootcamp', by Angela Yu."
});

const blogPost2 = new Post({
  title: "Explenation",
  content: "You can leave message by clicking on MESSAGE ME or go to URL/compose."
});

const defaultBlogPosts = [blogPost1, blogPost2];

app.get("/", function(req, res){

  Post.find(function(err, foundPosts) {
    if (err) {
      console.log(err);
    } else {

      if (foundPosts.length === 0) {
        Post.insertMany(defaultBlogPosts, function(err) {
          if (err) {
            console.log(err);
          } else {
            console.log("Successfully added the default posts to Posts collection.");
          }
        });
        res.redirect("/");

      } else {
        res.render("home", {
          startingContent: homeStartingContent,
          posts: foundPosts
        });
      }
    }
  });

});

app.get("/about", function(req, res){
  res.render("about", {aboutContent: aboutContent});
});

app.get("/contact", function(req, res){
  res.render("contact", {contactContent: contactContent});
});

app.get("/compose", function(req, res){
  res.render("compose");
});

app.post("/compose", function(req, res){
  const post = {
    title: req.body.postTitle,
    content: req.body.postBody
  };

  const newPost = new Post({
    title: req.body.postTitle,
    content: req.body.postBody
  });

  newPost.save();
  res.redirect("/");

});

app.get("/posts/:postName", function(req, res){

  //const requestedTitle = _.lowerCase(req.params.postName);
  const requestedTitle = req.params.postName;

  Post.findOne({title: requestedTitle}, function(err, foundPost) {

    if (!err) {

      if (!foundPost) {

        console.log(requestedTitle + " not found!");
        res.redirect("/");

      } else {
        res.render("post", {
          title: foundPost.title,
          content: foundPost.content
        });
      }
    }
  });

});

app.listen(3000, function() {
  console.log("Server started on port 3000");
});
