let w = 40;
let maxD;
let angle = 0;
let SCALE_FACTOR;

let f = chroma.scale(['yellow', 'lightgreen', '008ae5']).mode('lab');

function setup() {
    createCanvas(1000, 1000, WEBGL);
    angleMode(DEGREES);
    maxD = dist(0,0,200,200);
    noStroke();
    SCALE_FACTOR = 1;
}

function drawFaceBox(boxWidth, boxHeight, boxDepth, a) {
    let w = boxWidth * SCALE_FACTOR;
    let h = boxHeight;
    let d = boxDepth * SCALE_FACTOR;

    let sinCol = map(a, 0, 700, 0, 1);
    let colR = f(sinCol).saturate(2).hex();
    let colL = f(sinCol).darken().hex();
    let colT = f(sinCol).hex();

    // Center the box.
    translate(-w / 2, -h / 2);

    //right

    push();

    fill(color(colR));
    quad(0, 0, w, 0, w, h, 0, h);

    pop();

    //left

    push();

    fill(color(colL));
    translate(0, 0, -d);
    rotateY(-90);
    quad(0, 0, d, 0, d, h, 0, h);

    pop();

    //top

    push();

    fill(color(colT));
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
            translate(j - width / 2, 0, i - height / 2);
            let h = (dist(j - width / 2, i - height / 2, mouseX-500, mouseY-500));
            drawFaceBox(w,h,w, h);
            pop();
        }
    }

    angle += 2;
}