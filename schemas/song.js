const { Schema } = require("mongoose");

const song = new Schema({
  title: {
    type: String,
    required: true
  },
  author: {
    type: String,
    required: true
  },
  genre: {
    type: String,
    required: true
  },
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
    required: true
  }
});

module.exports = song;