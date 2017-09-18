"use strict";
;(function() {
  const $form = document.getElementById("add-playlist");
  const $plTitle = document.querySelector("[name='pl-title']");
  const $plDescription = document.querySelector("[name='pl-description']");
  const $plCover = document.querySelector("[name='cover-url']");
  const $loadPreview = document.getElementById("load-preview");
  const $fileCover = document.querySelector(".cover[type=file]");
  const $previewTypes = Array.from(document.querySelectorAll(".preview-source [type=radio]"));
  const $previewContainer = document.querySelector(".cover-preview");

  $form.addEventListener("submit", createPlaylist);
  $loadPreview.addEventListener("click", loadPreview);
  $fileCover.addEventListener("change", onSelectImage);

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
      // body: JSON.stringify({ plTitle, plDescription, coverUrl }),
      body: new FormData($form),
      // headers: {
      //   // "content-type": "application/json"
      //   "content-type": "multipart/form-data"
      // }
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

  function loadPreview() {
    const previewSrc = $plCover.value.trim();

    if(!previewSrc) return;

    renderPreview(previewSrc);
  }

  function onSelectImage(ev) {
    console.log(ev);
    const file = ev.target.files[0];
    const fileUrl = URL.createObjectURL(file);

    renderPreview(fileUrl);
  }

  function renderPreview(url) {
    $previewContainer.style = `background: url(${url}) top center / cover no-repeat;`;

    return $previewContainer;
  }

  $previewTypes.forEach($previewType => {
    $previewType.addEventListener("change", clearSources);
  });


  function clearSources() {
    $fileCover.value = "";
    $plCover.value = "";
    $previewContainer.style = "";
  }
})();