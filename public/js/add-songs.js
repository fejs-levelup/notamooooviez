"use strict";

(function() {
  var fileList = [];
  var songId = 0;
  var genres = [],
      playlists = [];
  const $fileSelector = document.getElementById("file-selector");
  const $songs = document.getElementById("songs");
  const $dialog = document.getElementById("edit-song");
  const $dialogForm = $dialog.querySelector("form");
  const $saveDialog = $dialog.querySelector(".confirm-dialog");
  const $cancelDialog = $dialog.querySelector(".close-dialog");

  $fileSelector.addEventListener("change", onFileSelectorChanged);
  $saveDialog.addEventListener("click", ev => {
    const { songId } = $dialog.dataset;
    const file = fileList.find(_file => _file.id === +songId);

    if(!file) return;

    const $title = $dialog.querySelector("[name='title']");
    const $author = $dialog.querySelector("[name='author']");

    file.title = $title.value;
    file.author = $author.value;

    $author.value = "";
    $dialog.close();
  });

  class Song {
    constructor(file) {
      this.__id = songId++;
      this.__title = file.name;
      this.__author = "";
      this.__genre = "";
      this.__playlistId = "";
      this.file = file;
    }

    get id() { return this.__id; }

    get title() { return this.__title; }
    set title(value) {
      this.__title = value;

      document
        .querySelector(`[data-song-id="${this.__id}"] .song-title`)
        .textContent = value;

      return value;
    }

    get author() { return this.__author; }
    set author(value) {
      this.__author = value;

      document
        .querySelector(`[data-song-id="${this.__id}"] .song-author`)
        .textContent = value;

      return value;
    }

    get genre() { return this.__genre; }
    set genre(value) {
      this.__genre = value;

      document
        .querySelector(`[data-song-id="${this.__id}"] .song-genre`)
        .textContent = value;

      return value;
    }

    get playlistId() { return this.__playlistId; }
    set playlistId(value) {
      this.__playlistId = value;

      document
        .querySelector(`[data-song-id=${this.__id}] .song-playlist`)
        .textContent = value;

      return value;
    }
  }

  function onFileSelectorChanged(ev) {
    const files = Array
      .from(ev.target.files)
      .map(file => new Song(file));

    fileList = [
      ...files,
      ...fileList
    ];

    renderFiles(files)
      .forEach(setListeners);
  }

  function setListeners(file) {
    $songs
      .querySelector(`[data-song-id="${file.id}"] button`)
      .addEventListener("click", ev => {
        console.log(file);

        $dialog.dataset.songId = file.id;
        $dialog.showModal();
      });
  }

  function renderFiles(files) {
    // add files to DOM
    console.log(files);

    files.forEach(file => {
      const div = document.createElement("div");

      div.dataset.songId = file.id;

      const divContent = `
        <input type="checkbox" title="select song">
        <span class="song-title">${file.title}</span>
        <span class="song-author">${file.author}</span>
        <span class="song-genre">${file.genre}</span>
        <span class="song-playlist">${file.playlistId}</span>
        <button>🖋 Edit</button>
      `;

      div.innerHTML = divContent;

      $songs.appendChild(div);
    });

    return files;
  }

  fetch("/genres", {
    headers: {
      "content-type": "application/json"
    },
    credentials: "include"
  })
    .then(res => res.json())
    .then(res => {
      var $select = document.createElement("select");

      $select.name = "genre";

      res.genres.forEach(genre => {
        const $option = document.createElement("option");

        $option.value = genre;
        $option.textContent = genre;
        $select.appendChild($option);
      });

      $dialogForm.appendChild($select);
    })
    .catch(err => console.error("FETCHING GENRES:", err));

  fetch("/all-playlist", {
    headers: {
      "content-type": "application/json"
    },
    credentials: "include"
  })
    .then(res => res.json())
    .then(res => {
      var $select = document.createElement("select");

      $select.name = "playlist";

      res.playlists.forEach(({ id, title }) => {
        const $option = document.createElement("option");

        $option.value = id;
        $option.textContent = title;
        $select.appendChild($option);
      });

      $dialogForm.appendChild($select);
    })
    .catch(err => console.error("FETCHING PLAYLISTS:", err));
})();











