"use strict";

var app = app || {};

app.game = {
    //--------------------FEILDS--------------------//
    //constants
    GUI: Object.freeze({
        BASE_FONT_SIZE: 14,
        FONT: Object.freeze({
            GUI_FONT: "16pt Open Sans",
            CALENDAR: "14pt Open Sans"
        }),
        FONT_COLOR: "black",
        PADDING: 10
    }),
    
    GAME_CONST: Object.freeze({
        MAX_TIME: 20,
        MIN_TIME: 10,
        NUM_APPOINTMENTS: 10
    }),
    
    //Drawing canvas
    canvas: undefined,
    ctx: undefined,
    
    //HTML elements
    helpButton: undefined,
    newGameButton: undefined,
    weekHeader: undefined,
    //the rectangle for the calendar
    calendarRect: {
        x: -1,
        y: -1,
        width: -1,
        height: -1
    },
    calCols: 5,
    calRows: 6,
    
    
    //game parameters
    score: 0,
    life: 0,
    work: 0,
    timeLeft: 0,
    timeBonus: 0,
    lastTime: 0,
    currTime: 0,
    deltaTime: 0,

    startingTime: 0,
    
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
    calendarInst: undefined,
    
    //External scripts
    calendar: undefined,
    sound: undefined,
    
    //Content
    CONTENT: Object.freeze({
        NAMES: Object.freeze({
            MISC: ["Gardening", "Haircut", "Cleaning"],
            WORK: ["Meeting","Project"],
            LIFE: ["Biking","Concert","Family","Spa"]
        }),
        EFFECTS: Object.freeze({
            WORK_DEC_ONE: {
                action: function(){
                    app.game.work--;
                },
                string: "-1 Work"
            },
            LIFE_DEC_ONE: {
                action: function(){
                    app.game.life--;
                },
                string: "-1 Life"
            },
        }),
    }),
    
    debug: false,
    
    //--------------------CONTROL METHODS--------------------//
    //Sets up the game for the first time
    setup: function(){
        //canvas objects
        this.canvas = document.querySelector("#canvas");
        this.ctx = this.canvas.getContext("2d");
        
        //font/drawing
        this.ctx.font = this.GUI.FONT.GUI_FONT;
        
        //calendar object
        this.calendarInst = new this.calendar.CalendarObj();
        
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
        this.newGameButton = document.querySelector("#newGame");
        this.newGameButton.onclick = (function(){
            this.newGame();
            
            this.changeGameState(this.GAME_STATES.PLAYING);
        }).bind(app.game);
        
        this.weekHeader = document.querySelector("#calendar h2");
        
        
        //mouse and keyboard events
        this.canvas.onmousedown = this.doMousedown.bind(this);
        this.canvas.onmousemove = this.doMousedrag.bind(this);
        this.canvas.onmouseup = this.doMouseup.bind(this);
        
        //calendar rect
        this.calendarRect.x = 12 + this.calendar.CALENDAR_CONST.WIDTH;
        this.calendarRect.y = 50 + this.calendar.CALENDAR_CONST.HEIGHT;
        this.calendarRect.width = this.calendar.CALENDAR_CONST.WIDTH*this.calCols*1.04;
        this.calendarRect.height = this.calendar.CALENDAR_CONST.HEIGHT*this.calRows*1.04;
        
        //game states
        this.gameState = app.game.GAME_STATES.INSTRUCTIONS;
        
        //starting new game
        this.newGame();
        
        //starts game loop
        this.update();
    },
    
    ///cleans up level and resets values
    newLevel: function(){
        this.level++;
        
        this.calendarInst.itemsScheduled = 0;
        this.calendarInst.selectedItem = -1;
        this.calendarInst.appointments = [];
        var numAppointments = this.GAME_CONST.NUM_APPOINTMENTS;
        var width = 5;
        var height = this.calendarRect.y + this.calendarRect.height + 10;
        for(var i = 0; i < numAppointments;i++){
            var newLength = Math.round(getRandom(2,4));
            
            var newAppointment = this.createNewCalendarItem(width,height);
            
            this.calendarInst.appointments.push(newAppointment);
            width += this.calendar.CALENDAR_CONST.WIDTH*1.0;
        }
        
        this.resetCalendar();
        
        this.weekHeader.innerHTML = "Week " + this.level + ":";
        this.timeLeft = this.startingTime;
        if(this.startingTime > this.GAME_CONST.MIN_TIME){
            this.startingTime -= 2.5;
        }
    },
    
    //resets values to defaults and prepares for a new game
    newGame: function(){
        this.level = 0;
        this.startingTime = this.GAME_CONST.MAX_TIME;
        
        this.score = 0;
        this.life = 4;
        this.work = 4;
        
        this.timeBonus = 0;
        
        this.newLevel();
    },
    
    createNewCalendarItem: function(x,y){
        var newLength = Math.round(getRandom(2,4));
        //appointment, appointment type
        var newAppointment = undefined;
        var appointmentType = Math.round(getRandom(0,2));
        switch(appointmentType){
            case 0:
                newAppointment = new this.calendar.CalendarItem(this.CONTENT.NAMES.MISC.randomElement(),x,y,newLength,this.calendar.ICONS.MISC,undefined,undefined);
                break;
            case 1: 
                newAppointment = new this.calendar.CalendarItem(this.CONTENT.NAMES.WORK.randomElement(),x,y,newLength,this.calendar.ICONS.WORK,undefined,this.CONTENT.EFFECTS.WORK_DEC_ONE);
                break;
            case 2: 
                newAppointment = new this.calendar.CalendarItem(this.CONTENT.NAMES.LIFE.randomElement(),x,y,newLength,this.calendar.ICONS.LIFE,undefined,this.CONTENT.EFFECTS.LIFE_DEC_ONE);
                break;
        }
        
        Object.seal(newAppointment);
        return newAppointment;
    },
    
    //changes the game state
    changeGameState: function(newState){
        //cancels animations
        cancelAnimationFrame(app.game.animationID);
        if(!(newState == this.GAME_STATES.PLAYING || newState == this.GAME_STATES.GAME_OVER)){
           this.sound.stopBGAudio();
        }
        
        if(newState == this.GAME_STATES.PAUSED){
            this.helpButton.style.display = "none";
        } else{
            this.helpButton.style.display = "block";
        }
        
        if(newState == this.GAME_STATES.GAME_OVER){
            this.newGameButton.style.display = "block";
        } else{
            this.newGameButton.style.display = "none";
        }
        
        if(!(this.state == this.GAME_STATES.PLAYING || this.state == this.GAME_STATES.GAME_OVER) && (newState == this.GAME_STATES.PLAYING || newState == this.GAME_STATES.GAME_OVER)){
            app.sound.playBGAudio();
        }
        
        //switches states
        this.lastState = this.gameState;
        this.gameState = newState;
        
        //resumes animating
        this.update();
    },
    
    //handles the end of the level
    endRound: function(){ 
        this.sound.playEffect(this.sound.EFFECTS.END_ROUND);
        
        var length = this.calendarInst.appointments.length;
        for(var i = 0; i < length;i++){
            var item = this.calendarInst.appointments[i];
            if(item.scheduled){
                this.score++;
                //Code for later development
                /*
                if(item.success){
                    item.success.action();
                }
                */
            }else{
                if(item.failure){
                    item.failure.action();
                }
            }
        }
        if(this.work <= 0 || this.life <= 0){
            this.changeGameState(this.GAME_STATES.GAME_OVER);
        } else{
            this.newLevel();
        }
    },
    
    //sets all values in the calendar array to false
    resetCalendar: function(){
        var calendarHeight = this.calendarInst.array.length;
        var calendarWidth = this.calendarInst.array[0].length;
        for(var i = 0; i < calendarHeight; i++){
            for(var j = 0; j < calendarWidth; j++){
                this.calendarInst.array[i][j] = false;
            }
        }
    },
    
    //--------------------GAME LOOP--------------------//
    //runs once a frame and updates game logic
    update: function(){
        //sets up the update method for the next frame
        this.animationID = window.requestAnimationFrame(this.update.bind(this));
        
        this.calcDeltaTime();
        
        var keyDown = this.keys.keyDown;
        if(keyDown[this.keys.KEY.KEY_SHIFT] && keyDown[this.keys.KEY.KEY_UP]){
            this.sound.changeVolume(0.5*this.deltaTime);
        }
        if(keyDown[this.keys.KEY.KEY_SHIFT] && keyDown[this.keys.KEY.KEY_DOWN]){
            this.sound.changeVolume(-0.5*this.deltaTime);
        }
        
        switch(this.gameState){
            case this.GAME_STATES.PLAYING:
                this.timeLeft -= this.deltaTime;
                if(this.timeLeft <= 0){
                    this.endRound();
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
                
                if(this.debug){
                    this.ctx.strokeStyle = "red";
                    this.ctx.strokeRect(this.calendarRect.x,this.calendarRect.y,this.calendarRect.width,this.calendarRect.height);
                }
                
                var listSize = this.calendarInst.appointments.length;
                for(var i = 0; i < listSize; i++){
                    this.calendarInst.appointments[i].draw(this.ctx);
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
        
        
        if(this.gameState != this.GAME_STATES.PLAYING){
            ctx.fillStyle = "black";
            ctx.fillRect(0,0,ctx.canvas.width,ctx.canvas.height);
            ctx.fillStyle = "white";
        } else{
            ctx.fillStyle = this.GUI.FONT_COLOR;
        }
        
        ctx.fillText("Score: " + this.score,this.ctx.canvas.width-120,this.ctx.canvas.height-120);
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
                ctx.fillText("* Use the mouse to drag calendar items onto the calendar.",this.GUI.PADDING,(this.GUI.PADDING+this.GUI.BASE_FONT_SIZE)*2);
                ctx.fillText("* Once you place an item it cannot be moved.",this.GUI.PADDING,(this.GUI.PADDING+this.GUI.BASE_FONT_SIZE)*3);
                ctx.fillText("* Items cannot share the same slot.",this.GUI.PADDING,(this.GUI.PADDING+this.GUI.BASE_FONT_SIZE)*4);
                ctx.fillText("* Some items decrease the Life or Work stats if not placed in the calendar.",this.GUI.PADDING,(this.GUI.PADDING+this.GUI.BASE_FONT_SIZE)*5);
                ctx.fillText("* The round ends when all items are scheduled or time runs out. The game automatically starts the next round.",this.GUI.PADDING,(this.GUI.PADDING+this.GUI.BASE_FONT_SIZE)*6);
                ctx.fillText("* The effects after the F (for Fail) activate after the round if the item is not scheduled.",this.GUI.PADDING,(this.GUI.PADDING+this.GUI.BASE_FONT_SIZE)*7);
                ctx.fillText("* If Work or Life goes to or below 0 the game ends.",this.GUI.PADDING,(this.GUI.PADDING+this.GUI.BASE_FONT_SIZE)*8);
                
                ctx.fillText("* [Use Shift+Up and Shift+Down to change the volume]",this.GUI.PADDING,(this.GUI.PADDING+this.GUI.BASE_FONT_SIZE)*25);
                break;
            case this.GAME_STATES.GAME_OVER:
                ctx.textAlign = "center";
                ctx.textBaseline = "middle";
                
                ctx.fillStyle = "red";
                ctx.fillText("GAME OVER",this.ctx.canvas.width/2,this.ctx.canvas.height/2-(this.GUI.PADDING+this.GUI.BASE_FONT_SIZE));
                
                ctx.fillStyle = "white";
                ctx.fillText("Final Score: " + this.score,this.ctx.canvas.width/2,this.ctx.canvas.height/2);
                break;
        }
        
        this.sound.drawHUD(this.ctx,this.deltaTime);
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
        var itemsLength = this.calendarInst.appointments.length;
        for(var i = 0; i < itemsLength;i++){
            var item = this.calendarInst.appointments[i];
            var rect = item.getRectangle();
            if(!item.scheduled && rectangleContainsPoint(rect,mouse)){
                //select item
                this.calendarInst.selectedItem = i;
                this.calendarInst.appointments[i].beingDragged = true;
                this.calendarInst.appointments[i].color = "Yellow";
                
                //play selection effect
                this.sound.playEffect(this.sound.EFFECTS.SELECT);
                return;
            }
        }
    },
    
    //handles mousedrag events for the calendar items
    doMousedrag: function(e){
        if(this.calendarInst.selectedItem < 0){
            return;
        }
        var mouse = getMouse(e);
        this.calendarInst.appointments[this.calendarInst.selectedItem].location = mouse;
    },
    
    //handles mouseup events in the program
    doMouseup: function(e){
        var cal = this.calendarInst;
        if(cal.selectedItem < 0){
            return;
        }
        
        var item = cal.appointments[cal.selectedItem];
        cal.appointments[cal.selectedItem].beingDragged = false;
        
        var itemRect = item.getRectangle();
        if(rectanglesIntersect(itemRect,this.calendarRect)){
            var calX = (itemRect.x < this.calendarRect.x)?0:(Math.floor((itemRect.x-this.calendarRect.x)/this.calendar.CALENDAR_CONST.WIDTH));
            var calY = (itemRect.y < this.calendarRect.y)?0:(Math.floor((itemRect.y-this.calendarRect.y)/this.calendar.CALENDAR_CONST.HEIGHT));
            var spotOpen = true;
            if((calY+(item.length)) > cal.array.length){
                spotOpen = false;
            }else{
                for(var i = 0; i < item.length; i++){
                    if(cal.array[calY+i][calX]){
                        spotOpen = false;
                    }
                }
            }
            
            if(spotOpen){
                console.dir(cal.appointments[cal.selectedItem].getCenter());
                cal.appointments[cal.selectedItem].scheduled = true;
                cal.appointments[cal.selectedItem].location.x = this.calendarRect.x + calX * (this.calendar.CALENDAR_CONST.WIDTH+4)+4;
                cal.appointments[cal.selectedItem].location.y = this.calendarRect.y + calY * (this.calendar.CALENDAR_CONST.HEIGHT+1)+4;
                cal.appointments[cal.selectedItem].particles.createParticles(cal.appointments[cal.selectedItem].getCenter());
                for(var i = 0; i < item.length; i++){
                    cal.array[calY+i][calX] = true;
                }
                
                cal.itemsScheduled++;
                if(cal.itemsScheduled >= this.GAME_CONST.NUM_APPOINTMENTS){
                    this.endRound();
                    return;
                }
            }
        }
        
        if(item.scheduled){
            cal.appointments[cal.selectedItem].color = "Green";
            this.sound.playEffect(this.sound.EFFECTS.DROP_SUCCESS);
        }else{
            cal.appointments[cal.selectedItem].color = "Blue";
            this.sound.playEffect(this.sound.EFFECTS.DROP);
        }
        
        cal.selectedItem = -1;
    },
};