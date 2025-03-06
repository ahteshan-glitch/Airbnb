
const express=require("express")

const router = express.Router({ mergeParams: true });
const wrapasync=require("../utils/wrapasync.js")
const controller=require("../controller/review.js")
const {isloggedin,isowner,validateListing,isreviewowner}=require("../middleware.js")
// Review routes
router.post("/", isloggedin, wrapasync(controller.addreview));
  
  router.delete(
    "/:detailId",isloggedin,isreviewowner,
    wrapasync(controller.deletereview)
  );
  module.exports=router