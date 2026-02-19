// Core Module
const path = require('path');

// External Module
const express = require('express');
const cookieParser = require('cookie-parser');
const session = require('express-session');
const MongoStore = require('connect-mongo').default || require('connect-mongo'); //require('connect-mongo').default → picks the ES module default export if it exists|| require('connect-mongo') → fallback for CommonJS style (older versions or Node quirks)
const { connectRedis } = require('./config/redis');
const methodOverride = require('method-override');
// Local Module
const storeRouter = require("./routes/storeRouter");
const hostRouter = require("./routes/hostRouter");
const authRouter = require("./routes/authRouter");
const bookingRouter=require('./routes/bookingRoute')
const rootDir = require("./utils/pathutil");
const errorcontroller = require('./controllers/error');
const { connectDB, DB } = require('./config/db');

const app = express();

app.set('view engine', 'ejs');
app.set('views', 'views');

app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(rootDir, 'public')));
app.use(methodOverride('_method'));

app.use(session({
  secret: "Rachitxed",
  resave: false,
  saveUninitialized: true,
  store:MongoStore.create({
    mongoUrl: DB,
    collectionName: 'sessions'
})
}));
app.use((req, res, next) => {
  console.log("Incoming request:", req.method, req.url, "isLoggedIn=", req.session.isLoggedIn);
  next(); 
});

app.use((req, res, next) => {
  req.isLoggedIn = req.session.isLoggedIn;             //req.isLoggedIn = true
  next();
});

app.use(authRouter);
app.use(storeRouter);
app.use("/host", (req, res, next) => {
  if (req.isLoggedIn) next(); 
  else res.redirect("/login");
});
app.use("/bookings", (req, res, next) => {
  if (req.isLoggedIn) next();
  else res.redirect("/login");
});

app.use("/Book",bookingRouter);
app.use("/host", hostRouter);

app.use(errorcontroller.pageNotFound);

const PORT = 5000;

(async () => {
  await connectDB();
  app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
})();
