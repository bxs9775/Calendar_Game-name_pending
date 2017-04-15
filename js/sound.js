//sound.js adapted from sound.js in the Boomshine project
"use strict";

var app = app || {};

app.sound = function(){
    var bgAudio = undefined;
    var effectAudio = undefined;
    var EFFECTS = Object.freeze({
        SELECT: "btn402.mp3",
        DROP: "hint.wav",
        DROP_SUCCESS: "buttonchime02up.wav",
        END_ROUND: "bronzebell1.wav"
    });
    
    //Initializes the audio control elements
    //From the Boomshine project
    function setup(){
		bgAudio = document.querySelector("#bgAudio");
		bgAudio.volume=0.25;
		effectAudio = document.querySelector("#effectAudio");
		effectAudio.volume = 0.3;
	}
    
    //Plays the background music
    //From the Boomshine project
    function playBGAudio(){
        bgAudio.play();
    }
    
    //Stops the background music
    //From the Boomshine project
	function stopBGAudio(){
		bgAudio.pause();
		bgAudio.currentTime = 0;
	}
	
    //Plays an audio effect
    //Adapted from the Boomshine project
    //Params:
    //  effect: the name of the sound file that will be played
	function playEffect(effect){
		effectAudio.src = "media/audio/" + effect;
		effectAudio.play();
	}
    
    //Allows certain methods and values to be accessed by other files
    return {
        setup: setup,
        playBGAudio: playBGAudio,
        stopBGAudio: stopBGAudio,
        playEffect: playEffect,
        EFFECTS: EFFECTS
    }
}();