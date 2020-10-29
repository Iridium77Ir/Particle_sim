var w = 900, h = w;

const totalFrames = 50;
let counter = 0;

var bgc = '#222';
var linenum = 100;
var lineres = 400;

var noiseStep = 0.006;
var zStep = 1;
var maxHeight = 300;

function setup() {
    createCanvas(w, h);
    stroke(200);
    strokeWeight(1);
    noFill();
    background(bgc);
}

function draw() {
    background(bgc);

    drawLines();
}

function drawLines() {
    for(var i = 0; i < linenum*2.3; i++) {
        drawLine(w/linenum * i);
    }
}

function drawLine(y) {
    beginShape();
    for(var i = 0; i < lineres; i++) {
        var addVal = i*(w/lineres);
        var cury = y - addVal;
        vertex(addVal, cury - constrain(customnoise(addVal * noiseStep, cury * noiseStep), 0.5, 1) * maxHeight);
    }
    endShape();
}

function customnoise(x, y) {
    return noise(x + frameCount * -noiseStep, y + frameCount * -noiseStep);
}