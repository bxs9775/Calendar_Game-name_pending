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

//Finds if point(x,y) is in rectangle instance rect 
function rectangleContainsPoint(rect,point){
    if(rect.width <= 0 || rect.height <= 0){
        return false;
    }
    return (point.x >= rect.x && point.x < (rect.x + rect.width) && point.y >= point.y && point.y < (rect.y + rect.height));
}