/**
* Audio fade in support
*/

// jslint hints
/*global window, define, console, jQuery, document, setTimeout */
"use strict";

var krusovice = {};
krusovice.tools = {};

/**
 * Start audio playing with fade in period.
 *
 * Equals to audio.play() but with smooth volume in.
 *
 * @param {Object} audio HTML5 audio element
 *
 * @param {Number} (optional) rampTime How long is the fade in ms
 *
 * @param {Number} targetVolume Max volume. 1 = default = HTML5 audio max.
 *
 * @param {Number} tick Timer period in ms
 *
 */
krusovice.tools.fadeIn = function(audio, rampTime, targetVolume, tick) {
    //
    if(!targetVolume) {
        targetVolume = 1;
    }

    // By default, ramp up in one second
    if(!rampTime) {
        rampTime = 1000;
    }

    // How often adjust audio volume (ms)
    if(!tick) {
        tick = 50;
    }

    var volumeIncrease = targetVolume / (rampTime / tick);

    var playingEventHandler = null;

    function ramp() {

        var vol = Math.min(targetVolume, audio.volume + volumeIncrease);

        audio.volume = vol;

         // Have we reached target volume level yet?
        if(audio.volume < targetVolume) {
            // Keep up going until 11
            setTimeout(ramp, tick);
        }
    }

    function startRampUp() {

        // For now, we capture only the first playing event
        // as we assume the user calls fadeIn()
        // every time when wants to resume playback
        audio.removeEventListener("playing", playingEventHandler);

        ramp();
    }

    // Start with zero audio level
    audio.volume = 0;

    // Start volume ramp up when the audio actually stars to play (not when begins to buffer, etc.)
    audio.addEventListener("playing", startRampUp);

    audio.play();
};


/**
 * Stop audio playing with fade out period.
 *
 * Equals to audio.pause() but with smooth volume out.
 *
 * @param {Object} audio HTML5 audio element
 *
 * @param {Number} (optional) rampTime How long is the fade in ms
 *
 * @param {Number} targetVolume Min volume. 0 = default = HTML5 audio min.
 *
 * @param {Number} tick Timer period in ms
 *
 */
krusovice.tools.fadeOut = function(audio, rampTime, targetVolume, tick) {

    var orignalVolume = audio.volume;

    //
    if(!targetVolume) {
        targetVolume = 0;
    }

    // By default, ramp up in one second
    if(!rampTime) {
        rampTime = 1000;
    }

    // How often adjust audio volume (ms)
    if(!tick) {
        tick = 50;
    }

    var volumeStep = (audio.volume - targetVolume) / (rampTime / tick);

    if(!volumeStep) {
        // Volume already at 0
        return;
    }

    function ramp() {

        var vol = Math.max(0, audio.volume - volumeStep);

        audio.volume = vol;

        // Have we reached target volume level yet?
        if(audio.volume > targetVolume) {
            // Keep up going until 11
            setTimeout(ramp, tick);
        } else {
            audio.pause();

            // Reset audio volume so audio can be played again
            audio.volume = orignalVolume;
        }
    }

    ramp();
};

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