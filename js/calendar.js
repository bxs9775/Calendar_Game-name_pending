"use strict";

var app = app || {};

app.calendar = {
    
    //Constants
    CALENDAR_CONST: Object.freeze({
        WIDTH: 100,
        HEIGHT: 60
    }),
    
    //Days/hours - currently unused
    DAYS: Object.freeze({
        MON: 0,
        TUES: 1,
        WED: 2,
        THURS: 3,
        FRI: 4
    }),
    
    ///Stores data on a calendar item in the game
    ///Parameters:
    ///   name - the name displayed for the item
    ///   x - the x-position of the top left corner of the item
    ///   y - the y-position of the top left corner of the item
    ///   length - the lengh of the item in hours
    ///   color - the color used to draw the item
    ///   success - an object that details information on the effect on a successful scheduleing at the end of the round. This object should have the following form:
    ///      {
    ///         action: a function that changes some values
    ///         string: a description of this function's effect
    ///      }
    ///   failure - an object that details information on the effect when the event is not placed in the schedule at the end of the round. (See the layout of the success parameter.)
    
    CalendarItem: function(name,x,y,length,color,success,failure){
        this.name= name;
        this.location = {
            x: x,
            y: y
        };
        this.length = length;
        this.color = color;
        this.success = success;
        this.failure = failure;
        this.beingDragged = false;
        this.scheduled = false;
        //--OR--//
        //this.timeslot = undefined;
        
        ///Draws this calendar item.
        this.draw = function(ctx){
            ctx.save();
            
            //draw rect
            ctx.globalAlpha = 0.6;
            ctx.fillStyle = this.color;
            
            ctx.fillRect(this.location.x,this.location.y,app.calendar.CALENDAR_CONST.WIDTH,this.length*app.calendar.CALENDAR_CONST.HEIGHT);
            
            //draw text
            ctx.globalAlpha = 1.0;
            ctx.font = app.game.GUI.FONT.CALENDAR;
            ctx.fillStyle = app.game.GUI.FONT_COLOR;
            ctx.fillText(name,this.location.x+app.game.GUI.PADDING,this.location.y+app.game.GUI.PADDING+app.game.GUI.BASE_FONT_SIZE*1);
            //ctx.fillText("Length: " + this.length + " hour(s)" ,this.location.x+app.game.GUI.PADDING,this.location.y+app.game.GUI.PADDING+app.game.GUI.BASE_FONT_SIZE*2.1);
            if(this.success){
                ctx.fillText("S: " + this.success.string,this.location.x+app.game.GUI.PADDING,this.location.y+app.game.GUI.PADDING+app.game.GUI.BASE_FONT_SIZE*2.1);
            }
            if(this.failure){
                ctx.fillText("F: " + this.failure.string,this.location.x+app.game.GUI.PADDING,this.location.y+app.game.GUI.PADDING+app.game.GUI.BASE_FONT_SIZE*3.2);
            }
            
            //draw stroke
            ctx.strokeStyle = "black";
            ctx.lineWidth = 1;
            ctx.strokeRect(this.location.x,this.location.y,app.calendar.CALENDAR_CONST.WIDTH,this.length*app.calendar.CALENDAR_CONST.HEIGHT);
            
            ctx.restore();
        }
        
        this.getRectangle = function(){
            return {
                x: this.location.x,
                y: this.location.y,
                width: app.calendar.CALENDAR_CONST.WIDTH,
                height: (app.calendar.CALENDAR_CONST.HEIGHT * this.length)
            };
        }
    },
};