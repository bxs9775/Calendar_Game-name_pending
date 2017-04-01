"use strict";

var app = app || {};

app.calendar = {
    //calendar structure
    calendar: 
    [[false,false,false,false,false],
     [false,false,false,false,false],
     [false,false,false,false,false],
     [false,false,false,false,false],
     [false,false,false,false,false],
     [false,false,false,false,false]],
    //Constants
    CALENDAR_CONST: Object.freeze({
        WIDTH: 160,
        HEIGHT: 80
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
        this.scheduled = false;
        //--OR--//
        //this.timeslot = undefined;
        
        ///Draws this calendar item.
        this.Draw = function(ctx){
            ctx.save();
            
            //draw rect
            ctx.globalAlpha = 0.4;
            ctx.fillStyle = this.color;
            
            ctx.fillRect(this.location.x,this.location.y,this.CALENDAR_CONST.WIDTH,this.length*this.CALENDAR_CONST.HEIGHT);
            
            //draw text
            ctx.globalAlpha = 1.0;
            ctx.font = app.game.GUI.FONT;
            ctx.fillStyle = app.game.GUI.FONT_COLOR;
            var text = name + "\nLength: " + this.length + " hour(s)";
            if(this.success){
                text = text + "\nSuccess: " + this.success.string;
            }
            if(this.failure){
                text = text + "\nFailure: " + this.failure.string;
            }
            ctx.fillText(text,x+app.game.GUI.PADDING,y+app.game.GUI.PADDING);
            
            ctx.restore();
        }
    },
};