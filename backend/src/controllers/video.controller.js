const httpStatus = require("http-status");
const catchAsync = require("../utils/catchAsync");
const { videoService } = require("../services/");

const getallVideos = catchAsync(async (req, res) => {
  console.log("inside getallVideos controller");
  videos = await videoService.getallVideos(req);
  res.status(200).send({videos:videos})
});


const getVideobyID = catchAsync(async (req, res) => {
  console.log("inside getVideobyID controller");
  console.log(req.params);
  videos = await videoService.getVideobyID(req.params.videoId);
  if (videos.length== null){
    res.status(404).json({message: "No video found with matching id"});
  }
  console.log(videos.releaseDate);
  console.log(typeof(videos.releaseDate));
  newdate = new Date(videos.releaseDate)
  console.log(newdate);
  console.log(typeof(newdate));
  res.send({videos});
});

const uploadVideo = catchAsync(async (req, res) => {
    console.log("inside uploadVideo controller");
    console.log(req.body);
    const result = await videoService.uploadVideo(req.body);
    // console.log(result);
    res.status(httpStatus.CREATED).send(result);
  });
  

const videcountVideo = catchAsync(async (req, res) => {
    // console.log("inside videcountVideo controller");
    // const result = await videoService.videcountVideo(req.params.videoid);
    
    // res.status(httpStatus.CREATED).send(result);


   await videoService.videcountVideo(
      req.params.videoId,
      req.body.vote,
      req.body.change
    );
    res.sendStatus(201);

  });

  
const votesVideo = catchAsync(async (req, res) => {
    console.log("inside votesVideo controller");
    // const result = await videoService.votesVideo(req);
    // res.status(httpStatus.CREATED).send(result);
    console.log("My id", req.params.videoId)
    const id = req.params.videoId;
    await videoService.votesVideo(id);
     res.sendStatus(204);
  });

  module.exports = {
    getallVideos,
    getVideobyID,
    uploadVideo,
    videcountVideo,
    votesVideo,
};
