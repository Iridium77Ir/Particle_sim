// by Etienne JACOB
// uses a formula inspired by @ozachou_g (on twitter)

var x,y,z,t;

var A = [];
var f = [];
var ph = [];

var N,rot0,v;

var frame = 0;

function initialize(){
	frame = 0;
	
  for(var i=0;i<12;i++){
    A[i] = random(-3.0,3.0);
    f[i] = random(-1.2,1.2);
    ph[i] = random(TWO_PI);
  }
  
  x = random(-1,1);
  y = random(-1,1);
  z = random(-1,1);
  
  t = 0;
	
	v = 0.0000001*pow(10,random(5));

  background(235);
  
  rot0 = random(TWO_PI);
  N = floor(random(5,15));
}

function setup() {
	//createCanvas(windowWidth, windowHeight);
	createCanvas(window.innerWidth, window.innerHeight);
	
	initialize();
}

function move(){
  var xx = A[0]*sin(f[0]*x+ph[0]) + A[1]*cos(f[1]*y+ph[1]) + 2*A[2]*sin(f[2]*t+ph[2]) + A[3]*sin(f[3]*z+ph[3]);
  var yy = A[4]*cos(f[4]*x+ph[4]) + A[5]*sin(f[5]*y+ph[5]) + 2*A[6]*cos(f[6]*t+ph[6]) + A[7]*sin(f[7]*z+ph[7]);
  var zz = A[8]*sin(f[8]*x+ph[8]) + A[9]*cos(f[9]*y+ph[9]) + 2*A[10]*sin(f[10]*t+ph[10]) + A[11]*cos(f[11]*z+ph[11]);
  var tt = t + v;
	
  x = xx;
  y = yy;
  z = zz;
  t = tt;
}

function step(){
  move();
  
  push();
	
  translate(width/2,height/2);
  rotate(TWO_PI*floor(random(N))/N + 0*rot0);

  var scale = 0.3;
  
  var xx = scale*sin(0.4*x);
  var yy = scale*sin(0.4*y);
  var zz = scale*sin(0.4*z);

  stroke(0,7);
  
  if(-zz+zdist>0){
    var proj = projection(xx,yy,zz);
    strokeWeight(1+random(0,0.35)*proj[2]);
    
    point(proj[0]+0.5*randomGaussian(),proj[1]+0.5*randomGaussian());
  }
  
  pop();
}

var zdist = 0.45;

function projection(xx,yy,zz){
  var xxx = 200*xx/(-zz+zdist);
  var yyy = 200*yy/(-zz+zdist);
  return [xxx,yyy,1/(-zz+zdist)];
}

function finish(){
  print("finished");
  saveCanvas("res"+floor(random(1000000))+".png");
  stop();
}

function keyPressed() {
  finish();
}

function mousePressed(){
  initialize();
}

var numFrames = 1000;

var K = 2500;

function draw() {
	frame++;
	/*
	if(mousePressed){
    initialize();
  }*/
  
  for(var k=0;k<K;k++){
    step();
  }
	
  //console.log(frameCount,'/',numFrames);
	//print(frame,'/',numFrames);
	
  if(frame==numFrames){
    finish();
  }
}