const Joi = require("joi");
const { objectId } = require("./custom.validaton");

const upload = {
  body:Joi.object().keys({
    videoLink:Joi.string().required(),
    title:Joi.string().required(),
    genre:Joi.string().required(),
    contentRating:Joi.string().required(),
    releaseDate:Joi.string().required(),
    previewImage:Joi.string().required(),
    viewCount: Joi.number(),
  })
};

const getVideo = {
  params: Joi.object().keys({
    videoId:Joi.string().custom(objectId)
  }),
};

module.exports = {
  getVideo,
  upload,
};
