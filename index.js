const express = require("express"),
  app = express();

const nav = [
  { title: "Home", url: "/" },
  { title: "Blog", url: "/blog" },
  { title: "About", url: "/about" },
  { title: "Contacts", url: "/contacts" }
];

app.set("views", "./views");
app.set("view engine", "pug");

app.use(express.static("./public"));

app.get("/", (req, res) => {
  res.render("index", { nav });
});

app.get("*", (req, res) => {
  res.render("index", { nav });
});

app.listen(8000, () => {
  console.log("Listening");
});