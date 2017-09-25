class Genres {
  constructor() {
    this.list = [
      "rock",
      "hiphop",
      "pop",
      "jazz",
      "alternative"
    ];
  }

  add(genre) {
    if(typeof genre !== "string" || !genre.trim().length)
      return;

    this.list.push(genre);
  }
}

module.exports = new Genres();
