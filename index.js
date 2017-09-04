const express = require("express"),
  app = express(),
  mongoose = require("mongoose"),
  navSchema = require("./schemas/nav"),
  userSchema = require("./schemas/users"),
  bodyParser = require("body-parser"),
  multer = require("multer"),
  passport = require("passport"),
  cookieParser = require("cookie-parser"),
  LocalStrategy = require("passport-local").Strategy;

const Nav = mongoose.model("AppNav", navSchema);
const User = mongoose.model("User", userSchema);

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
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(cookieParser());
app.use(require("express-session")({ secret: "levelup 2017" }));
app.use(passport.initialize());
app.use(passport.session());

passport.serializeUser((user, done) => {
  done(null, user.username);
});

passport.deserializeUser((username, done) => {
  User.findOne({ username }, done);
});

passport.use(new LocalStrategy((username, password, done) => {
  User.findOne({ username }, (err, user) => {
    if(err)
      return done(err);

    if(!user)
      return done(null, false, { message: "User was not found" });

    if(!user.password === password)
      return done(null, false, { message: "Incorrect password" });

    return done(null, user);
  });
}));

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

app
  .route("/login")
  .get((req, res) => {
    res.render("auth", {
      headline: "Sign In",
      url: "/login",
      submitText: "Signin",
      alterPath: "/signup",
      alterText: "Sign Up"
    });
  })
  .post(passport.authenticate("local", {
    successRedirect: "/",
    failureRedirect: "/login",
    failureFlash: true
  }));

app
  .route("/signup")
  .get((req, res) => {
    res.render("auth", {
      headline: "Sign Up",
      url: "/signup",
      submitText: "Signup",
      alterPath: "/login",
      alterText: "Log In"
    });
  })
  .post((req, res) => {
    const username = req.body.username ?
      req.body.username.trim() :
      null;

    const password = req.body.password ?
      req.body.password.trim() :
      null;

    if(!username || !password) {
      return res.render({
        headline: "Sign Up",
        url: "/signup",
        submitText: "Signup",
        alterPath: "/login",
        alterText: "Log In",
        errorMessage: "Please send valid information"
      });
    }

    User.create({ username, password }, (err, user) => {
      if(err) return res.render({
        headline: "Sign Up",
        url: "/signup",
        submitText: "Signup",
        alterPath: "/login",
        alterText: "Log In",
        errorMessage: "Please try again"
      });

      res.redirect("/");
    });
  });

app
  .route("/create-nav")
  .get((req, res) => {
    Nav.findOne({ url: "create-nav" }, (err, data) => {
      if(err || !data) {
        return res.render("create-nav", {
          headline: "Create Nav Item"
        });
      }

      res.render("create-nav", { headline: data.title });
    });
  })
  .post((req, res) => {
    const { url, title } = req.body;

    Nav.findOne({ url }, (err, data) => {
      if(err) {
        console.log("E:", err);
        return res.render("create-nav", {
          error: JSON.stringify(err),
          headline: "Ouch!"
        });
      }

      if(data) {
        return res.render("create-nav", {
          error: "This url is already exist",
          headline: "Ouch!"
        });
      }

      Nav.create({ url, title }, (err) => {
        if(err) {
          return res.render("create-nav", {
            error: "Can not create record in DB",
            headline: "Ouch!"
          });
        }

        res.redirect("/");
      });
    });
  });

// app.get("*", (req, res) => {
//   res.render("index", { nav });
// });

app.listen(8000, () => {
  console.log("Listening");
});