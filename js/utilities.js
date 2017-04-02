//Stores useful utility functions in a global scope allowing for code reuse.
//Design based on the utilities.js script in the Boomshine project

"use strict";

// returns mouse position in local coordinate system of element
function getMouse(e){
	var mouse = {} // make an object
	mouse.x = e.pageX - e.target.offsetLeft;
	mouse.y = e.pageY - e.target.offsetTop;
	return mouse;
}

//gets a random between min and max inclusive
function getRandom(min, max) {
  	return Math.random() * (max - min) + min;
}

//finds if point(x,y) is in rectangle instance rect 
function rectangleContainsPoint(rect,point){
    if(rect.width <= 0 || rect.height <= 0){
        return false;
    }
    return (point.x >= rect.x && point.x < (rect.x + rect.width) && point.y >= point.y && point.y < (rect.y + rect.height));
}

//checks if two rectangles are intersecting
//parameters:
//  rect1 - first rect to check
//  rect2 - second rect to compare with the first rect
//returns:
//  true if the rects intersect and false otherwise
function rectanglesIntersect(rect1,rect2){
    if(((rect1.x > (rect2.x + rect2.width)) || ((rect1.x+rect1.width) <  rect2.x))
      || ((rect1.y > (rect2.y + rect2.height)) || ((rect1.y+rect1.height) <  rect2.y))){
        return false;
    }
    return true;
}

//constructs and returns a rectangle object from an html element
function getRectangleFromElement(element){
    return {
        x: element.offsetLeft,
        y: element.offsetTop,
        width: element.width,
        height: element.height
    };   
}