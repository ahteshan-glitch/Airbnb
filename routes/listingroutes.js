const express = require("express");
const router = express.Router();
const wrapasync = require("../utils/wrapasync.js");
const controller = require("../controller/listings.js");
const Listing = require("../schema/listing.js");
const { isloggedin, isowner, validateListing } = require("../middleware.js");
const multer = require("multer");
const { storage } = require("../cloudconfig.js");
const upload = multer({ storage });

// Homepage
router.get("/", wrapasync(controller.homepage));

// Details
router.get("/details/:id", wrapasync(controller.details));

// Delete
router.delete("/delete/:id", isloggedin, isowner, wrapasync(controller.delete));

// Add
router.route("/add")
  .get(isloggedin, controller.addpage)
  .post(isloggedin, upload.single("image"), wrapasync(controller.add));

// Edit
router.route("/edit/:id")
  .get(isloggedin, isowner, wrapasync(controller.updatepage))
  .put(isloggedin,isowner, upload.single("image"), validateListing, wrapasync(controller.update));

module.exports = router;
