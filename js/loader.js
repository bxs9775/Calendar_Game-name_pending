"use strict";

var app = app || {};

//Loading fuctions IIFE
(function(){
    //initilizes modules on load
    window.onload = function(){
        Object.seal(app.calendar);
        app.game.calendar = app.calendar;
        
        Object.seal(app.game);
        app.game.setup();
    }
    
    //changes states when window gains focus
    window.onfocus = function(){
        console.log("Unpause");
        if(app.game.gameState == app.game.GAME_STATES.PAUSED){
            if(app.game.lastState == undefined){
                app.game.changeGameState(app.game.GAME_STATES.PLAYING);
            }else{
                app.game.changeGameState(app.game.lastState);
            }
        }
    }
    
    //changes states when the window looses focus
    window.onblur = function(){
        console.log("Pause");
        if(app.game.gameState == app.game.GAME_STATES.PLAYING || app.game.gameState == app.game.GAME_STATES.GAME_OVER){
            app.game.changeGameState(app.game.GAME_STATES.PAUSED);
        }
    }
}());