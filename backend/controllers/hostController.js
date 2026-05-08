const Home = require("../Model/homes");
const cloudinary = require("../config/cloudinary");
const redis=require("../config/redis")
exports.getAddHome = (req, res, next) => {
  res.render("host/edit-home", {
    editing:false,
    pageTitle: "Add Home to airbnb",
    currentPage: "addHome",
    isLoggedIn:req.isLoggedIn,
    user: req.session.user,
  });
};
exports.getEditHome = (req, res, next) => {
  const homeId=req.params.homeId;
  const editing=req.query.editing ==='true';
  Home.findOne({ _id: homeId, hostId: req.session.user._id }).then(home=>{
    if(!home){
      console.log('Home not found')
      return res.redirect('/host/host-home-list')
    }
    console.log(home)
    res.render("host/edit-home", {
    editing:editing,
    home:home,
    pageTitle: "Edit your Home",
    currentPage: "host-homes",
    isLoggedIn:req.isLoggedIn,
    user: req.session.user,
  })
  })    
};

exports.getHostHomes = (req, res, next) => {
  Home.find({ hostId: req.session.user._id }).then((registeredHomes) => {
    res.render("host/host-home-list", {
      registeredHomes: registeredHomes,
      pageTitle: "Host Homes List",
      currentPage: "host-homes",
      isLoggedIn:req.isLoggedIn,
      user: req.session.user,
    })
  });
};

exports.postAddHome = async (req, res, next) => {
  try {
    const { houseName, price, location, rating, description } = req.body;

    let photoUrl = "";

   //If image is uploaded
    if (req.file) {
      const result = await cloudinary.uploader.upload(req.file.path);
      photoUrl = result.secure_url;
    }

    const home = new Home({
      houseName,
      hostId: req.session.user._id,
      price,
      location,
      rating,
      photoUrl,
      description,
    });

    await home.save();

    console.log("Home saved successfully");

    res.redirect("/host/host-home-list");
  } catch (err) {
    console.log("Error while adding home:", err);
    res.redirect("/host/add-home");
  }
};

exports.postEditHome = async (req, res, next) => {
  try {
    const { id, houseName, price, location, rating, description } = req.body;
    const home = await Home.findOne({ _id: id, hostId: req.session.user._id });

    if (!home) {
      return res.redirect("/host/host-home-list");
    }

    // Update fields
    home.houseName = houseName;
    home.price = price;
    home.location = location;
    home.rating = rating;
    home.description = description;

    if (req.file) {
      const result = await cloudinary.uploader.upload(req.file.path);
      home.photoUrl = result.secure_url;
    }

    await home.save();

    //  REDIS CACHE INVALIDATION 
    // Delete the specific home detail and the main home list
    await redis.del(`home:${id}`);
    await redis.del("registered_homes");
    

    console.log("Home updated and Cache cleared");
    res.redirect("/host/host-home-list");
  } catch (err) {
    console.log("Error:", err);
    res.redirect("/host/host-home-list");
  }
};
exports.postDeleteHome = async (req, res, next) => {
  const homeId = req.params.homeId;
  
  try {
    console.log("Deleting home: ", homeId);
    
  
    await Home.findOneAndDelete({ _id: homeId, hostId: req.session.user._id });

    // 2. REDIS CACHE INVALIDATION
    // Remove it from the cache so it disappears from the app immediately
    await redis.del(`home:${homeId}`);
    await redis.del("registered_homes");

    console.log("Home deleted and Cache cleared");
    res.redirect("/host/host-home-list");
  } catch (error) {
    console.log("Error while deleting ", error);
    res.redirect("/host/host-home-list");
  }
};
