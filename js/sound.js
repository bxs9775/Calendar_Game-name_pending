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
    var MAX_VOLUMES = Object.freeze({
        BACKGROUND: 0.75,
        EFFECT: 0.9
    });
    var masterVolume = 0.33;
    
    var drawAlpha = 0;
    
    
    //Initializes the audio control elements
    //From the Boomshine project
    function setup(){
		bgAudio = document.querySelector("#bgAudio");
		bgAudio.volume = MAX_VOLUMES.BACKGROUND*masterVolume;
		effectAudio = document.querySelector("#effectAudio");
		effectAudio.volume = MAX_VOLUMES.EFFECT*masterVolume;
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
    
    function changeVolume(num){
        masterVolume += num;
        if(masterVolume < 0){
            masterVolume = 0;
        }
        if(masterVolume > 1){
            masterVolume = 1;
        }
        //console.log(masterVolume);
        drawAlpha = 0.7;
        
		bgAudio.volume = MAX_VOLUMES.BACKGROUND*masterVolume;
		effectAudio.volume = MAX_VOLUMES.EFFECT*masterVolume;
    }
    
    function drawHUD(ctx,deltaTime){
        if(drawAlpha > 0){
            ctx.save();
        
            ctx.globalAlpha = drawAlpha;
            ctx.fillStyle = "blue";
            
            //update alpha
            drawAlpha -= deltaTime/4;
            
            //draw dimensions
            var width = ctx.canvas.width;
            var height = ctx.canvas.height;
            var center = (width-500)/2;
            
            //draw graphics
            ctx.fillRect(center-10,height-80,4,40);
            ctx.fillRect(center,height-80,500*masterVolume,40);
            ctx.fillRect(center+510,height-80,4,40);
            
            ctx.restore();
        }
    }
    
    //Allows certain methods and values to be accessed by other files
    return {
        setup: setup,
        playBGAudio: playBGAudio,
        stopBGAudio: stopBGAudio,
        playEffect: playEffect,
        changeVolume: changeVolume,
        drawHUD: drawHUD,
        EFFECTS: EFFECTS
    }
}();