const { Schema } = require("mongoose");

const nav = new Schema({
  title: {
    type: String,
    required: true
  },
  url: {
    type: String,
    required: true
  }
});

module.exports = nav;
