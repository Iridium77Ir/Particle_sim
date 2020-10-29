var w = 1000, h = 1000;

var bgc = '#fff';
var linenum = 10;
var lineres = 1000;

var noiseval = 0.03;
var znoiseval = 0.01;
var noiseIntensity = 0.00015;

var lineVar = 50;

function setup() {
    createCanvas(w, h);
    stroke(0);
    strokeWeight(0.01);
    noFill();
    background(bgc);
}

function draw() {
    //background(bgc);
    //noLoop();

    drawLines(frameCount%(random()*100) * znoiseval);
}

function drawLines(z) {
    for(var i = 0; i < linenum; i++) {
        drawLine(h/linenum * i, z);
    }
}

function drawLine(y, z) {
    beginShape();
    for(var i = 0; i < lineres; i++) {
        var x = w/lineres * i;
        vertex(x, y + map(noise(x * noiseval, y * noiseval, z), 0, 1, -x*y*noiseIntensity, x*y*noiseIntensity));
    }
    endShape();
}