// const { Number } = require("core-js/shim");
const mongoose = require("mongoose");
// NOTE - "validator" external library and not the custom middleware at src/middlewares/validate.js
const validator = require("validator");
const config = require("../config/config");
const bcrypt = require("bcryptjs");

const videoSchema = mongoose.Schema({
  videoLink: {
    type: String,
  },
  title: { type: String },
  genre: { type: String },
  contentRating: {
    type: String,
  },
  releaseDate:{
    type: String,
  },
  previewImage: {
    type:String,
  },
  viewCount: {
    type: Number, 
    default: 0
  },
  votes:{
    type: {
        upVotes: {
            type: Number,
            default: 0,
        },
        downVotes: {
            type: Number,
            default: 0,
        }
    },
    default: {
        upVotes: 0,
        downVotes: 0,
    },
    _id: false,
  }

});

videoSchema.statics.isvideolinkTaken = async function (videoLink) {
  result = await this.find({ videoLink });
  // console.log("Inside isEmailTaken static function", result);
  if (result.length === 0) {
    return false;
  } else {
    return true;
  }
};

const Video = mongoose.model("video", videoSchema);

module.exports = { Video };
