var w = 1000, h = 1000;

var thickSlider = document.getElementById('thickness');
var densitySlider = document.getElementById('circledensity');

var circleAmountW = densitySlider.value;
var circleAmountH = densitySlider.value;
var circleR = w/(circleAmountW-1);
var marginConst = 0;
var sidesarray = [];
var colorarray = [];
var anglesarray = [];
var rotationspeed = 1;
var basecolor = getSplitComplementary(chroma.random());
var colors = [basecolor[1].hex(), basecolor[2].hex(), basecolor[3].hex()];
var bgc = basecolor[0].hex();

var frameCounter = 0;

function setup() {
    createCanvas(w, h);
    noFill()
    strokeWeight(w/circleR * (thickSlider.value/thickSlider.max));
    sidesarray = sidesArrayInit();
    colorarray = colorArrayInit();
    anglesarray = anglesArrayInit();
}

function draw() {
    if(frameCounter%(circleAmountH*circleAmountW) == 0) {
        frameCounter = 0;
    };
    if(frameCounter%(circleAmountH*circleAmountW)*4 == 0) {
        basecolor = getSplitComplementary(chroma.random());
        colors = [basecolor[1].hex(), basecolor[2].hex(), basecolor[3].hex()];
        bgc = basecolor[0].hex();
    };

    //Does it from left to right
    /* anglesarray[frameCounter%circleAmountW][floor(frameCounter/circleAmountH)]++; */

    //Does it randomly
    /* anglesarray[floor(random()*circleAmountW)][floor(random()*circleAmountH)]++; */

    //Does it randomly - with noise
    anglesarray[floor(noise(frameCount+10)*circleAmountW)][floor(noise(frameCount)*circleAmountH)]++;
    colorarray[floor(noise(frameCount+10)*circleAmountW)][floor(noise(frameCount)*circleAmountH)] = colors[round(map(frameCounter, 0, (circleAmountH*circleAmountW)+10, 0, colors.length-1))];

    frameRate(60);
    background(color(bgc));
    for(var i = 0; i < circleAmountW; i++) {
        for(var  j = 0; j < circleAmountW; j++) {
            stroke(color(colorarray[i][j]));
            drawCircle(i*circleR + marginConst, j*circleR + marginConst, sidesarray[i][j], anglesarray[i][j]);
        }
    }
    frameCounter++;
}

function anglesArrayInit() {
    var array = [];
    for(var i = 0; i < circleAmountW; i++) {
        array.push([])
        for(var  j = 0; j < circleAmountW; j++) {
            array[i][j] = round((map(noise(i, j), 0, 1, 0, 1)*4)/4);
        }
    }
    return array;
}

function sidesArrayInit() {
    var array = [];
    for(var i = 0; i < circleAmountW; i++) {
        array.push([])
        for(var  j = 0; j < circleAmountW; j++) {
            array[i][j] = round(random()*3);
        }
    }
    return array;
}

function colorArrayInit() {
    var array = [];
    for(var i = 0; i < circleAmountW; i++) {
        array.push([])
        for(var  j = 0; j < circleAmountW; j++) {
            array[i][j] = colors[floor(random()*colors.length)];
        }
    }
    return array;
}

function drawCircle(x,y, sides, angle) {
    arc(x, y, circleR, circleR, PI/2 + (angle * PI/2), ((sides+1) * (PI/2)) + (angle * PI/2));
}

function update() {
    strokeWeight(w/circleR * (thickSlider.value/thickSlider.max));

    circleAmountW = densitySlider.value;
    circleAmountH = densitySlider.value;

    circleR = w/(circleAmountW-1);

    sidesarray = sidesArrayInit();
    colorarray = colorArrayInit();
    anglesarray = anglesArrayInit();
    frameCounter = 0;
}

function getSplitComplementary(icolor) {
    return [icolor.luminance(0.94), icolor, chroma.hsl(icolor.get('hsl')[0]+180-30, icolor.get('hsl')[1], icolor.get('hsl')[2]), chroma.hsl(icolor.get('hsl')[0]+180+30, icolor.get('hsl')[1], icolor.get('hsl')[2])];
}