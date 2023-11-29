const express = require("express");
const videosRoute = require("./videos.route");

const router = express.Router();


router.use("/videos", videosRoute);

module.exports = router;
