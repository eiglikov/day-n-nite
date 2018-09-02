var vid = document.getElementById('bgvid');
var title = document.getElementById('title');
var night = document.getElementById('night');
var button = document.getElementById('day-night-btn');


var myAudio2 = document.getElementById('myAudio2');
var myAudio4 = document.getElementById('myAudio4');

var vid = document.getElementById('bgvid');
vid.playbackRate = 0.75;

// get date
var date = new Date();
var hours = date.getHours();

// button copy
var nightCopy = 'Night';
var dayCopy = 'Day';

// change depending on time of the day
if (hours > 6 && hours < 21) {
  changeDayTime(dayCopy);
} else {
  changeDayTime(nightCopy);
}

// if (window.matchMedia('(prefers-reduced-motion)').matches) {
//   // vid.removeAttribute('autoplay');
//   // vid.pause();
//   button.innerHTML = nightCopy;
// }

function vidFade() {
  vid.classList.add('stopfade');
}

vid.addEventListener('ended', function() {
  // only functional if 'loop' is removed
  vid.pause();
  // to capture IE10
  vidFade();
});


title.addEventListener('click', function() {
  changeDayTime(button.innerHTML);
})

button.addEventListener('click', function() {
  changeDayTime(button.innerHTML);
})

function toggleLights() {
  vid.classList.toggle('stopfade');
  title.classList.toggle('button');
  button.classList.toggle('day-on');
}

function changeDayTime(daytime) {
  toggleLights();
  if (daytime == dayCopy) {
    myAudio2.play();
    myAudio4.pause();
    night.classList.toggle('flicker')
    button.innerHTML = nightCopy;
  } else {
    myAudio2.pause();
    myAudio4.play();
    night.classList.toggle('flicker')
    button.innerHTML = dayCopy;
  }
}




// time
function startTime() {
  var today = new Date();
  var h = today.getHours();
  var m = today.getMinutes();
  var s = today.getSeconds();
  m = checkTime(m);
  s = checkTime(s);

  var dn="am" 
  if (h > 12){
    dn="pm"
    h = h - 12
  }
  if (h == 0)
    h = 12

  document.getElementById('clock').innerHTML =
  h + ":" + m + ":" + s + " " + dn;
  var t = setTimeout(startTime, 500);
}
function checkTime(i) {
  if (i < 10) {i = "0" + i};  // add zero in front of numbers < 10
  return i;
}

