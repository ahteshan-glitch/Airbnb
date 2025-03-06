const User=require("../schema/user.js")
module.exports.signuppage=(req,res)=>{
    res.render("user/signup.ejs")
}
module.exports.signup=async(req,res)=>{
    try{
        let {username,email,password}=req.body
        const newuser=new User({email,username})
        const registeruser=await User.register(newuser,password)
        console.log(registeruser)
        req.login(registeruser,(err)=>{
            if(err){
                return next(err)
            }
            req.flash("success","welcome to wonderlust")
        
        res.redirect("/listings")
        })
        
    }
    catch(e){
          req.flash("error",e.message)
          res.redirect('/signup')
    }
    
}
module.exports.loginpage=(req,res)=>{
    res.render("user/login.ejs")
}
module.exports.login=async(req,res)=>{
    req.flash("success","welcome to wonderlust")
    if(res.locals.redirecturl){
      res.redirect(res.locals.redirecturl)
    }
    else{
      res.redirect("/listings")
    }
  

}
module.exports.logout=(req,res,next)=>{
   
    req.logout((err)=>{
      if(err){
        return next(err)
      }
      req.flash("success","you logged out successfully")
      res.redirect("/listings")
    })
  }