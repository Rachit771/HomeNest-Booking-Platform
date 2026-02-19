const Home = require("../Model/homes");
const Favourite=require("../Model/favourite")
const User=require("../Model/user");
exports.getIndex = (req, res) => {
  // Not logged in → show landing page
  if (!req.isLoggedIn) {
    return res.render("store/index", {
      registeredHomes:[],
      pageTitle: "airbnb Home",
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


exports.getHomes = (req, res, next) => {
  Home.find().then((registeredHomes) =>
    res.render("store/home-list", {
      registeredHomes: registeredHomes,
      pageTitle: "Homes List",
      currentPage: "Home",
      isLoggedIn:req.isLoggedIn,
      user: req.session.user,
    })
  );
};

exports.getBookings = (req, res, next) => {
  res.render("store/bookings", {
    pageTitle: "My Bookings",
    currentPage: "bookings",
    isLoggedIn:req.isLoggedIn,
    user: req.session.user,
  })
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


exports.getHomeDetails=(req,res,next)=>{
  const homeId=req.params.homeId;
  console.log('you are at ',homeId)
  Home.findById(homeId).then((home)=>{
  if(!home){
      res.redirect('/homes')
    }
  else{
    res.render('store/home-details',{
    home:home,
    pageTitle:"Home Detail",
    currentPage:"Home",
    isLoggedIn:req.isLoggedIn,
    user: req.session.user,
  })
}
 
  })
}
