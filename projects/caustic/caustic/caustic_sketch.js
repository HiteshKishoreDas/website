let width = 600;
let height= 600;

let a = width/2.05;
let c = 100;

var ray_inc;
var ray_nor;
var ray_ref;

let radius = 175;

let hyp_a = 10;
let ell_a = 150;
let ell_b = 100; 

let range = 150;

let sel;

var point_light;
let offset = width/5.5;

let mir_var=2; // 0: Plane, 1: Parabolic, 2: Circular

function mirror(x){
  
  if (mir_var==0){
    return x+offset; //Planar
  } 
  
  else if (mir_var==1) {
    return a - x*x/c; // Parabolic
  } 
  
  else if (mir_var==2) {
    return sqrt( radius*radius - x*x ) + offset; // Circular
  }
  
  else if (mir_var==3) {
    return -sqrt( x*x + hyp_a*hyp_a )/2.0 + offset*2; // Hyperbolic
  }

  else if (mir_var==4) {
    return ell_b * sqrt( 1.0 - x*x/(ell_a*ell_a) ) + offset; // Hyperbolic
  }
  
}

function diff (x,dx){
  let df = mirror(x+dx)-mirror(x-dx);
  return df*0.5/dx;
}

function setup() {
  
  createCanvas(width,height);
  point_light = createVector(0,0);
  ray_inc = createVector(0,0);

  textAlign(CENTER);
  background(200);
  sel = createSelect();
  sel.position(10, 10);
  sel.option('Circular');
  sel.option('Planar');
  sel.option('Parabolic');
  sel.option('Hyperbolic');
  sel.option('Elliptical');
  
  sel.selected('Cicular');
  sel.changed(mySelectEvent);

}

function mySelectEvent() {
  let item = sel.value();

  if (item=='Planar'){
    mir_var=0;
  } 
  
  else if (item=='Parabolic') {
    mir_var=1;
  } 
  
  else if (item=='Circular') {
    mir_var=2;
  }

  else if (item=='Hyperbolic') {
    mir_var=3;
  }

  else if (item=='Elliptical') {
    mir_var=4;
  }
  
}

function draw() {
  
  background(0);
  translate(width/2,height/2);
  
  point_light.x = mouseX - width/2;
  point_light.y = mouseY - height/2;
  // inc_dirx = map(mouseX,0,width,-1,1)
  // ray_inc = createVector(inc_dirx,-1);

  if (mir_var==1){
    fill('yellow');
    ellipse(0,a-c/4.0,10,10);
  }
  else if (mir_var==2){
    fill('magenta');
    ellipse(0,0+offset,10,10);

    fill('yellow');
    ellipse(0,0+offset+radius/2,10,10);
  }
  else if (mir_var==3){
    fill('yellow');
    ellipse(0,-sqrt(2)*hyp_a+2*offset,5,5);
  }

  else if (mir_var==4){
    fill('yellow');

    if (ell_a >= ell_b){
      ellipse(sqrt(ell_a*ell_a - ell_b*ell_b ),0+offset,10,10);
      ellipse(-sqrt(ell_a*ell_a - ell_b*ell_b ),0+offset,10,10);

    }

    else if (ell_a < ell_b){
      ellipse(0,sqrt(ell_b*ell_b - ell_a*ell_a ) + offset,10,10);
      ellipse(0,-sqrt(ell_b*ell_b - ell_a*ell_a ) + offset,10,10);

    }
  }



  fill('white');
  ellipse(point_light.x,point_light.y,10,10);

  strokeWeight(4);
  stroke (255);
  
  for (let x = -range; x<range; x++){
    line ( x, mirror(x), x+1, mirror(x+1));
  }

  strokeWeight(1);
  stroke('rgba(255,255,255,0.2)');
  for (let y = -range; y<=range; y = y+1){

    if (mouseIsPressed){
      ray_inc.x = point_light.x - y;
      ray_inc.y = point_light.y - mirror(y);

      line ( y, mirror(y), point_light.x, point_light.y);
    }
    else{
      ray_inc.x = 0.0;
      ray_inc.y = -100.0;

      line ( y, mirror(y), y + ray_inc.x*1000, mirror(y) + ray_inc.y*1000 );
    }

    ray_nor = createVector(diff(y,0.1),-1);

    let theta = ray_inc.angleBetween(ray_nor);

    //let fp = diff(y,0.1);

    //let theta = PI/2.0 - 2*abs( atan(fp) ) ;

    //ray_ref = createVector( 1*fp/abs(fp),-( tan(theta) ) );

    ray_ref = createVector(ray_inc.x,ray_inc.y);
    ray_ref.rotate(2*theta);

    line ( y, mirror(y), y + ray_ref.x*( range-abs(y) ), mirror(y) + ray_ref.y*( range-abs(y) ) );
  }
}