const { Schema } = require("mongoose");

const song = new Schema({
  title: {
    type: String,
    required: true
  },
  author: String,
  genre: String,
  rate: {
    type: Number,
    default: 0
  },
  file: {
    type: String,
    required: true
  },
  playlistId: Schema.Types.ObjectId
});

module.exports = song;