const Home = require("../Model/homes");
const Favourite=require("../Model/favourite")
const User=require("../Model/user");
const redis = require('../config/redis')

exports.getIndex = (req, res) => {
  // Not logged in → show landing page
  if (!req.isLoggedIn) {
    return res.render("store/index", {
      registeredHomes:[],
      pageTitle: "Homenest Booking platform",
      currentPage: "index",
      isLoggedIn: false,
      user: null,
    });
  }

  // Logged in as guest → redirect to homes
  if (req.session.user.userType === "guest") {
    return res.redirect("/homes");
  }

  // Logged in as host → redirect to host homes
  if (req.session.user.userType === "host") {
    return res.redirect("/host/host-home-list");
  }
};




exports.getHomes = async (req, res, next) => {
  const cacheKey = "registered_homes";

  try {
    // 1. Check Redis first
    const cachedData = await redis.get(cacheKey);

    if (cachedData) {
      console.log("Serving from CACHE");
      return res.render("store/home-list", {
        registeredHomes: JSON.parse(cachedData), // Turn string back to Array
        pageTitle: "Homes List",
        currentPage: "Home",
        isLoggedIn: req.isLoggedIn,
        user: req.session.user,
      });
    }

    // 2. If not in Redis, go to MongoDB
    console.log("Serving from DATABASE");
    const registeredHomes = await Home.find();

    // 3. Save to Redis for next time (expires in 1 hour)
    await redis.setex(cacheKey, 3600, JSON.stringify(registeredHomes));

    res.render("store/home-list", {
      registeredHomes: registeredHomes,
      pageTitle: "Homes List",
      currentPage: "Home",
      isLoggedIn: req.isLoggedIn,
      user: req.session.user,
    });
  } catch (err) {
    next(err); // Handle errors
  }
};
exports.getFavouriteList = (req, res, next) => {
  Favourite.find()
  .populate('houseId')
  .then((favourites) => {
    const favouriteHomes = favourites.map((fav) => fav.houseId);
    res.render("store/favourite-list", {
      favouriteHomes: favouriteHomes,
      pageTitle: "My Favourites",
      currentPage: "favourites",
      isLoggedIn:req.isLoggedIn,
      user: req.session.user,
    });
  });

};


exports.postAddToFavourite = (req, res, next) => {
 const homeId = req.body.id;
  Favourite.findOne({houseId: homeId}).then((fav) => {
    if (fav) {
      console.log("Already marked as favourite");
    } else {
      fav = new Favourite({houseId: homeId});
      fav.save().then((result) => {
        console.log("Fav added: ", result);
      });
    }
    res.redirect("/favourites");
  }).catch(err => {
    console.log("Error while marking favourite: ", err);
  });
}
exports.postRemoveFromFavourite = (req, res, next) => {
  const homeId = req.params.homeId;
  Favourite.findOneAndDelete({houseId: homeId})
    .then((result) => {
      console.log("Fav Removed: ", result);
    })
    .catch((err) => {
      console.log("Error while removing favourite: ", err);
    })
    .finally(() => {
      res.redirect("/favourites");
    });
};


exports.getHomeDetails = async (req, res, next) => {
  const homeId = req.params.homeId;
  const cacheKey = `home:${homeId}`;

  const cachedHome = await redis.get(cacheKey);
  if (cachedHome) {
    return res.render('store/home-details', {
      home: JSON.parse(cachedHome),
      pageTitle: "Home Detail",
      currentPage: "Home",
      isLoggedIn: req.isLoggedIn,
      user: req.session.user,
    });
  }

  const home = await Home.findById(homeId);
  if (!home) return res.redirect('/homes');

  // Cache individual home for 10 minutes
  await redis.setex(cacheKey, 600, JSON.stringify(home));

  res.render('store/home-details', {
    home: home,
    pageTitle: "Home Detail",
    currentPage: "Home",
    isLoggedIn: req.isLoggedIn,
    user: req.session.user,
  });
};
