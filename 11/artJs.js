var canwidth = window.innerWidth;
var canheight = window.innerHeight;

var inc = 0.03;
var cur = 0;
var step = 0.1;

var radius = 1;

var space = 10;
var margin = 0;

var row = Math.floor(canwidth/space);
var col = Math.floor(canheight/space);

var vectorlist = [];

var particlenum = 100;
var particlelist = [];

var heightvar = space;

var friction = 0.6;
var influence = 15;
var accoeff = 10;

function easymap(n, start1, stop1, start2, stop2) {
    return ((n-start1)/(stop1-start1))*(stop2-start2)+start2;
}

function Particle(x, y) {
    this.origx = x;
    this.origy = y;

    this.x = x*space+margin;
    this.y = y*space+margin;

    this.prevx = this.x;
    this.prevy = this.y;

    this.vx = 0;
    this.vy = 0;

    this.accx = 0;
    this.accy = 0;

    this.friction = friction + Math.random()*0.05;
    this.influence = influence + Math.random()*0.2;
    this.accoeff = accoeff + Math.random()*2;

    this.ttl = 4 + Math.random()*3;

    this.color = Math.floor(easymap(this.x, 0, space+margin, 0, 360));
}

function Vector(x, y) {
    this.origx = x;
    this.origy = y;

    this.x = x*space+margin;
    this.y = y*space+margin;

    this.angle = 0;
}

Particle.prototype.drawParticle = function() {
    angle = vectorlist[Math.floor(constrain(this.x, 0, canwidth-10)/space-margin)][Math.floor(constrain(this.y, 0, canheight-10)/space-margin)].angle,
    this.accy = Math.sin(angle) * this.influence;
    this.accx = Math.cos(angle) * this.accoeff;

    this.vx += this.accx;
    this.vy += this.accy;

    this.vx *= this.friction;
    this.vy *= this.friction;

    this.x += this.vx;
    this.y += this.vy;

    this.edge();

    stroke(this.color, 59, 32, 0.04);
    this.color = Math.floor(easymap(this.x, 0, canwidth+margin, 0, 360));

    line(this.x, this.y, this.prevx, this.prevy);

    this.prevx = this.x;
    this.prevy = this.y;
}

Particle.prototype.edge = function() {
    if(this.x <= 0) {
        this.x = canwidth+margin-2;
        this.prevx = this.x;
    } else if (this.x >= row*space) {
        this.x = 2;
        this.prevx = this.x;
    }
    if(this.y <= 0) {
        this.y = canheight+margin-2;
        this.prevy = this.y;
    } else if (this.y >= space*col) {
        this.y = 2;
        this.prevy = this.y;
    }
}

Vector.prototype.drawVector = function(noise) {
    this.angle = -1 * noise;
    
    //line(this.x, this.y, Math.cos(this.angle)*heightvar+this.x, Math.sin(this.angle)*heightvar+this.y);
}

for(var i = 0; i < row; i++) {
    vectorlist.push([]);
    for(var j = 0; j < col; j++) {
        vectorlist[i].push(new Vector(i, j));
    }
}

for(var i = 0; i < particlenum; i++) {
    particlelist.push([]);
    for(var j = 0; j < particlenum; j++) {
        particlelist[i].push(new Particle((canwidth/particlenum)*i, (canheight/particlenum)*j));
    }
}   

function setup() {
    createCanvas(canwidth, canheight);
    colorMode(HSL);
    /* for(var k = 0; k < 10; k++) {
        for(var i = 0; i < row; i++) {
            for(var j = 0; j < col; j++) {
                vectorlist[i][j].drawVector(map(noise(i*step, j*step, cur), 0, 1, 0, Math.PI*2));
            }
        }
    } */
}

function draw() {
    frameRate(60);
    //background(255);
    cur += inc;

    for(var i = 0; i < row; i++) {
        for(var j = 0; j < col; j++) {
            vectorlist[i][j].drawVector(map(noise(i*step, j*step, cur), 0, 1, 0, Math.PI*2));
        }
    }
    for(var i = 0; i < particlenum; i++) {
        for(var j = 0; j < particlenum; j++) {
            particlelist[i][j].drawParticle();
        }
    }
    /* if(cur == 300*0.03) {
        saveCanvas('NoiseField.png');
    } */
}