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
var button = document.getElementById('day-night-btn');


var myAudio2 = document.getElementById('myAudio2');
var myAudio4 = document.getElementById('myAudio4');

var vid = document.getElementById('bgvid');
vid.playbackRate = 0.7;

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
  night.classList.toggle('flicker');
}

function changeDayTime(daytime) {
  toggleLights();
  if (daytime == dayCopy) {
    // myAudio2.play();
    // myAudio4.pause();
    krusovice.tools.fadeOut(myAudio4, 2000);
    krusovice.tools.fadeIn(myAudio2, 3000);

    button.innerHTML = nightCopy;
  } else {
    // myAudio2.pause();
    // myAudio4.play();
    krusovice.tools.fadeOut(myAudio2, 3000);
    krusovice.tools.fadeIn(myAudio4, 2000);

    button.innerHTML = dayCopy;
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

  var dn="am" 
  if (h > 12){
    dn="pm"
    h = h - 12
  }
  if (h == 0)
    h = 12

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


// audio fade in/out
function getSoundAndFadeAudio(soundObject) {

  // Set the point in playback that fadeout begins. This is for a 2 second fade out.
  var fadePoint = soundObject.duration - 2; 

  var fadeAudio = setInterval(function () {

      // Only fade if past the fade out point or not at zero already
      if ((soundObject.currentTime >= fadePoint) && (soundObject.volume != 0.0)) {
          soundObject.volume -= 0.1;
      }
      // When volume at zero stop all the intervalling
      if (soundObject.volume === 0.0) {
          clearInterval(fadeAudio);
      }
  }, 200);

}
