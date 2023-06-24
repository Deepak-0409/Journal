//jshint esversion:6

const express = require("express");
const bodyParser = require("body-parser");
const ejs = require("ejs");
const _ = require("lodash")
const mongoose = require('mongoose');
const Schema = mongoose.Schema;
require('dotenv').config()


const app = express();
app.set('view engine', 'ejs');
app.use(bodyParser.urlencoded({extended: true}));
app.use(express.static("public"));

main().catch(err => console.log(err));

async function main() {
  await mongoose.connect(process.env.URL);
}

const postSchema = new Schema({
  title: String,
  body: String 
});

const Post = mongoose.model('Post', postSchema);

const homeStartingContent="Hello there!, welcome to your personal journal where you can share anything you want and don't worry it will end to end encrypted because we respect your privacy. Anyone can use this website as their personal digital diary. This website has been created using pure HTML,CSS,JavaScript and used EJS as view engine and the MongoDB is used to store the data.";

const aboutContent="Hac habitasse platea dictumst vestibulum rhoncus est pellentesque. Dictumst vestibulum rhoncus est pellentesque elit ullamcorper. Non diam phasellus vestibulum lorem sed. Platea dictumst quisque sagittis purus sit. Egestas sed sed risus pretium quam vulputate dignissim suspendisse. Mauris in aliquam sem fringilla. Semper risus in hendrerit gravida rutrum quisque non tellus orci. Amet massa vitae tortor condimentum lacinia quis vel eros. Enim ut tellus elementum sagittis vitae. Mauris ultrices eros in cursus turpis massa tincidunt dui.";
const contactContent="Scelerisque eleifend donec pretium vulputate sapien. Rhoncus urna neque viverra justo nec ultrices. Arcu dui vivamus arcu felis bibendum. Consectetur adipiscing elit duis tristique. Risus viverra adipiscing at in tellus integer feugiat. Sapien nec sagittis aliquam malesuada bibendum arcu vitae. Consequat interdum varius sit amet mattis. Iaculis nunc sed augue lacus. Interdum posuere lorem ipsum dolor sit amet consectetur adipiscing elit. Pulvinar elementum integer enim neque. Ultrices gravida dictum fusce ut placerat orci nulla. Mauris in aliquam sem fringilla ut morbi tincidunt. Tortor posuere ac ut consequat semper viverra nam libero.";

// Handling get requests
app.get("/",function(req,res)
{ 
  Post.find({},function(err,foundPosts)
  {
    if(err)
    {
      console.log(err);
    }
    else
    {
      res.render("home",{homeContent: homeStartingContent, posts: foundPosts});
    }
  })
});

app.get("/posts/:postId",function(req,res)
{
  
  const requestedId= req.params.postId;

  Post.findOne({_id: requestedId}, function(err,foundPost)
  {
    if(err)
    {
      console.log(err);
    }
    else
    {
      res.render("post",{postTitle: foundPost.title, postContent: foundPost.body});
    }
  })

});

app.get("/about",function(req,res)
{
  res.render("about",{about: aboutContent});
});

app.get("/contact",function(req,res)
{
  res.render("contact",{contact: contactContent});
});

app.get("/compose",function(req,res)
{
  res.render("compose");
});

app.post("/compose",function(req,res)
{  
  const post= new Post({
    title: req.body.postTitle,
    body: req.body.postBody
  });
  
  post.save(function(err){
    if(!err)
    {
      res.redirect("/");
    }
  });
});

app.get("/delete/:postId",function(req,res)
{
  const requestedId= req.params.postId;
  Post.deleteOne({_id:requestedId},function(err,foundPost)
  {
    if(err)
    {
      console.log(err);
    }
    else
    {
        return res.redirect("/");
    }
  });
});

let port = process.env.PORT;
if (port == null || port == "") {
  port = 4000;
}

app.listen(port, function() {
  console.log("Server started !");
});
