"use strict";

var app = app || {};

app.game = {
    //--------------------FEILDS--------------------//
    //constants
    GUI: Object.freeze({
        FONT: "16px Arial",
        FONT_COLOR: "black",
        PADDING: 5
    }),
    GAME_CONST: Object.freeze({
        INIT_TIME: 10
    }),
    
    //Drawing canvas
    canvas: undefined,
    ctx: undefined,
    
    //game parameters
    life: 0,
    work: 0,
    timeLeft: 0,
    timeBonus: 0,
    lastTime: 0,
    currTime: 0,
    deltaTime: 0,
    
    //--------------------CONTROL METHODS--------------------//
    //Sets up the game for the first time
    Setup: function(){
        canvas = document.querySelector("#canvas");
        ctx = canvas.getContext("2D");
        
        this.NewGame();
        
        window.requestAnimationFrame(this.Update.apply(this));
    },
    
    ///Cleans up level and resets values
    NewLevel: function(){
        
    },
    
    //Resets values to defaults and prepares for a new game
    NewGame: function(){
        this.life = 5;
        this.work = 5;
        this.timeBonus = 0;
    },
    
    
    //--------------------GAME LOOP--------------------//
    //Runs once a frame and updates game logic
    Update: function(){
        window.requestAnimationFrame(this.Update.apply(this));
    },
    
    //calculates delta time
    CalcDeltaTime: function(){
        this.lastTime = this.currTime;
        this.currTime = performance.now();
        if(!this.lastTime){
            this.deltaTime = 0;
            return;
        }
        this.deltaTime = this.currTime - this.lastTime;
    }
};