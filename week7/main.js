const popButton = document.querySelector("#popButton");
const popAudio = document.querySelector("#popAudio");

/* This is a function, that plays the popping sound */
function playPop() {
  popAudio.play();
}

/*run playPop function when user clicks on the button */
popButton.addEventListener("click", playPop);
