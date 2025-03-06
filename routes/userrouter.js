const express=require("express")
const router=express.Router()

const wrapasync = require("../utils/wrapasync.js");
const passport=require("passport")
const {saveurl}=require("../middleware.js")
const controller=require("../controller/user.js")
router.route("/signup")
.get(controller.signuppage)
.post(wrapasync(controller.signup))
router.route("/login")
.get(controller.loginpage)
.post(saveurl,passport.authenticate('local', { failureRedirect: '/login' ,failureFlash: true}),controller.login)

router.get("/logout",controller.logout)
module.exports=router