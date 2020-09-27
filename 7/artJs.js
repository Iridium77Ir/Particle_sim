var canwidth = 1000;//window.innerWidth;
var canheight = window.innerHeight;
var canwidthhalf = canwidth/2;
var canheighthalf = canheight/2;

var parnum = 20;
var changewidth = 2000/parnum;
var changeheight = 1000/parnum;

var radius = 8;
var linestrokeWidth = 2;

var particlelist = [];

function ease_out(x, xoffset) {
    if(xoffset >= canwidthhalf) {
        return Math.exp(x/60)/(canwidth*0.9);
    } else {
        return -1*Math.exp(x/60)/(canwidth*0.9);
    }
}

function Particle(n) {
    this.x = 0;
    this.y = 0;

    this.xoffset = canwidthhalf-50+(n-parnum/2)*30;
    this.yoffset = (Math.sin((1/parnum)*(n+0.5)*Math.PI))*100+200;
    
    this.xoff = n;
    this.yoff = n;

    this.inc = 0.003*(Math.sin((1/(parnum+1))*(n+1)*Math.PI))+0.002;

    this.vertexlistx = [];
    this.vertexlisty = [];
    this.noiselist = [];

    this.seed = n;

    this.movement = (Math.sin((1/parnum)*(n+0.5)*Math.PI))/2;
}
Particle.prototype.changevars = function() {
    this.xoff += this.inc;
    this.yoff += this.inc;

    noiseSeed(this.seed);

    var curnoise = map(noise(this.xoff), 0, 1, 0, changewidth+changewidth*this.movement);
    this.x = curnoise + this.xoffset;
    this.y = map(Math.sin(this.yoff)+2, 0, 1, 0, changeheight) + this.yoffset;

    this.vertexlistx.push(this.x);
    this.vertexlisty.push(this.y);
    this.noiselist.push(curnoise);
    if(this.vertexlistx.length == canheight) {
        this.vertexlistx.shift();
        this.vertexlisty.shift();
        this.noiselist.shift();
    }
}
Particle.prototype.renderparticle = function() {
    strokeWeight(linestrokeWidth);
    noFill();
    beginShape();
    stroke(100);
    for(var h = 0; h < canheight; h++) {    
        vertex(this.vertexlistx[this.vertexlistx.length-h]-(((this.xoffset-(canwidthhalf))/(canwidth*0.8)) * h)+ease_out(h, this.xoffset), h+this.vertexlisty[this.vertexlisty.length-h]);
    }
    endShape();

    fill(255);
    ellipse(this.x, this.y, radius, radius)
}

for(var n = 0; n < parnum; n++) {
    particlelist.push(new Particle(n))
}

function setup() {
    createCanvas(canwidth, canheight);
}
function draw() {
    background(0);
    stroke(255);

    for(var n = 0; n < parnum; n++) {
        particlelist[n].changevars()
        particlelist[n].renderparticle()
    }
}