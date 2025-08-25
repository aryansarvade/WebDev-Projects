import express from "express";
import bodyParser from "body-parser";

const app = express();
const port = 3000;

var post_ctr = 0;
//Array for storing all posts
var posts = [];

app.use(bodyParser.urlencoded({ extended: true }));

app.use(express.static("public"));

app.get("/", (req, res) => {
  res.render("homePage.ejs");
});

app.get("/create", (req, res) => {
  res.render("createPost.ejs");
});

app.get("/views", (req, res) => {
  //passing the posts array data to the views.ejs page to render the posts
  res.render("views.ejs", { data: posts });
});

app.post("/postcreated", (req, res) => {
  //a post has been created
  //adding it to the posts array
  console.log(req.body.title);
  console.log(req.body.content);
  const post = { title: req.body.title, content: req.body.content };
  posts.push(post); //added the post to the posts array for storage
  post_ctr++;
  console.log(posts);
  res.render("postCreated.ejs", post);
});

app.post("/viewpost", (req, res) => {
  if (req.body.title && req.body.content) {
    console.log(
      `View Post Title: ${req.body.title}\nView Post Content: ${req.body.content}`
    );
    res.render("viewPosts.ejs", {
      title: req.body.title,
      content: req.body.content,
    });
  } else if (req.body.deletetitle) {
    console.log(`Post to delete: ${req.body.deletetitle}`);
    let del_post = null;
    //linear search & delete
    for (let i = 0; i < posts.length; i++) {
      if (posts[i].title === req.body.deletetitle) {
        del_post = posts.splice(i, 1)[0];
        break;
      }
    }
    res.render("success_delete.ejs", { del_post });
  }
});

app.listen(port, (req, res) => {
  console.log(`Server running on port ${port}.`);
});
