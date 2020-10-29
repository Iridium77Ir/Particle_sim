var w = window.innerWidth, h = window.innerHeight;

var bgc = '#00361d';
var fgc = '#ffd829';

var lines = w/100;
var maxlength = 10;
var multi = 20;

var array = [];

function setup() {
    createCanvas(w, h);
    strokeWeight(32);
    stroke(bgc);
    noFill();

    for(var i = 0; i < lines; i++) {
        array.push([]);
        array[i] = generateLine(w/lines * i, array[i]);
    }
}

function draw() {
    background(bgc);
    frameRate(10);
    //noLoop();

    for(var i = 0; i < lines; i++) {
        drawLine(array[i]);
    }
    array.push([]);
    array[i] = generateLine(w/lines * (frameCount%lines), array[i]);
    array.shift();
}

function generateLine(x, linearray) {
    var count = 0;
    for(var y = 0; y < h+100; ) {
        linearray.push([]);
        linearray[count][0] = {x: x, y: y};
        y += ceil(random()*maxlength) * multi;
        linearray[count][1] = {x: x, y: y};
        x += ceil(random()*maxlength) * multi;
        linearray[count][2] = {x: x, y: y};
        y += ceil(random()*maxlength) * multi;
        linearray[count][3] = {x: x, y: y};
        x -= ceil(random()*maxlength) * multi;
        count++;
    }
    return linearray;
}

function drawLine(linearray) {
    var count = 0;
    beginShape();
    for(var i = 0; i < linearray.length; i++) {
        vertex(linearray[i][0].x, linearray[i][0].y);
        vertex(linearray[i][1].x, linearray[i][1].y);
        vertex(linearray[i][2].x, linearray[i][2].y);
        vertex(linearray[i][3].x, linearray[i][3].y);
    }
    endShape();
    push();
    stroke(fgc);
    strokeWeight(8);
    beginShape();
    for(var i = 0; i < linearray.length; i++) {
        vertex(linearray[i][0].x, linearray[i][0].y);
        vertex(linearray[i][1].x, linearray[i][1].y);
        vertex(linearray[i][2].x, linearray[i][2].y);
        vertex(linearray[i][3].x, linearray[i][3].y);
    }
    endShape();
    pop();
}