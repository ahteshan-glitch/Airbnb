const Review = require("../schema/reviews.js");
const Listing = require("../schema/listing.js");
module.exports.addreview=async (req, res) => {
    let { id } = req.params;
    const { comment, rating } = req.body;
    let listingItem = await Listing.findById(id);
    let review = new Review({ comment, rating, author: req.user._id });
  
    listingItem.reviews.push(review);
    await listingItem.save();
    await review.save();
    req.flash("success","review added successfully")
    res.redirect(`/listings/details/${id}`);
  }
  module.exports.deletereview=async (req, res, next) => {
    let { id, detailId } = req.params;
    await Listing.findByIdAndUpdate(id, { $pull: { reviews: detailId } });
    await Review.findByIdAndDelete(detailId);
    req.flash("success","review deleted successfully")
    res.redirect(`/listings/details/${id}`);
  }