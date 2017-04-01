"use strict";

var app = app || {};

app.game = {
    //--------------------FEILDS--------------------//
    //constants
    GUI: Object.freeze({
        BASE_FONT_SIZE: 14,
        FONT: "14pt Arial",
        FONT_COLOR: "black",
        PADDING: 5
    }),
    GAME_CONST: Object.freeze({
        INIT_TIME: 10
    }),
    
    //Drawing canvas
    canvas: undefined,
    ctx: undefined,
    
    //HTML elements
    helpButton: undefined,
    weekHeader: undefined,
    
    //game parameters
    life: 0,
    work: 0,
    timeLeft: 0,
    timeBonus: 0,
    lastTime: 0,
    currTime: 0,
    deltaTime: 0,
    
    //game states
    animationID: 0,
    GAME_STATES: Object.freeze({
        PAUSED: 0,
        INSTRUCTIONS: 1,
        PLAYING: 2,
        GAME_OVER: 3
    }),
    gameState: undefined,
    lastState: undefined,
    level: 0,
    
    //Calendar
    
    //--------------------CONTROL METHODS--------------------//
    //Sets up the game for the first time
    setup: function(){
        this.canvas = document.querySelector("#canvas");
        this.ctx = this.canvas.getContext("2d");
        
        this.ctx.font = this.GUI.FONT;
        
        this.helpButton = document.querySelector("#helpButton");
        this.helpButton.onclick = function(e){
            if(app.game.gameState == app.game.GAME_STATES.PLAYING || app.game.gameState == app.game.GAME_STATES.GAME_OVER){
                e.target.innerHTML = "Close Instructions";
                app.game.changeGameState(app.game.GAME_STATES.INSTRUCTIONS);
                return;
            }
            if(app.game.gameState == app.game.GAME_STATES.INSTRUCTIONS){
                e.target.innerHTML = "Open Instructions";
                if(app.game.lastState == undefined){
                    app.game.changeGameState(app.game.GAME_STATES.PLAYING);
                }else{
                    app.game.changeGameState(app.game.lastState);
                }
            }
        }
        this.weekHeader = document.querySelector("#calendar h2");
        
        
        
        this.gameState = app.game.GAME_STATES.INSTRUCTIONS;
        
        this.newLevel();
        this.newGame();
        
        this.update();
    },
    
    ///Cleans up level and resets values
    newLevel: function(){
        this.level++;
        this.timeLeft = 15;
        
        this.weekHeader.innerHTML = "Week " + this.level + ":";
    },
    
    //Resets values to defaults and prepares for a new game
    newGame: function(){
        this.life = 5;
        this.work = 5;
        this.timeBonus = 0;
    },
    
    //Changes the game state
    changeGameState: function(newState){
        //cancels animations
        cancelAnimationFrame(app.game.animationID);
        
        if(newState == this.GAME_STATES.PAUSED){
            helpButton.style.display = "none";
        } else{
            helpButton.style.display = "block";
        }
        
        //switches states
        this.lastState = this.gameState;
        this.gameState = newState;
        
        
        //resumes animating
        this.update();
    },
    
    //--------------------GAME LOOP--------------------//
    //Runs once a frame and updates game logic
    update: function(){
        //sets up the update method for the next frame
        this.animationID = window.requestAnimationFrame(this.update.bind(this));
        
        this.calcDeltaTime();
        
        switch(this.gameState){
            case this.GAME_STATES.PLAYING:
                this.timeLeft -= this.deltaTime;
                if(this.timeLeft <= 0){
                    this.newLevel();
                }
                break;
        }
        
        //finally draw the frame
        this.draw();
    },
    
    //Calculates delta time
    calcDeltaTime: function(){
        this.lastTime = this.currTime;
        this.currTime = performance.now();
        if(!this.lastTime){
            this.deltaTime = 0;
            return;
        }
        this.deltaTime = (this.currTime - this.lastTime)/1000;
    },
    
    //--------------------DRAWING--------------------//
    //Draws the current framw of the game
    draw: function(){
        switch(this.gameState){
            case this.GAME_STATES.PLAYING:
                this.clearCanvas();
                break;
        }
        //draw HUD once everything else is drawn
        this.drawHUD();
    },
    
    //Draws the HUD
    drawHUD: function(){
        var ctx = this.ctx;
        ctx.save();
        if(this.gameState == this.GAME_STATES.INSTRUCTIONS || this.gameState == this.GAME_STATES.PAUSED){
            ctx.fillStyle = "black";
            ctx.fillRect(0,0,ctx.canvas.width,ctx.canvas.height);
            ctx.fillStyle = "white";
        } else{
            ctx.fillStyle = this.GUI.FONT_COLOR;
        }
        
        ctx.fillText("Time: " + this.timeLeft.toFixed(2),this.ctx.canvas.width-120,this.ctx.canvas.height-90);
        ctx.fillText("Life: " + this.life,this.ctx.canvas.width-120,this.ctx.canvas.height-60);
        ctx.fillText("Work: " + this.work,this.ctx.canvas.width-120,this.ctx.canvas.height-30);
        
        switch(this.gameState){
            case this.GAME_STATES.PLAYING:
                break;
            case this.GAME_STATES.PAUSED:
                ctx.textAlign = "center";
                ctx.textBaseline = "middle";
                
                ctx.fillText("The game is paused.",this.ctx.canvas.width/2,this.ctx.canvas.height/2);
                break;
            case this.GAME_STATES.INSTRUCTIONS:
                ctx.fillText("Instructions:",this.GUI.PADDING,this.GUI.PADDING+this.GUI.BASE_FONT_SIZE);
        }
        
        ctx.restore();
    },
    
    //Clears the canvas
    clearCanvas: function(){
        this.ctx.clearRect(0,0,this.ctx.canvas.width,this.ctx.canvas.height);
    }
};