
if (process.env.NODE_ENV != "production") {
  require("dotenv").config();
}

const express = require("express");
const mongoose = require("mongoose");
const app = express();
const path = require("path"); 
const methodOverride = require("method-override");
const ejsmate = require("ejs-mate");

const ExpressError = require("./utils/expresserror.js");

const listingroutes = require("./routes/listingroutes.js");
const reviewroutes = require("./routes/reviewroutes.js");
const user=require("./routes/userrouter.js")
const session = require("express-session");
const MongoStore = require('connect-mongo');
const flash=require("connect-flash")
const passport=require("passport")
const localstrategy=require("passport-local")
const User=require("./schema/user.js")


// Set up middleware for parsing and static files
app.use(express.urlencoded({ extended: true }));
app.use(methodOverride("_method"));
app.use(express.static(path.join(__dirname, "/public")));


// Set up EJS as the view engine
app.engine("ejs", ejsmate);
app.set("views", path.join(__dirname, "views"));
app.set("view engine", "ejs");
const urldb=process.env.ATLASDB_URL
const store=MongoStore.create({
  mongoUrl:urldb,
  crypto:{
    secret:process.env.SECRET,
  },
  touchAfter:24*3600,
})
store.on("error",()=>{
  onslotchange.log("error in mongo store",err)
})
// Session configuration
const sessionoption = {
  store,
  secret:process.env.SECRET,
  resave: false,
  saveUninitialized: true,
  cookie: {
    expires: Date.now() + 7 * 24 * 60 * 60 * 1000,
    maxAge: 7 * 24 * 60 * 60 * 1000,
    httpOnly: true,
  },
};

app.use(session(sessionoption));
app.use(flash());
app.use(passport.initialize())
app.use(passport.session())
passport.use(new localstrategy(User.authenticate()))
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());
app.use((req,res,next)=>{
  res.locals.msg=req.flash("success");
  res.locals.err=req.flash("error")
  res.locals.currentuser=req.user
  next();
})


// Connect to MongoDB
async function main() {
  await mongoose.connect(urldb);
}
main()
  .then(() => {
    console.log("connected to database");
  })
  .catch((err) => console.log(err));





// Routes for listings
app.use("/", user)
app.use("/listings", listingroutes);
app.use("/listings/:id/reviews", reviewroutes);



// Catch-all route for 404 errors
app.all("*", (req, res, next) => {
  next(new ExpressError(404, "page not found!"));
});

// Error-handling middleware
app.use((err, req, res, next) => {
  let { statuscode = 505, message = "something went wrong" } = err;
  res.status(statuscode).render("error.ejs", { err });
});

// Start the server
app.listen(9090, (req, res) => {
  console.log("server online");
});
