//jshint esversion:6

const express = require("express");
const bodyParser = require("body-parser");
const ejs = require("ejs");
const _ = require("lodash");
const mongoose = require("mongoose");

const homeStartingContent = "This website was created as a 'Boss' project during an Udemy Bootcamp called 'The Complete 2021 Web Development Bootcamp.' This site uses expressJS and Mongoose for MongoDB.The purpose of this site is to demonstrate that I have the ability and knowledge to create a website that uses a non-relational database to store user input and then display the stored input in a blog-style page, and when a user clicks on the 'Read more' link the action passes the blog ID to the server to recall the specific post from the DB. I hope you enjoy this project.";
const aboutContent = "I have loved programming for as long as I can remember. I started playing around with databases in my touring days in the live music industry. I used FileMaker Pro to create my own advance-style database to keep track of each show, venue and promoter that I needed to coordinate logistics. This started my love of the power of databases. I eventually taught myself PHP and learned how to design websites to create a front-end to interact with promoters to start our advance work discussions, while connecting to my FileMaker Pro database on the backend (hosted on an old computer I had lying around that I turned into an Apache Server). This eventually lead me to want to learn more about programming. I just completed my Associates in Applied Science in Computer Information Technologies with a a degree in Programming from Volunteer State Community College, graduating with honors. Through this process I further developed my passion in Full-Stack Development. I am fluent in HTML, CSS, Javascript, C#, C++, .NET, Python, SQL, Access and MySQL. After a 30 year career in the live music industry, I am ready to start a new journey in programming. Will you join me on this journey?";
const contactContent = "Please contact me at at the link below.";

const app = express();

app.set('view engine', 'ejs');

app.use(bodyParser.urlencoded({extended: true}));
app.use(express.static("public"));

mongoose.connect("mongodb+srv://admin-shane:Test123@cluster0.b6pym.mongodb.net/myFirstDatabase?retryWrites=true&w=majority", {useNewUrlParser: true, useUnifiedTopology: true});

let posts = [];

const postSchema = new mongoose.Schema({
  title: String,
  content: String
});

const Post = mongoose.model("Post", postSchema);

app.get("/", function(req, res){
  Post.find({}, function(err, posts){
    res.render("home", {
      startingContent: homeStartingContent, posts: posts
    });
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
  const post = new Post ({
    title: req.body.postTitle,
    content: req.body.postBody
  });
  post.save(function(err){
    if(!err){
        res.redirect("/");
    }
  });
});

app.get("/posts/:postId", function(req, res){
  const requestedPostId = req.params.postId;

  Post.findOne({_id: requestedPostId}, function(err, post){
    res.render("post", {
      title: post.title,
      content: post.content
    });
  });

});

let port = process.env.PORT;
if (port == null || port == "") {
  port = 3000;
}

app.listen(port, function() {
  console.log("Server started on port 3000");
});
