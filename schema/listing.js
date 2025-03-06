const mongoose=require("mongoose")
const Review=require("./reviews.js")
const listingschema=new mongoose.Schema({
    title: {
        type: String,
        required: true
    },
    description: String,
    image: {
        url:String,
        filename:String
    },
    price: Number,
    location: String,
    country: String,
    reviews:[
        {
            type:mongoose.Schema.Types.ObjectId,
            ref:"Review"

        }
    ],
    owner:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"User"
    }
})
listingschema.post("findOneAndDelete",async(listing)=>{
    if(listing){
        await Review.deleteMany({reviews:{$in:listing.reviews}})
    }
   
})
const Listing=mongoose.model("Listing",listingschema)
module.exports=Listing