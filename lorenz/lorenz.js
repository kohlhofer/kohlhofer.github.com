// var canvasWidth = 800;
// var canvasHeight = 600;

var o = 10;
var b = 8/3;
var p = 28;
var firstPoint = {x:Math.random(),y:Math.random(),z:Math.random()};
var tstep = 0.01;
var zoom = 3;
var points = [firstPoint];
var iteration = 0;


function setup() {
  createCanvas(windowWidth, windowHeight, WEBGL);
}


function draw() {
  
  
  //sin(frameCount * 0.01) * 10
  background(0,0,10);
  var newPoint = {};
  var lastPoint = points[points.length-1];
  
  var dx = o * (lastPoint.y - lastPoint.x);
  var dy = lastPoint.x * (p - lastPoint.z) - lastPoint.y;
  var dz = lastPoint.x * lastPoint.y - b * lastPoint.z;
  
  newPoint.x = lastPoint.x + dx * tstep;
  newPoint.y = lastPoint.y + dy * tstep;
  newPoint.z = lastPoint.z + dz * tstep; 
 
  points.push(newPoint); 
  if (points.length > 4500) {
    var removeP = Math.abs(Math.random()*(points.length - 2000));
    points.splice(removeP,1);
  }
  iteration = 0;
  
  
  camera(width/2,height/2,-300+sin(frameCount * 0.01) * -1700);
  perspective(PI/20);
  translate(40,0,-10);
  //rotateZ(-45);
  rotateY(millis() / 9000);
  rotateZ(millis() / 30000);
  
  
  
  /* draw a line
beginShape();
  points.forEach(drawPoint);
endShape();
*/
  strokeWeight(0);
  points.forEach(drawPoint);
  
}

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
}


function drawPoint(pos) {
  
  push();
  translate(pos.x*zoom,pos.y*zoom,pos.z*zoom-80);
  var noiseScale = map(iteration, points.length, points.length-500, 0.1, 7, true);
  var alpha = map(iteration, points.length, points.length-400, 255, 70, true);
  if (Math.random() > 0.9995) {
    alpha = 200;
  }
  iteration++;
  fill(color(255,255,255,alpha));
    translate(noise(pos.y*5+millis()/5000)*noiseScale,noise(pos.z*5+millis()/6500)*noiseScale,noise(pos.x*5+millis()/5500)*noiseScale);
  sphere(0.3,4,4);
  pop();
} 


