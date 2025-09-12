/* find the elements i want to interact with */
const videoElement = document.querySelector("#mediaPlayer");
const playPauseButton = document.querySelector("#playPauseButton");
const timeLine = document.querySelector("#timelineProgress");

/* when JS loads remove default controls 비디오 자체에 뜨는 디폴트 컨트롤 없애야함 */
videoElement.removeAttribute("controls");

/* 
Olay/pause button behaviour:
if media is not playiing - when I click it bigins the playback of the media file
if media is playing - when I clock again it pauses the playback of the media file
Feedback:
toggle con based on playing tate
cursor change on hover
*/

function playPause() {
  if (videoElement.paused || videoElement.ended) {
    videoElement.play();
    playPauseButton.textContent = "⏸";
  } else {
    videoElement.pause();
    playPauseButton.textContent = "▶";
  }
}
playPauseButton.addEventListener("click", playPause);

/*
Timeline behaviour:
it should update as media playback occurs to show current time
i should be able to click and jumo to particular time
*/

function updateTimeline() {
  console.log(videoElement.currentTime);
  let timePercent = (videoElement.currentTime / videoElement.duration) * 100;
  //console.log(timePercent);
  timeLine.value = 0;
}

videoElement.addEventListener("timeupdate", updateTimeline);
