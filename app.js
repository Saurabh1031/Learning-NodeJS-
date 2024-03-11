const path = require("path");
const express = require("express");
const bodyParser = require("body-parser");
const errorController = require("./controllers/error");
// const { mongoConnect } = require("./util/database");
const mongoose = require("mongoose");
const adminRoutes = require("./routes/admin");
const shopRoutes = require("./routes/shop");
const User = require("./models/user");

const app = express();

app.set("view engine", "ejs");
app.set("views", "views");

app.use(bodyParser.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, "public")));

app.use((req, res, next) => {
  User.findById("65eb2f592ab9e924cfed4995")
    .then((user) => {
      req.user = user;
      // console.log("user ", user);
      next();
    })
    .catch((err) => console.log(err));
});

app.use("/admin", adminRoutes);
app.use(shopRoutes);

app.use(errorController.get404);

// mongoConnect(() => {
//   app.listen(3000);
// });
mongoose
  .connect(
    "mongodb+srv://saurabh253:ImK1pI8Q3Hx79YFH@cluster0.av6lz7m.mongodb.net/shop?retryWrites=true&w=majority&appName=Cluster0"
  )
  .then((result) => {
    console.log("mongoose connected to DB!");
    User.findOne()
      .then((user) => {
        if (!user) {
          const user = new User({
            name: "Saurabh",
            email: "saurabh6455@gmail.com",
            cart: {
              items: [],
            },
          });
          console.log("NEW USER CREATED!");
          return user.save();
        }
        return user;
      })
      .then((result) => {
        app.listen(3000);
      });
  })
  .catch((err) => console.log(err));
