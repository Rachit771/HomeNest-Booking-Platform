// Core Module
const path = require('path');

// External Module
const express = require('express');
const cookieParser = require('cookie-parser');
const session = require('express-session');
const MongoDBStore = require('connect-mongodb-session')(session);

// Local Module
const storeRouter = require("./routes/storeRouter");
const hostRouter = require("./routes/hostRouter");
const authRouter = require("./routes/authRouter");
const rootDir = require("./utils/pathutil");
const errorcontroller = require('./controllers/error');
const { connectDB, DB } = require('./config/db');

const app = express();

app.set('view engine', 'ejs');
app.set('views', 'views');

app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(rootDir, 'public')));

// session store
const store = new MongoDBStore({
  uri: DB,
  collection: 'sessions'
});

app.use(session({
  secret: "Rachitxed",
  resave: false,
  saveUninitialized: true,
  store
}));

app.use((req, res, next) => {
  req.isLoggedIn = req.session.isLoggedIn;
  next();
});

app.use(authRouter);
app.use(storeRouter);

app.use("/host", (req, res, next) => {
  if (req.isLoggedIn) next();
  else res.redirect("/login");
});

app.use("/host", hostRouter);

app.use(errorcontroller.pageNotFound);

const PORT = 5000;

(async () => {
  await connectDB();
  app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
})();
