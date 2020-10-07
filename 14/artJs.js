var fps = 60;

var canwidth = 1000;
var canheight = 1000;

var cur = 0;
let noiseVector;
let ellipseVector;
let firstpos;

var noiseRadius = 2;

var turn = 0;

//functions:

function loopnoise() {
    noiseVector.rotate(0.01);
    return map(noise(noiseVector.x, noiseVector.y), 0, 1, 0, 300);
}

//Setting canvas up:
function setup() {
    createCanvas(canwidth, canheight);
    frameRate(fps);
    noiseVector = createVector(noiseRadius, noiseRadius);
    ellipseVector = createVector(100, 100);
    firstpos = ellipseVector.heading();
}

function drawingFunc(t) {
    ellipseVector.rotate(0.01);
    ellipseVector.setMag(loopnoise())
    ellipse(ellipseVector.x+400, ellipseVector.y+400, 20, 20);
}

//Drawing function
function draw() {
    cur += 0.03;
    drawingFunc(cur);
}