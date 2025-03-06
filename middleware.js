const Listing = require("./schema/listing.js");
const Review = require("./schema/reviews.js");
const {listingSchema,reviewschema}=require("./schema.js")
const ExpressError=require("./utils/expresserror.js")

module.exports.isloggedin=(req,res,next)=>{
    if(!req.isAuthenticated()){
      if (req.method === "GET") {
        req.session.redirecturl = req.originalUrl;
      } else {
        req.session.redirecturl = "/listings";
      }
        req.flash("error","you must be logged in to perform such action")
        return res.redirect("/login")
        
    }
    next()
}
module.exports.saveurl=(req,res,next)=>{
    if(req.session.redirecturl){
        res.locals.redirecturl=req.session.redirecturl
    }
    next()
}
module.exports.isowner=async(req,res,next)=>{
    let {id}=req.params
    let details=await Listing.findById(id)
    if(!res.locals.currentuser._id.equals(details.owner)){
        req.flash("error","You have no authorization to perform such action")
        return res.redirect("/listings")
    }
   
    next()
}
module.exports.validateListing=(req,res,next)=>{
    let {error}=listingSchema.validate(req.body)
    if(error){
      throw new ExpressError(707,error)
    }
    else{
      next();
    }
  }
  // Validation middleware for reviews
module.exports.validatereview = (req, res, next) => {
    let { error } = reviewschema.validate(req.body);
    if (error) {
      throw new ExpressError(707, error);
    } else {
      next();
    }
  };
  module.exports.isreviewowner=async(req,res,next)=>{
    let {id,detailId}=req.params
    let review=await Review.findById(detailId)
    if(!res.locals.currentuser._id.equals(review.author)){
        req.flash("error","You have no authorization to perform such action")
        return res.redirect(`/listings/details/${id}`)
    }
   
    next()
}