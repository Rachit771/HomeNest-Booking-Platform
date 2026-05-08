const favourite = require('./favourite');
const mongoose=require('mongoose')
const homeSchema = mongoose.Schema({
  houseName: {
    type: String,
    required: true
  },
  hostId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  price: {
    type: Number,
    required: true
  },
  location: {
    type: String,
    required: true
  },
  rating: {
    type: Number,
    default: 0
  },
  photoUrl: String,
  description: String,
});
homeSchema.pre('findOneAndDelete', async function(next) {
  console.log('Came to pre hook while deleting a home');
  const homeId = this.getQuery()._id;
  await favourite.deleteMany({houseId: homeId});
  next();
});
module.exports=mongoose.model('Home',homeSchema)
