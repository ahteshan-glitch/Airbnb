const Listing = require("../schema/listing.js");
// module.exports.homepage=async(req,res)=>{
//     const listings=await Listing.find()
    
//     res.render("listings/home.ejs",{listings})
//   }
module.exports.details=async(req,res)=>{
  let {id}=req.params
  let details = await Listing.findById(id)
  .populate('owner')
  .populate({
    path: 'reviews',
    populate: {
      path: 'author'
    }
  });

  if(!details){
    req.flash("error","listing you looking for does not exist")
    res.redirect("/listings")
  }
  console.log(details)
  res.render("listings/details.ejs",{details})
}
module.exports.delete=async(req,res)=>{
  let {id}=req.params
  await Listing.findByIdAndDelete(id)
  req.flash("success","listing deleted successfully")
  res.redirect("/listings")
}
module.exports.updatepage=async(req,res)=>{
  let {id}=req.params
  let details=await Listing.findById(id)
  if(!details){
    req.flash("error","listing you looking for does not exist")
    res.redirect("/listings")
  }
  let originalimage=details.image.url
  originalimage=originalimage.replace("/uplaod","/upload/w_250")
  res.render("listings/edit.ejs",{details,originalimage})
  
}
module.exports.update=async(req,res)=>{
    
  let {id}=req.params
  
  let {title,description,price,location,image,country}=req.body
  let listing=await Listing.findByIdAndUpdate(id, {
    $set: {
      title,
      description,
      price,
      location,
      country
    }
  })
  if(typeof req.file!=="undefined"){
    let url=req.file.path
  let filename=req.file.filename
  listing.image={url,filename}
  await listing.save()
  }
  
  req.flash("success","listing updated successfully")
  
  res.redirect("/listings")
}
module.exports.addpage=(req,res)=>{
  res.render("listings/add.ejs")
}
module.exports.add=async(req,res,next)=>{
  let url=req.file.path
  let filename=req.file.filename
  
    
  let {title,description,image,price,location,country}=req.body
  let newdata=new Listing({
    title,description,image:{url:image},price,location,country
  })
  newdata.owner=req.user._id
  newdata.image={url,filename}
  await newdata.save()
  req.flash("success","new listing added successfully")
  res.redirect("/listings")}
  