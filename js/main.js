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
        INIT_TIME: 10,
        NUM_APPOINTMENTS: 4
    }),
    
    //Drawing canvas
    canvas: undefined,
    ctx: undefined,
    
    //HTML elements
    helpButton: undefined,
    weekHeader: undefined,
    //the rectangle for the calendar
    //this uses hardcoded values as attempts to calculate the values dynamically proved ineffective
    calendarRect: {
        x: 170,
        y: 129,
        width: 800,
        height: 480
    },
    
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
    
    //calendar
    //calendar container (not sure whether to handle this here or in calendar.js)
    //true - this spot in the calendar is occupied
    //false - this spot in the calendar is vacent
    calendarArr: 
    [[false,false,false,false,false],
     [false,false,false,false,false],
     [false,false,false,false,false],
     [false,false,false,false,false],
     [false,false,false,false,false],
     [false,false,false,false,false]],
    appointments: [],
    selectedItem: -1,
    
    //--------------------CONTROL METHODS--------------------//
    //Sets up the game for the first time
    setup: function(){
        //canvas objects
        this.canvas = document.querySelector("#canvas");
        this.ctx = this.canvas.getContext("2d");
        
        //font/drawing
        this.ctx.font = this.GUI.FONT;
        
        //buttons and GUI
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
        
        
        //mouse and keyboard events
        this.canvas.onmousedown = this.doMousedown.bind(this);
        this.canvas.onmousemove = this.doMousedrag.bind(this);
        this.canvas.onmouseup = this.doMouseup.bind(this);
        
        //game states
        this.gameState = app.game.GAME_STATES.INSTRUCTIONS;
        
        //starting new game and level
        this.newLevel();
        this.newGame();
        
        //starts game loop
        this.update();
    },
    
    ///cleans up level and resets values
    newLevel: function(){
        this.level++;
        
        this.selectedItem = -1;
        this.appointments = [];
        var numAppointments = this.GAME_CONST.NUM_APPOINTMENTS;
        var nextHeight = 50;
        for(var i = 0; i < numAppointments;i++){
            var newLength = Math.round(getRandom(1,2));
            var newAppointment = new this.calendar.CalendarItem("Meeting",1010,nextHeight,newLength,"Blue",undefined,undefined);
            Object.seal(newAppointment);
            this.appointments.push(newAppointment);
            nextHeight += 100;
        }
        
        this.resetCalendar();
        
        this.weekHeader.innerHTML = "Week " + this.level + ":";
        this.timeLeft = 15;
    },
    
    //resets values to defaults and prepares for a new game
    newGame: function(){
        this.life = 5;
        this.work = 5;
        this.timeBonus = 0;
    },
    
    //changes the game state
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
    
    //sets all values in the calendar array to false
    resetCalendar: function(){
        var calendarHeight = this.calendarArr.length;
        var calendarWidth = this.calendarArr[0].length;
        for(var i = 0; i < calendarHeight; i++){
            for(var j = 0; j < calendarWidth; j++){
                this.calendarArr[i][j] = false;
            }
        }
    },
    
    //--------------------GAME LOOP--------------------//
    //runs once a frame and updates game logic
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
    
    //calculates delta time
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
    //draws the current framw of the game
    draw: function(){
        switch(this.gameState){
            case this.GAME_STATES.PLAYING:
                this.clearCanvas();
                var listSize = this.appointments.length;
                for(var i = 0; i < listSize; i++){
                    this.appointments[i].draw(this.ctx);
                }
                break;
        }
        //draw HUD once everything else is drawn
        this.drawHUD();
    },
    
    //draws the HUD
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
    
    //clears the canvas
    clearCanvas: function(){
        this.ctx.clearRect(0,0,this.ctx.canvas.width,this.ctx.canvas.height);
    },
    
    //--------------------MOUSE AND KEYBOARD EVENTS--------------------//
    //handles mousedown events in the program.
    doMousedown: function(e){
        //get mouse object
        var mouse = getMouse(e);
        var itemsLength = this.appointments.length;
        for(var i = 0; i < itemsLength;i++){
            var item = this.appointments[i];
            var rect = item.getRectangle();
            if(!item.scheduled && rectangleContainsPoint(rect,mouse)){
                this.selectedItem = i;
                this.appointments[i].beingDragged = true;
                this.appointments[i].color = "Yellow";
                return;
            }
        }
    },
    
    //handles mousedrag events for the calendar items
    doMousedrag: function(e){
        if(this.selectedItem < 0){
            return;
        }
        var mouse = getMouse(e);
        this.appointments[this.selectedItem].location = mouse;
    },
    
    //handles mouseup events in the program
    doMouseup: function(e){
        if(this.selectedItem < 0){
            return;
        }
        
        var item = this.appointments[this.selectedItem];
        this.appointments[this.selectedItem].beingDragged = false;
        
        var itemRect = item.getRectangle();
        if(rectanglesIntersect(itemRect,this.calendarRect)){
            var calX = (itemRect.x < this.calendarRect.x)?0:(Math.floor((itemRect.x-this.calendarRect.x)/this.calendar.CALENDAR_CONST.WIDTH));
            var calY = (itemRect.y < this.calendarRect.y)?0:(Math.floor((itemRect.y-this.calendarRect.y)/this.calendar.CALENDAR_CONST.HEIGHT));
            var spotOpen = true;
            if((calY+(item.length)) > this.calendarArr.length){
                spotOpen = false;
            }else{
                for(var i = 0; i < item.length; i++){
                    if(this.calendarArr[calY+i][calX]){
                        spotOpen = false;
                    }
                }
            }
            
            if(spotOpen){
                this.appointments[this.selectedItem].scheduled = true;
                this.appointments[this.selectedItem].location.x = this.calendarRect.x + calX * (this.calendar.CALENDAR_CONST.WIDTH+4)+4;
                this.appointments[this.selectedItem].location.y = this.calendarRect.y + calY * (this.calendar.CALENDAR_CONST.HEIGHT+4)+4;
                for(var i = 0; i < item.length; i++){
                    this.calendarArr[calY+i][calX] = true;
                }
            }
        }
        
        if(item.scheduled){
            this.appointments[this.selectedItem].color = "Green";
        }else{
            
            this.appointments[this.selectedItem].color = "Blue";
        }
        
        this.selectedItem = -1;
    },
};