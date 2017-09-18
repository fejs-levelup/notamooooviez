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
  const $fileContainer = document.querySelector(".file-container");

  $fileContainer.addEventListener("dragover", onDragOver);
  $fileContainer.addEventListener("drop", onDrop);
  $fileContainer.addEventListener("dragend", removeHovered);
  $fileContainer.addEventListener("dragleave", removeHovered);

  $form.addEventListener("submit", createPlaylist);
  $loadPreview.addEventListener("click", loadPreview);
  $fileCover.addEventListener("change", onSelectImage);

  let playlistCover = null;

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

    const formData = new FormData();

    formData.append("pl-title", plTitle);
    formData.append("pl-description", plDescription);

    const selectedCoverType = $previewTypes.find(radio => radio.checked);

    formData.append("cover-type", selectedCoverType.value);

    switch(selectedCoverType.value) {
      case "url":
        formData.append("cover-url", coverUrl);
        break;
      case "file":
        if(!playlistCover) return;

        formData.append("cover-file", playlistCover, playlistCover.name);
        break;
    }

    fetch("/playlist", {
      method: "POST",
      body: formData
    })
    .then(res => {
      console.log(res);

      $plTitle.value = "";
      $plDescription.value = "";
      $plCover.value = "";
      playlistCover = null;
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

    playlistCover = file;

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
    playlistCover = null;
  }

  function onDragOver(ev) {
    ev.preventDefault();

    $fileContainer.classList.add("hovered");
  }

  function onDrop(ev) {
    ev.preventDefault();
    $fileContainer.classList.remove("hovered");

    const file = ev.dataTransfer.files[0];
    const fileUrl = URL.createObjectURL(file);

    playlistCover = file;

    renderPreview(fileUrl);
  }

  function removeHovered(ev) {
    ev.preventDefault();

    $fileContainer.classList.remove("hovered");
  }
})();













