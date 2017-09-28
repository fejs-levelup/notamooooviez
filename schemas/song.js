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
  playlistId: {
    type: Schema.Types.ObjectId,
    ref: "Playlist"
  }
});

module.exports = song;