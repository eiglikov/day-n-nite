var vid = document.getElementById('bgvid');
var title = document.getElementById('title');
var night = document.getElementById('night');
var dayTimeButton = document.getElementById('day-night-btn');
var playStopButton = document.getElementById('play-stop-button');

var nightMusic = document.getElementById('nightMusic');
var dayMusic = document.getElementById('dayMusic');

var vid = document.getElementById('bgvid');
vid.playbackRate = 0.7;

// get date
var date = new Date();
var hours = date.getHours();

// dayTimeButton copy
var nightCopy = 'Night';
var dayCopy = 'Day';

// play/stop button copy
var stopButtonCopy = '&#10074;&#10074;';
var playButtonCopy = '&#9658;';

// change depending on time of the day
// console.log('hours', hours)
// if (hours > 6 && hours < 21) {
changeDayTime(nightCopy);
// } else {
//   changeDayTime(dayCopy);
// }


title.addEventListener('click', function() {
  changeDayTime(dayTimeButton.innerHTML);
})
dayTimeButton.addEventListener('click', function() {
  changeDayTime(dayTimeButton.innerHTML);
})

function toggleLights() {
  // if (dayTimeButton.innerHTML === dayCopy) {
    // console.log("It's still bright outside");
    vid.classList.toggle('stopfade');
    title.classList.toggle('neon-glow');
    dayTimeButton.classList.toggle('day-on');
    night.classList.toggle('flicker');
  // }
}

function changeDayTime(daytime) {
  toggleLights();
  playStopButton.innerHTML = stopButtonCopy;
  if (daytime === nightCopy) {
    krusovice.tools.fadeOut(dayMusic, 2000);
    krusovice.tools.fadeIn(nightMusic, 3000);
    dayTimeButton.innerHTML = dayCopy;
  } else {
    krusovice.tools.fadeOut(nightMusic, 3000);
    krusovice.tools.fadeIn(dayMusic, 2000);

    dayTimeButton.innerHTML = nightCopy;
  }
}




// clock
function startTime() {
  var today = new Date();
  var h = today.getHours();
  var m = today.getMinutes();
  var s = today.getSeconds();
  m = checkTime(m);
  s = checkTime(s);

  // var dn="am" 
  // if (h > 12){
  //   dn="pm"
  //   h = h - 12
  // }
  // if (h == 0)
  //   h = 12

  document.getElementById('clock').innerHTML =
  h + ":" + m + ":" + s;
  var t = setTimeout(startTime, 500);
}
function checkTime(i) {
  if (i < 10) {i = "0" + i};  // add zero in front of numbers < 10
  return i;
}



// workaround for chrome to start autoplay
function eventFire(el, etype){
  if (el.fireEvent) {
    el.fireEvent('on' + etype);
  } else {
    var evObj = document.createEvent('Events');
    evObj.initEvent(etype, true, false);
    el.dispatchEvent(evObj);
  }
}
setTimeout(eventFire(document.getElementById('clock'), 'click'), 5000)

function aud_play_pause() {
  // if any music playing - turn off
  if (!dayMusic.paused || !nightMusic.paused) {
    console.log('stop music')
    krusovice.tools.fadeOut(dayMusic, 500);
    krusovice.tools.fadeOut(nightMusic, 500);
    playStopButton.innerHTML = playButtonCopy;
    return;
  }

  // if nothing plays - turn on the music that suppose to be playing
  if (dayTimeButton.innerHTML === nightCopy) {
    console.log('continue dayMusic')
    krusovice.tools.fadeIn(dayMusic, 1000);
    krusovice.tools.fadeOut(nightMusic, 1000);
  } else {
    console.log('continue nightMusic')
    krusovice.tools.fadeIn(nightMusic, 1000);
    krusovice.tools.fadeOut(dayMusic, 1000);
  }
  playStopButton.innerHTML = stopButtonCopy;
}