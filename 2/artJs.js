var canvas = document.getElementById('canvas')
var ctx = canvas.getContext("2d")

var mouse = {x: 0, y: 0}

var particles = []
var amount = 0

var colors = ["#4287f5","#8e96a3", "#1f2226","#B64926", "#092e5e"]

var radius = 1

var ww = canvas.width = window.innerWidth
var wh = canvas.height = window.innerHeight

function Particle(x, y) {
    this.x = x
    this.y = y

    this.vx = (Math.random()-0.5)*20
    this.vy = (Math.random()-0.5)*20

    this.r = Math.random()*5+2

    this.accX = 0
    this.accY = 0

    this.friction = Math.random()*0.03+0.96

    this.offset = Math.random()*0.8 + 0.1

    this.color = colors[Math.floor(Math.random()*6)]
}

Particle.prototype.render = function() {
    this.accX = ((this.x - mouse.x)/1000) * this.offset
    this.accY = ((this.y - mouse.y)/1000) * this.offset

    this.vx += this.accX
    this.vy += this.accY
    this.vx *= this.friction
    this.vy *= this.friction

    this.x -= this.vx
    this.y -= this.vy

    ctx.fillStyle = this.color;
    ctx.beginPath();
    ctx.arc(this.x, this.y, this.r, Math.PI * 2, false);
    ctx.fill();
}

function onMouseMove(e){
    mouse.x = e.clientX;
    mouse.y = e.clientY;
}
    
function onTouchMove(e){
    if(e.touches.length > 0 ){
        mouse.x = e.touches[0].clientX;
        mouse.y = e.touches[0].clientY;
    }
}
    
function onTouchEnd(e){
    mouse.x = -9999;
    mouse.y = -9999;
}

function initScene() {
    ww = canvas.width = window.innerWidth
    wh = canvas.height = window.innerHeight

    ctx.clearRect(0,0, canvas.width, canvas.height)

    particles = []
    for(var i = 0; i < ww/3; i+= Math.round(ww/150)) {
        for(var j = 0; j < ww/3; j+= Math.round(ww/150)) {
            particles.push(new Particle(i, j))
        }
    }
    amount = particles.length
}   
function render() {
    requestAnimationFrame(render);
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    for (var i = 0; i < amount; i++) {
        particles[i].render();
    }
}
    
window.addEventListener("resize", initScene);
window.addEventListener("mousemove", onMouseMove);
window.addEventListener("touchmove", onTouchMove);
window.addEventListener("touchend", onTouchEnd);
initScene();
render()