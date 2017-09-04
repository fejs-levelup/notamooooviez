const express = require("express"),
  app = express(),
  mongoose = require("mongoose"),
  navSchema = require("./schemas/nav");

const Nav = mongoose.model("AppNav", navSchema);

mongoose.connect("mongodb://localhost/notitunes", { useMongoClient: true });

mongoose.connection.on("open", () => {
  console.log("Connected!!!");
  // Nav.create({ title: "Home", url: "/" }, (err, data) => {
  //   if(err) {
  //     console.log("ERROR >>>", err);
  //     return;
  //   }

  //   console.log(data);
  // });

  // Nav.find({}, (err, data) => {
  //   if(err) {
  //     console.log("ERROR >>>", err);
  //     return;
  //   }

  //   console.log(data);
  // })

  // Nav.findByIdAndRemove("59a845f0ce64d206fc8e3fb6", (err, data) => {
  //   if(err) {
  //     console.log("ERROR >>>", err);
  //     return;
  //   }

  //   console.log(data);
  // });
});

// const nav = [
//   { title: "Home", url: "/" },
//   { title: "Blog", url: "/blog" },
//   { title: "About", url: "/about" },
//   { title: "Contacts", url: "/contacts" }
// ];

app.set("views", "./views");
app.set("view engine", "pug");

app.use(express.static("./public"));

app.get("/", (req, res) => {
  Nav.find({}, (err, data) => {
    if(err) {
      return res.status(404).end();
    }

    const nav = data.map(navItem => ({
      title: navItem.title,
      url: navItem.url
    }));

    res.render("index", { nav });
  });
});

app.get("*", (req, res) => {
  res.render("index", { nav });
});

app.listen(8000, () => {
  console.log("Listening");
});