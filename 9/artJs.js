//Width and height of canvas
var ww = window.innerHeight;
var hh = window.innerHeight;
// N is number of initial circles
var N =22;
// arrays for storing circle data
var xxc=[];
var yyc=[];
var rrc=[];

function setup() {
    var smallCircleColor = color(67, 74, 7)
    var bigCicleColor = color(171, 178, 25)
    var lineColor = color(99, 108, 13)
    var curvyLineColor = color(15, 21, 0)

    createCanvas(ww, hh);

    background(250);//back ground color
    fill(250,250,250,0);// circle color 0 is transparent


    // initial loop , placing circles
    var i;
    for(i=0;i<N;i++){
        xxc[i]=random(ww*0.2,ww*0.8);
        yyc[i]=random(ww*0.2,hh*0.8);
        rrc[i]=random(ww*0.05,ww*0.2);
        strokeWeight(rrc[i]*0.01);
        stroke(bigCicleColor);
        ellipse(xxc[i],yyc[i],rrc[i],rrc[i]);
    }
    // end of initial loop

    // bindings
    for(i=0;i<N-1;i++) {
        strokeWeight(0.5*(rrc[i]+rrc[i+1])*0.01);
        stroke(lineColor)
        line(xxc[i],yyc[i],xxc[i],yyc[i+1]);
        line(xxc[i],yyc[i+1],xxc[i+1],yyc[i+1]);
        fill(smallCircleColor)
        ellipse(xxc[i],yyc[i+1],10,10);
        var q;
        var sn = random(1,12);
        for(q=0;q<sn;q++) {

            ellipse(xxc[i],yyc[i+1]+q*10,10-q,10-q);
            if(q>=(sn-1)) {
                print('inloop')
                var detail_s = 150;
                var nowr = 0;
                px=xxc[i];
                py=yyc[i+1]+q*10;

                for(p=0;p<detail_s;p++) {

                    var sp =(p)/(detail_s-1);
                    nowr=rrc[i]*sp/2;
                    var nowa = 2*PI*sp;
                    x1 = cos(nowa)*nowr+xxc[i];
                    y1 = sin(nowa)*nowr+yyc[i+1]+q*10;
                    x2 = cos(nowa)*nowr+xxc[i];
                    y2 = sin(nowa)*nowr+yyc[i];
                    strokeWeight(0.3);
                    stroke(curvyLineColor)
                    line(px,py,x1*(1-sp)+x2*(sp),y1*(1-sp)+y2*(sp),3);
                    px=x1*(1-sp)+x2*(sp);
                    py=y1*(1-sp)+y2*(sp);

                }
            }
        }
    }
}