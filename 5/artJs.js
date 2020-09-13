function sigmoid(t) {
    return t/(Math.sqrt(1+t*t));
};

var canvas = document.getElementById('canvas');
var ctx = canvas.getContext("2d");

var wh = canvas.height = window.innerHeight;
wh = Math.floor(wh);
var ww = canvas.width = window.innerWidth;
ww = Math.floor(ww);

var mouse = {x: 0, y: 0};

var particles = [];
var pixelindex;
var amountx = Math.floor(ww/radius);
var amounty = Math.floor(wh/radius);

var radius = 4;
var boostRange = 20;

var hue = Math.random()*340;
document.getElementById('body').style.backgroundColor = `rgb(${125}, ${125}, ${125})`//`hsl(${hue},50%,50%)`

function Particle(x, y) {
    this.x = x;
    this.y = y;
    this.z = 0;
    this.vz = 0;
    this.accZ = 0;
    this.friction = 0.99;
    this.color = 1;
};

Particle.prototype.render = function(clicked) {
    this.accZ = this.z * 0.001;
    if(clicked) {
        this.vz = 40;
    };
    if(this.x != 0 && this.y != 0 && this.x != amountx-1 && this.y != amounty-1) {
        for(var i = -1; i < 2; i++) {
            for(var j = -1; j < 2; j++) {
                particles[(this.x)+i][(this.y)+j].vz -= this.accZ * 0.1;
            };
        };
    };

    this.vz += this.accZ;
    this.vz *= this.friction;

    this.z -= this.vz;

    if(this.z >= 0.1 | this.z <= -0.1) {
        this.color = ((sigmoid(this.z)+1)/2)*255;//((sigmoid(this.z)+1)/2)*100;
        ctx.fillStyle = `rgb(${this.color}, ${this.color}, ${this.color})`;//`hsl(${hue+this.color/5-10*/},${this.color}%,${this.color}%)`;
        ctx.beginPath();
        ctx.rect(this.x*radius, this.y*radius, radius, radius);
        ctx.fill();
    }
};

function initScene() {
    var wh = canvas.height = window.innerHeight;
    wh = Math.floor(wh);
    var ww = canvas.width = window.innerWidth;
    ww = Math.floor(ww);
    ctx.clearRect(0,0, canvas.width, canvas.height);
    particles = [];
    amounty = Math.floor(wh/radius);
    amountx = Math.floor(ww/radius);
    for(var i = 0; i < wh; i++) {
        particles.push([]);
    }
    for(var i = 0; i < amountx; i++) {
        for(var j = 0; j < amounty; j++) {
            particles[i].push(new Particle(i, j));
        };
    };
};

function render() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    for (var i = 0; i < amountx; i++) {
        for (var j = 0; j < amounty; j++) {
            particles[i][j].render(false);
        };
    };
};

function mouseDown() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    for (var i = -1*boostRange/2; i < boostRange; i++) {
        for (var j = -1*boostRange/2; j < boostRange; j++) {
            var distance = Math.sqrt( i*i + j*j );
            if(distance<(boostRange/2)) {
                particles[Math.floor((mouse.x/radius))+i][Math.floor((mouse.y/radius))+j].render(true);
            } 
        };
    };
};

function onMouseMove(e){
    mouse.x = e.clientX;
    mouse.y = e.clientY;
};

window.addEventListener("resize", initScene);
window.addEventListener("mousemove", onMouseMove);
window.addEventListener("mousedown", mouseDown);
initScene();

var FPS = 10000;
var rememberMe = setInterval(loop, 1000 / FPS);

function loop() {
    render(false);
}