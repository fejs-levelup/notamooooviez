"use strict";
;(function() {
  const $form = document.getElementById("add-playlist");
  const $plTitle = document.querySelector("[name='pl-title']");
  const $plDescription = document.querySelector("[name='pl-description']");
  const $plCover = document.querySelector("[name='cover-url']");

  $form.addEventListener("submit", createPlaylist);

  function createPlaylist(ev) {
    ev.preventDefault();

    $plTitle.parentElement.classList.remove("invalid");
    $plDescription.parentElement.classList.remove("invalid");

    const plTitle = $plTitle.value.trim();
    const plDescription = $plDescription.value.trim();
    const coverUrl = $plCover.value.trim() || null;

    if(!plTitle) {
      return $plTitle.parentElement.classList.add("invalid");
    }

    if(!plDescription) {
      return $plDescription.parentElement.classList.add("invalid");
    }

    fetch("/playlist", {
      method: "POST",
      body: JSON.stringify({ plTitle, plDescription, coverUrl }),
      headers: {
        "content-type": "application/json"
      }
    })
    .then(res => {
      console.log(res);

      $plTitle.value = "";
      $plDescription.value = "";
      $plCover.value = "";
    })
    .catch(err => {
      console.error(err);
    });
  }
})();