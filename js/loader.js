"use strict";

var app = app || {};

//Loading fuctions IIFE
(function(){
    function init(){
        Object.seal(app.calendar);
        app.game.calendar = app.calendar;
        
        Object.seal(app.game);
    }
    
    window.onload = init;
}());