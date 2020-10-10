let w = 10;
let angle = 0;
let SCALE_FACTOR;

let f = chroma.scale(['yellow', 'lightgreen', '008ae5']).mode('lab');

var rectlist;

var friction = 0.9;
var k = 0.1;
var defH = 500;

var clickR = 2;

var framecount = 0;

function changeW() {
    w = document.getElementById('w').value * 10;

    rectlist = [];

    for(var i = 0; i < height; i += w) {
        rectlist.push([]);
        for(var j = 0; j < width; j += w) {
            rectlist[i/w].push(new Rectangle(i, j));
        }
    }
}

function setup() {
    createCanvas(1000, 1000, WEBGL);
    frameRate(60);

    angleMode(DEGREES);
    noStroke();
    normalMaterial();

    rectlist = [];

    for(var i = 0; i < height; i += w) {
        rectlist.push([]);
        for(var j = 0; j < width; j += w) {
            rectlist[i/w].push(new Rectangle(i, j));
        }
    }
}

function mouseClicked() {
    if(Math.floor((mouseX)/w) < rectlist.length-1 && Math.floor((mouseY)/w) < rectlist[Math.floor((mouseX)/w)].length-1) {
        /* for(var i = -clickR; i < clickR; i++) {
            for(var j = -clickR; j < clickR; j++) {
                rectlist[Math.floor((mouseX)/w) - i][Math.floor((mouseY)/w) - j].h -= 300 * (Math.sin(map(i, -clickR, clickR, 0, Math.PI)) + Math.sin(map(j, -clickR, clickR, 0, Math.PI)));
            }
        } */
        rectlist[Math.floor((mouseX)/w)][Math.floor((mouseY)/w)].h -= 500;
    }
}

function Rectangle(x,y) {
    this.x = x/w;
    this.y = y/w;

    this.h = defH;

    this.posx = x;
    this.posy = y;
    
    this.vz = 0;
    this.accz = 0;
}

function sigmoid(x) {
    return 1/(1+Math.exp(-x + 5));
}

Rectangle.prototype.drawRect = function() {
    //update
    this.accz = (defH - this.h) * k;

    //adding surroundings
    if(this.x != height/w-1 && this.x != 0 && this.y != width/w-1 && this.y != 0) {
        this.accz += 1.5 * sigmoid(rectlist[this.x + 1][this.y].vz +  rectlist[this.x][this.y - 1].vz + rectlist[this.x - 1][this.y].vz + rectlist[this.x][this.y + 1].vz);
    }
    
    this.vz += this.accz;
    this.vz *= friction;
    this.h += this.vz;

    //draw
    push();
    translate(this.posx - width / 2, 0, this.posy - height / 2);
    box(w,this.h,w);
    pop();
}

function draw() {
    background(255);

    ortho(-1000, 1000, -1000, 1000, 0, 1500);
    rotateX(-30);
    rotateY(45 + angle);
    
    for(var i = 0; i < height/w; i ++) {
        for(var j = 0; j < width/w; j ++) {
            rectlist[i][j].drawRect();
        }
    }

    //angle += 0.1;
}