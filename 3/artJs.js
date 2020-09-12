var canvas = document.getElementById('canvas');
var ctx = canvas.getContext("2d");

var ww = canvas.width = window.innerWidth;
var wh = canvas.height = window.innerHeight;

var wwHalf = Math.floor(ww/2);
var whHalf = Math.floor(wh/2);

var particleAmount = wwHalf/5;
var layer = particleAmount;

function HSLToHex(h,s,l) {
    s /= 100;
    l /= 100;
  
    let c = (1 - Math.abs(2 * l - 1)) * s,
        x = c * (1 - Math.abs((h / 60) % 2 - 1)),
        m = l - c/2,
        r = 0,
        g = 0,
        b = 0;
  
    if (0 <= h && h < 60) {
      r = c; g = x; b = 0;
    } else if (60 <= h && h < 120) {
      r = x; g = c; b = 0;
    } else if (120 <= h && h < 180) {
      r = 0; g = c; b = x;
    } else if (180 <= h && h < 240) {
      r = 0; g = x; b = c;
    } else if (240 <= h && h < 300) {
      r = x; g = 0; b = c;
    } else if (300 <= h && h < 360) {
      r = c; g = 0; b = x;
    }
    // Having obtained RGB, convert channels to hex
    r = Math.round((r + m) * 255).toString(16);
    g = Math.round((g + m) * 255).toString(16);
    b = Math.round((b + m) * 255).toString(16);
  
    // Prepend 0s, if necessary
    if (r.length == 1)
      r = "0" + r;
    if (g.length == 1)
      g = "0" + g;
    if (b.length == 1)
      b = "0" + b;
  
    return "#" + r + g + b;
};

var mouse = {x: 0, y: 0};

var colors = [];
for(var i = 0; i < layer; i++) {
    colors.push(HSLToHex((i/layer)*360, 63, 44));
};

var mouse = {x: 0, y: 0};

var particles = [];
var amount = 0;

var radius = 2;

var boostRange = 10;

var distance = radius*5;
var intensity = 0.5;

function Particle(x, r) {
    this.x = (x)*distance;
    this.y = whHalf;

    this.vy = 0;

    this.r = radius;

    this.accY = 0;

    this.k = 10;
    this.friction = 0.997;

    this.color = colors[r];

    this.num = x;
};

Particle.prototype.render = function(vert, boostRange, intensity) {
    this.accY =  ((this.y-whHalf) / 50) * 0.4;
    if(vert == true) {
        this.vy += 0.5 * boostRange * 20 * intensity;
    } else if(vert == false) {
        this.vy -= 0.5 * boostRange * 20 * intensity;
    }
    this.vy += this.accY;
    this.vy *= this.friction;

    this.y -= this.vy;

    if(this.num != 0 && this.num != amount-1) {
        particles[this.num+1].vy -= this.accY * 0.45;
        particles[this.num-1].vy -= this.accY * 0.45;
    }

    ctx.fillStyle = this.color;
    ctx.beginPath();
    ctx.arc(this.x, this.y, this.r, Math.PI * 2, false);
    ctx.fill();
};

function onMouseMove(e){
    mouse.x = e.clientX;
    mouse.y = e.clientY;
};
    
function onTouchMove(e){
    if(e.touches.length > 0 ){
        mouse.x = e.touches[0].clientX;
        mouse.y = e.touches[0].clientY;
    };
};
    
function onTouchEnd(e){
    mouse.x = -9999;
    mouse.y = -9999;
};

function initScene() {
    ww = canvas.width = window.innerWidth;
    wh = canvas.height = window.innerHeight;

    wwHalf = Math.floor(ww/2);
    whHalf = Math.floor(wh/2);

    ctx.clearRect(0,0, canvas.width, canvas.height);

    particles = [];
        for(var j = 0; j < particleAmount; j++) {
            particles.push(new Particle(j, j));
        }
    amount = particles.length;
};   
function render() {
    
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    for (var i = 0; i < amount; i++) {
        particles[i].render(null);
    };
};

function mouseDown() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    boostRange = 6;
        if(mouse.y <= whHalf) {
            intensity = (Math.abs(mouse.y-whHalf)/Math.abs(whHalf));
            particles[Math.floor(mouse.x/distance)].render(true, 1, intensity);
            for(var r = 1; r < boostRange; r++) {
                particles[Math.floor(mouse.x/distance)+r].render(true, Math.cos((r/(2*boostRange))*Math.PI), intensity);
                particles[Math.floor(mouse.x/distance)-r].render(true, Math.cos((r/(2*boostRange))*Math.PI), intensity);
            }
        } else  {
            intensity = (Math.abs(mouse.y-whHalf)/Math.abs(whHalf));
            particles[Math.floor(mouse.x/distance)].render(false, 1, intensity);
            for(var r = 1; r < boostRange; r++) {
                particles[Math.floor(mouse.x/distance)+r].render(false, Math.cos((r/(2*boostRange))*Math.PI), intensity);
                particles[Math.floor(mouse.x/distance)-r].render(false, Math.cos((r/(2*boostRange))*Math.PI), intensity);
            };
        };
};
    
window.addEventListener("resize", initScene);
window.addEventListener("mousemove", onMouseMove);
window.addEventListener("touchmove", onTouchMove);
window.addEventListener("touchend", onTouchEnd);
window.addEventListener("mousedown", mouseDown);
initScene();

var FPS = 60;
var rememberMe = setInterval(loop, 1000 / FPS);

function loop() {
    render(null);
};