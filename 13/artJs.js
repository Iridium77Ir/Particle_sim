//Canvas options:
var fps = 60;

var canheight = window.innerHeight;
var canwidth = window.innerWidth;

//Program relevant vars:
var circlenum = 10;
var circlelist = [];

var circledrawlist = [];

var radius = 20;

var maxmag = canheight/2 - 100;

var cur = 0;
var inc = 0.4;

var middlex = canwidth/2;
var middley = canheight/2;

//Setting canvas up:
function setup() {
    createCanvas(canwidth, canheight);
    frameRate(fps);

    //init the cirlces
    for(var i = 0; i < circlenum; i++) {
        circlelist.push(new Circle(Math.floor((1/circlenum) * i * 360), i));
    }
}

//Program relevant functions:
function headingFunction(x) {
    return Math.sin(x*0.1)/10;
}
function magFunction(x) {
    return Math.abs(Math.sin(x*0.1) * maxmag);
}

function isReversed(x) {
    if(Math.floor(Math.sin(x*0.1) + 1) - 1 == -1) {
        return -1;
    } else {
        return 1;
    }
}

function Circle(hue, num) {
    this.vector = createVector(1,1);
    this.vector.rotate((1/circlenum) * num * Math.PI * 2);
    this.hue = hue;
}

Circle.prototype.drawCircle = function(t) {

    var reverse = isReversed(t);
    circledrawlist[circledrawlist.length-1].push({x: reverse * (this.vector.x) + middlex, y: reverse * (this.vector.y) + middley, radius: radius, colorcur: 'hsla(' + this.hue + ", 70%, 50%, "});

    this.vector.rotate(headingFunction(t));
    this.vector.setMag(magFunction(t));
}

//What is drawn:
function drawingFunc(t) {
    background(255);
    
    circledrawlist.push([]);
    for(var i = 0; i < circlenum; i++) {
        circlelist[i].drawCircle(t);
    }
    for(var i = 0; i < circledrawlist.length; i++) {
        for(var j = 0; j < circledrawlist[i].length; j++) {
            var cir = circledrawlist[i][j];
            /* stroke(color(cir.colorcur + 1/circledrawlist.length*i + ")"));
            fill(color(cir.colorcur + 1/circledrawlist.length*i + ")")); */
            stroke(color(cir.colorcur + magFunction(i)/maxmag + ")"));
            fill(color(cir.colorcur + magFunction(i)/maxmag + ")"));
            ellipse(cir.x, cir.y, cir.radius, cir.radius);
        }
    }
    if(circledrawlist.length >= 5*Math.PI) {
        circledrawlist.shift();
    }
}

function changeinc() {
    inc = document.getElementById('inc').value/10
}

//Drawing function
function draw() {
    cur += inc;
    drawingFunc(cur);
}