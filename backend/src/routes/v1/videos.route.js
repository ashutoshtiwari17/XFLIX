const express = require("express");
const validate = require("../../middlewares/validate");
const videoValidation = require("../../validations/video.validation");
const { videoController } = require("../../controllers/");
// const auth = require("../../middlewares/auth");
const router = express.Router();
const videoidMiddleware = validate(videoValidation.getVideo); 
const uploadMiddleware = validate(videoValidation.upload); 


router.get("/", videoController.getallVideos);
router.patch("/:videoId/views", videoidMiddleware, videoController.videcountVideo);
router.patch("/:videoId/votes", videoidMiddleware, videoController.votesVideo);
router.get("/:videoId", videoController.getVideobyID);
router.post("/", videoController.uploadVideo);

module.exports = router;
