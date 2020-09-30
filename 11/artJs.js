var canwidth = window.innerWidth;
var canheight = window.innerHeight;

var inc = 0.03;
var cur = 0;
var step = 0.1;

var radius = 1;
//var objcolor = 'rgba(0,100,0,0.01)';
var color1 = 'hsla(';
var color2 = ', 59%, 32%, 0.03)';

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

    this.friction = friction + Math.random()*0.1;
    this.influence = influence + Math.random()*0.5;
    this.accoeff = accoeff + Math.random()*5;

    this.ttl = 4 + Math.random()*3;

    this.color = color1 + Math.floor(easymap(this.x, 0, space+margin, 0, 360)) + color2;
}

function Vector(x, y) {
    this.origx = x;
    this.origy = y;

    this.x = x*space+margin;
    this.y = y*space+margin;

    this.angle = 0;
}

Particle.prototype.drawParticle = function() {
    if(this.x > 10 && this.x < space*row && this.y > 10 && this.y < space*col && this.ttl > cur) {
            angle = vectorlist[Math.floor(this.x/space-margin)][Math.floor(this.y/space-margin)].angle,
            this.accy = Math.sin(angle) * this.influence;
            this.accx = Math.cos(angle) * this.accoeff;

            this.vx += this.accx;
            this.vy += this.accy;

            this.vx *= this.friction;
            this.vy *= this.friction;

            this.x += this.vx;
            this.y += this.vy;

            stroke(color(this.color));
            this.color = color1 + Math.floor(easymap(this.x, 0, canwidth+margin, 0, 360)) + color2;

            line(this.x, this.y, this.prevx, this.prevy);

            this.prevx = this.x;
            this.prevy = this.y;
    } else {
        this.edge(true);
    }
}

Particle.prototype.edge = function(xy) {
    if(this.x <= 11) {
        this.x = canwidth+margin-20;
        this.prevx = this.x;
    } else if (this.x >= row*space) {
        this.x = 20;
        this.prevx = this.x;
    }
    if(this.y <= 11) {
        this.y = canheight+margin-20;
        this.prevy = this.y;
    } else if (this.y >= space*col) {
        this.y = 20;
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