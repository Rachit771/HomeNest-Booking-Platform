// External Module
const express = require("express");
const hostRouter = express.Router();
const upload=require("../config/multer")
// Local Module
const hostController = require("../controllers/hostController");

hostRouter.get("/add-home", hostController.getAddHome);
hostRouter.post(
  "/add-home",
  upload.single("image"),   
  hostController.postAddHome
);
hostRouter.get("/host-home-list", hostController.getHostHomes);
hostRouter.get("/edit-home/:homeId",hostController.getEditHome);
hostRouter.post(
  "/edit-home",
  upload.single("image"),   
  hostController.postEditHome
);
hostRouter.post("/delete-home/:homeId",hostController.postDeleteHome)
module.exports = hostRouter;
