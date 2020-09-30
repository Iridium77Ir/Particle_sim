var canwidth = window.innerWidth;
var canheight = window.innerHeight-100;

var particlelist = [];

var margin = 50;
var space = canheight/30;

var col = Math.floor((canheight-margin-margin)/space);
var row = col;

var friction = 0.5;
var k = 0.1;
var depth = 7;

for(var i = 0; i < col; i++) {
    particlelist.push([])
    for(var j = 0; j < row; j++) {
        particlelist[i].push(new Particle(i, j));
    }
}

function Particle(x, y) {
    this.origx = x*space+margin;
    this.origy = y*space+margin;

    this.x = x*space+margin;
    this.y = y*space+margin;

    this.vx = 0;
    this.vy = 0;

    this.accx = 0;
    this.accy = 0;
}

Particle.prototype.change = function() {
    this.accx = ((this.x-this.origx)*k);
    this.accy = ((this.y-this.origy)*k);

    this.vx += this.accx;
    this.vy += this.accy;
    this.vx *= friction;
    this.vy *= friction;

    this.x -= this.vx;
    this.y -= this.vy;
}

Particle.prototype.mouse = function(val) {
    this.vx -= depth*val;
    this.vy -= depth*val;
}

function drawline(x1, y1, x2, y2) {
    line(x1,y1,x2,y2);
}

function checkSliders() {
    friction = document.getElementById("friction").value/100;
    k = document.getElementById("k").value/100
    depth = document.getElementById("depth").value;
}

function setup() {
    createCanvas(canwidth, canheight);
    strokeWeight(1);
    checkSliders();
}
function draw() {
    background(0);
    stroke(140)
    fill(140)
    for(var i = 0; i < col; i++) {
        for(var j = 0; j < row; j++) {
            particlelist[i][j].change();
        }
    }
    for(var i = 0; i < col; i++) {
        for(var j = 0; j < row-1; j++) {
            drawline(particlelist[i][j].x, particlelist[i][j].y, particlelist[i][j+1].x, particlelist[i][j+1].y);
            drawline(particlelist[j+1][i].x, particlelist[j+1][i].y, particlelist[j][i].x, particlelist[j][i].y);
        }
    }

    if(mouseX <= row*space && mouseY <= col*space && mouseX >= margin+space && mouseY >= margin+space) {
        var indexx = Math.floor((mouseX-margin)/(space));
        var indexy = Math.floor((mouseY-margin)/(space));
        particlelist[indexx][indexy].mouse(1);
        particlelist[indexx+1][indexy].mouse(0.5);
        particlelist[indexx][indexy+1].mouse(0.5);
        particlelist[indexx-1][indexy].mouse(0.5);
        particlelist[indexx][indexy-1].mouse(0.5);
    }
}