//keys.js
"use strict";

var app = app || {};

app.keys = {
    KEY: Object.freeze({
        //Keycodes from the keys.js script for boomshine
        KEY_LEFT: 37, 
        KEY_UP: 38, 
        KEY_RIGHT: 39, 
        KEY_DOWN: 40,
        KEY_SHIFT: 16
    }),
    keyDown: [],
    //keyWasDown: [],
    
    keyPressed: function(keycode){
        this.keyDown[keycode] = true;
        //console.log(this.keyDown);
    },
    
    keyReleased: function(keycode){
        this.keyDown[keycode] = false;
        //console.log(this.keyDown);
    }
};