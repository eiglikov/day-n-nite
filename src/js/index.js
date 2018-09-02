var vid = document.getElementById("bgvid");
var title = document.getElementById("title");

var pauseButton = document.querySelector("#polina button");
var myAudio1 = document.getElementById("myAudio1");
var myAudio2 = document.getElementById("myAudio2");
var myAudio3 = document.getElementById("myAudio3");
var myAudio4 = document.getElementById("myAudio4");

if (window.matchMedia('(prefers-reduced-motion)').matches) {
  // vid.removeAttribute("autoplay");
  // vid.pause();
  pauseButton.innerHTML = "Night";
}

function vidFade() {
  vid.classList.add("stopfade");
}

vid.addEventListener('ended', function()
{
  // only functional if "loop" is removed
  vid.pause();
  // to capture IE10
  vidFade();
});


pauseButton.addEventListener("click", function() {
  vid.classList.toggle("stopfade");
  title.classList.toggle("button");

  if (pauseButton.innerHTML == "Night") {

    // vid.play();
    myAudio1.play();
    myAudio2.pause();
    pauseButton.innerHTML = "Day";
  } else {
    // vid.pause();
    myAudio1.pause();
    myAudio2.play();
    pauseButton.innerHTML = "Night";
  }
})

myAudio1.play();

// if (myAudio1.paused) {
//   myAudio1.play();
//   myAudio2.pause();
// } else {
//   myAudio1.pause();
//   myAudio2.play();
// }
