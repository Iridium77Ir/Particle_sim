var main = {
    w: 1000, 
    h: 1000,
    fieldDensity: 5,
    //Vector vars:
    vectorArray: [],
    chaosCoeff: 3,
    //Particle vars:
    particleArray: [],
    particlenum: 10000,
    defFric: 0.4,
    defInfl: 15
};
var guiMain = {
    w: 1000, 
    h: 1000,
    fieldDensity: 5,
    chaosCoeff: 3,
    particlenum: 10000,
    defFric: 0.4,
    defInfl: 15
};

function setup() {
    main.particleArray = []; main.vectorArray = [];
    //
    createCanvas(main.w, main.h);
    colorMode(RGB);
    stroke(0, 0, 0, 50);
    strokeWeight(1);
    //Create vectors:
    for(var i = 0; i < main.w/main.fieldDensity; i++) {
        main.vectorArray.push([]);
        for(var j = 0; j < main.h/main.fieldDensity; j++) {
            main.vectorArray[i].push(new Vector(i*main.fieldDensity, j*main.fieldDensity));
        };
    };
    //Create particles:
    for(var i = 0; i < main.particlenum; i++) {
        main.particleArray.push(new Particle(i*main.fieldDensity, j*main.fieldDensity));
    };
};

function draw() {
    background(255, 255, 255, 10);
    allVectors();
    allParticles();
};

//Vector def:
function Vector(x, y) {
    this.x = x;
    this.y = y;
    this.angle = 0;
};
Vector.prototype.drawVector = function() {
    line(this.x, this.y, cos(this.angle)*main.fieldDensity+this.x, sin(this.angle)*main.fieldDensity+this.y);
};
Vector.prototype.updateVector = function(noise) {
    this.angle = map(noise, 0, 1, 0, main.chaosCoeff*TWO_PI);
};
function allVectors() {
    for(var i = 0; i < main.vectorArray.length; i++) {
        for(var j = 0; j < main.vectorArray[i].length; j++) {
            main.vectorArray[i][j].updateVector(noise(i * 0.1, j * 0.1, frameCount * 0.1));
            //main.vectorArray[i][j].drawVector();
        };
    };
};

//Particle def:
function Particle() {
    this.x = main.w/2;this.y = main.h/2;
    this.px = this.x; this.py = this.y;

    this.accx = 0;this.accy = 0;
    this.vx = 0;this.vy = 0;

    this.fric = main.defFric + map(random(), 0, 1, -0.2, 0.2);
    this.infl = main.defInfl + map(random(), 0, 1, -4, 4);
};
Particle.prototype.updateParticle = function() {
    var index1 = floor(map(this.x, 0, main.w, 0, main.vectorArray.length));
    var index2 = floor(map(this.y, 0, main.h, 0, main.vectorArray[index1].length));
    var angle  = main.vectorArray[index1][index2].angle;
    this.accx = cos(angle) * this.infl;this.accy = sin(angle) * this.infl;

    this.vx += this.accx;this.vy += this.accy;
    this.vx *= this.fric;this.vy *= this.fric;

    this.px = this.x;this.py = this.y;
    this.x += this.vx; this.y += this.vy;

    this.edge();
};
Particle.prototype.edge = function() {
    //TODO: Maybe only do edge if x < -1 ?
    if (this.x <= 0) {this.x = main.w-10; this.px = main.w-10};
    if (this.x >= main.w) {this.x = 10;this.px = 10;};
    if (this.y <= 0) {this.y = main.h-10; this.py = main.h-10};
    if (this.y >= main.h) {this.y = 10;this.py = 10;};
};
Particle.prototype.drawParticle = function() {
    line(this.x, this.y, this.px, this.py);
};
function allParticles() {
    for(var i = 0; i < main.particleArray.length; i++) {
        main.particleArray[i].updateParticle();
        main.particleArray[i].drawParticle();
    };
};

var options = {
    Generate: () => init()
};
function init() {
    main.w = guiMain.w;
    main.h = guiMain.h;
    main.fieldDensity = guiMain.fieldDensity;
    main.chaosCoeff = guiMain.chaosCoeff;
    main.particlenum = guiMain.particlenum;
    main.defFric = guiMain.defFric;
    main.defInfl = guiMain.defInfl;
    setup();
};
function createGUI() {
    let gui = new dat.GUI();
    var canvasOptions = gui.addFolder('Canvas');
    canvasOptions.add(guiMain, 'w', 100, 2000, 10);
    canvasOptions.add(guiMain, 'h', 100, 2000, 10);
    var vectorOptions = gui.addFolder('Vectors');
    vectorOptions.add(guiMain, 'fieldDensity', 1, 100, 2);
    vectorOptions.add(guiMain, 'chaosCoeff', 1, 20, 1);
    var particleOptions = gui.addFolder('Particle');
    particleOptions.add(guiMain, 'particlenum', 1, 100000, 10);
    particleOptions.add(guiMain, 'defFric', 0, 1, 0.01);
    particleOptions.add(guiMain, 'defInfl', 1, 100, 1);
    gui.add(options, 'Generate');
};
createGUI();
