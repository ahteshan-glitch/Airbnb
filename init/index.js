const mongoose=require("mongoose")
const Listing=require("../schema/listing.js")
const maindata=require("./data.js")



main()
.then(()=>{
    console.log("connected to database")
})
.catch(err => console.log(err));

async function main() {
  await mongoose.connect('mongodb://127.0.0.1:27017/airbnbself');
}

const adddata = async () => {
  await Listing.deleteMany({});
  maindata.data = maindata.data.map((obj) => ({
    ...obj,
    owner: new mongoose.Types.ObjectId("67b3518e55ed09e31e22c999") // Convert to ObjectId
  }));
  await Listing.insertMany(maindata.data);
  console.log("Data added successfully");
};
adddata()