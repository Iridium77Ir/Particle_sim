let w = 40;
let maxD;
let angle = 0;
let SCALE_FACTOR;

function setup() {
    createCanvas(1000, 1000, WEBGL);
    angleMode(DEGREES);
    maxD = dist(0,0,200,200);
    noStroke();
    SCALE_FACTOR = 1;
    colorMode(HSL);
}

function drawFaceBox(boxWidth, boxHeight, boxDepth, a) {
    let w = boxWidth * SCALE_FACTOR;
    let h = boxHeight;
    let d = boxDepth * SCALE_FACTOR;

    let sinCol = map(Math.sin(a * 90), -1, 1, 0, 360);

    // Center the box.
    translate(-w / 2, -h / 2);

    //right

    push();

    fill(sinCol, 50, 70);
    quad(0, 0, w, 0, w, h, 0, h);

    pop();

    //left

    push();

    fill(sinCol, 90, 20);
    translate(0, 0, -d);
    rotateY(-90);
    quad(0, 0, d, 0, d, h, 0, h);

    pop();

    //top

    push();

    fill(sinCol, 90, 40);
    translate(0, 0, -d);
    rotateX(90);
    quad(0, 0, w, 0, w, d, 0, d);

    pop();
}

function draw() {
    background(255);

    ortho(-1000, 1000, -1000, 1000, 0, 1500);
    rotateX(-30);
    rotateY(45);
    
    for(var i = 0; i < height; i += w) {
        for(var j = 0; j < width; j += w) {
            push();
            let d = dist(j, i, width / 2, height / 2);
            let offset = map(d, 0, maxD, -180, 180);
            let a = angle + offset;
            let h = map(sin(a/1.5), -1, 1, 200, 600);
            translate(j - width / 2, 0, i - height / 2);
            drawFaceBox(w,h,w, j);
            pop();
        }
    }

    angle += 2;
}