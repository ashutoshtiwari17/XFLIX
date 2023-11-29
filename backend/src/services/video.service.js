const httpStatus = require("http-status");
const { Video } = require("../models/");
const ApiError = require("../utils/ApiError");
const config = require("../config/config");
const { string } = require("joi");


const getallVideos = async (req) => {
    console.log("inside getallVideos service")
    if (req.query.sortBy){
        
        return await getallVideosSorted(req.query.sortBy);
    }
    if (req.query.title || req.query.genres || req.query.contentRating){
        console.log("it has query parameters")
        return await getallVideosbyfilter(req.query);
    }
    
    return await getallVideosSorted('releaseDate');
};

const getallVideosSorted = async (criteria) => {
    console.log("inside getallVideosSorted service");

    sortbyList = ['viewCount', 'releaseDate'];
    let sortinglist = []
    if (typeof(criteria)==='string' ){
        sortinglist = criteria.split(',');
    }
    for (let i=0; i<sortinglist.length; i++){
        if (sortbyList.indexOf(sortinglist[i])===-1){
            throw new ApiError(httpStatus.BAD_REQUEST, "must be one of [viewCount, releaseDate]");
        }
    }
    if (criteria==='viewCount'){
        console.log("criteria", criteria);
        result = await Video.find({}).sort({[criteria]: -1});
    }
    if (criteria==='releaseDate'){
        console.log("criteria", criteria);
        result = await Video.find({});
        result.sort(function (a, b) {
            return parseDate(b.releaseDate) - parseDate(a.releaseDate);
   });
    }
    return result;
};

const GetDate = (jso) => {
    var arr = jso.releaseDate.split(" ");
    console.log(arr);
    var months = ["jan", "feb", "mar", "apr", "may", "jun", "jul", "aug", "sep", "oct", "nov", "dec"];
    var month = months.indexOf(arr[1].toLowerCase());
    xx = new Date(parseInt(arr[2]), month, parseInt(arr[0]));
    console.log(xx);
    jso.releaseDate = xx;
    return jso;
  }

const parseDate = (s) => {
    let months = {
      jan: 0,
      feb: 1,
      mar: 2,
      apr: 3,
      may: 4,
      jun: 5,
      jul: 6,
      aug: 7,
      sep: 8,
      oct: 9,
      nov: 10,
      dec: 11,
    };
    let p = s.split(" ");
    return new Date(p[2], months[p[1].toLowerCase()], p[0]);
  }

const getallVideosbyfilter = async (query) => {
    console.log("inside getallVideosbyfilter service")
    console.log(query);
    const genreList = ['Education', 'Sports', 'Movies', 'Comedy', 'Lifestyle', 'All'];
    const genreListAll = ['Education', 'Sports', 'Movies', 'Comedy', 'Lifestyle']
    // must be one of [Anyone, 7+, 12+, 16+, 18+, All]
    contentRatingList = ['Anyone', '7+', '12+', '16+', '18+']
    if (typeof(query.genres)==='string' ){
        query.genres = query.genres.split(',');
    }
    if (query.genres){
        console.log("Inside the loop to check for accepted genre");
        for (let i=0; i<query.genres.length; i++){
            if (genreList.indexOf(query.genres[i])===-1){
                throw new ApiError(httpStatus.BAD_REQUEST, "must be one of [Education, Sports, Movies, Comedy, Lifestyle, All]");
            }
        }
    }
    if (query.genres){
    if (query.genres.includes('All')){
        query.genres = genreListAll.slice();
    }}
    if (typeof(query.contentRating)==='string' ){
        console.log("Inside the loop to check for accepted contentRatings");
        // const contentratingIndex = contentRatingList.indexOf(query.contentRating);
        // var possiblecontentRatings = contentRatingList.splice(0, contentratingIndex+1);
        // console.log(possiblecontentRatings);
        var possiblecontentRatings = query.contentRating.split(',');
    }
    if (query.contentRating){
        if (query.contentRating.includes('All')){
            query.contentRating = contentRatingList.slice();
    }}
    console.log("Genre: ",query.genres);
    searchTitle = '(.*)' + query.title + '(.*)'
    console.log("Content Rating: ",possiblecontentRatings);
    console.log("Title Search: ",searchTitle);
    if (query.contentRating && !query.genres && !query.title){
        console.log("We have Content Rating Only")
        result = await Video.find({contentRating: {$in: possiblecontentRatings}});
        result.sort(function (a, b) {
            return parseDate(b.releaseDate) - parseDate(a.releaseDate);
            });
    }
    if (query.genres && !query.title && !query.contentRating){
        console.log("We have Genre Only")
        result = await Video.find({genre: {$in: query.genres}});
        result.sort(function (a, b) {
            return parseDate(b.releaseDate) - parseDate(a.releaseDate);
            });
    }
    if (!query.genres && query.title && !query.contentRating){
        console.log("We have Title Only")
        result = await Video.find({title: { $regex: searchTitle, $options: 'i' }});
        result.sort(function (a, b) {
            return parseDate(b.releaseDate) - parseDate(a.releaseDate);
            });
    }
    if (query.genres && query.title && !query.contentRating){
        console.log("We have Genre and Title both")
        result = await Video.find({$and:[{genre: {$in: query.genre}}, {title: { $regex: searchTitle, $options: 'i' }}]});
        result.sort(function (a, b) {
            return parseDate(b.releaseDate) - parseDate(a.releaseDate);
            });
    }
    
    if (query.genres && !query.title && query.contentRating){
        console.log("We have Genre and ContentRating both")
        result = await Video.find({$and:[{genre: {$in: query.genres}}, {contentRating: {$in: possiblecontentRatings}}]});
        result.sort(function (a, b) {
            return parseDate(b.releaseDate) - parseDate(a.releaseDate);
            });
    }
    if (!query.genres && query.title && query.contentRating){
        console.log("We have Title and ContentRating both")
        result = await Video.find({$and:[{contentRating: {$in: possiblecontentRatings}}, {title: { $regex: searchTitle, $options: 'i' }}]});
        result.sort(function (a, b) {
            return parseDate(b.releaseDate) - parseDate(a.releaseDate);
            });
    }
    if (query.genres && query.title && query.contentRating){
        console.log("We have All 3")
        result = await Video.find({$and:[{genre: {$in: query.genres}}, {contentRating: {$in: possiblecontentRatings}}, {title: { $regex: searchTitle, $options: 'i' }}]});
        result.sort(function (a, b) {
            return parseDate(b.releaseDate) - parseDate(a.releaseDate);
            });
    }

    return result;
};

const getVideobyID = async (videoid) => {
    console.log("inside getallVideos service");
    console.log(videoid);
    return await Video.find({_id: videoid});
};



const uploadVideo = async(video) => {
    try{
        console.log("Inside uploadVideo service");
        console.log(video);
        const { videoLink, title, genre, contentRating, releaseDate, previewImage } = video;
        if (await Video.isvideolinkTaken(videoLink)){
            throw new ApiError(httpStatus.OK, "VideoLink already taken");
          } 
        const result = await Video.create({videoLink: videoLink, 
            title: title, genre: genre, contentRating: contentRating, 
            releaseDate: releaseDate, previewImage: previewImage});
        return result;
    }catch(error){
        throw error;
    }
};

// const videcountVideo = async (videoid)
const videcountVideo = async (videoId, typeofvote, change) => {
    // console.log("inside videcountVideo service");
    // console.log("view video id", videoid);
    // let videos = await Video.findOne({_id: videoid});
    // if (videos.length===0){
    //     throw new ApiError(httpStatus.NOT_FOUND, "No video found with matching id");
    //   }
    //   console.log("VideoCount", videos)
    // videos.viewCount = videos.viewCount + 1;
    // await videos.save();
    // console.log("After update", videos)
    // return 

    const video = await Video.findById(videoId);
    if (!video) {
      throw new ApiError(
        httpStatus.NOT_FOUND,
        "Video not found with matching Id"
      );
    }
  
    if (change == "increase") {
      if (typeofvote == "downVote") {
        video.votes.downVotes += 1;
      } else if (typeofvote == "upVote") {
        video.votes.upVotes += 1;
      }
    } else {
      if (typeofvote == "downVote") {
        video.votes.downVotes -= 1;
      } else if (typeofvote == "upVote") {
        video.votes.upVotes -= 1;
      }
    }
 await video.save();
    return ;
};


const votesVideo = async (id) => {
    // console.log("inside votesVideo service");
    // console.log("checking id",req.params.videoId)
    // videos = await Video.findOne({_id: req.params.videoId});
    // console.log("video data checking", videos)
    // if (videos==null){
    //     throw new ApiError(httpStatus.NOT_FOUND, "No video found with matching id");
    //   }
    // if (req.body.vote==='downVote' && req.body.change==='increase'){
    //     // console.log("downVote increase", videos[0]);

    //     videos.votes.downVotes = videos.votes.downVotes + 1;
    // }
    // if (req.body.vote==='downVote' && req.body.change==='decrease'){
    //     console.log("downVote decrease");
    //     videos.votes.downVotes = videos.votes.downVotes - 1;
    // }
    // if (req.body.vote==='upVote' && req.body.change==='increase'){
    //     console.log("upVote increase");
    //     videos.votes.upVotes = videos.votes.upVotes + 1;
    // }
    // if (req.body.vote==='upVote' && req.body.change==='decrease'){
    //     console.log("upVote decrease");
    //     videos.votes.upVotes = videos.votes.upVotes - 1;
    // }
    // return await videos.save();

    const video = await Video.findById(id);
    if (!video) {
      throw new ApiError(
        httpStatus.NOT_FOUND,
        "Video not found with matching Id"
      );
    }
    video.viewCount += 1;
    await video.save();
    return;
};

module.exports = {
  getallVideos,
  getallVideosSorted,
  getVideobyID,
  uploadVideo,
  videcountVideo,
  votesVideo,
};
