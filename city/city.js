

// sets the overal resolution and dimension
var cellX = 150; //this sets the size per building
var rowsNum = 10;
var colsNum = 5;


var cellSpacing;
var minBuildingHeight;
var maxBuildingHeight;
var carLength;
var cellY;

// sets the properties of the greenery
var parkElevation = 5;
var parkFoliageHeight = 7;

// adds a hand drawn frame around the whole picture
var frameWidth = 20;

// set the drawing style
var isoAngle = 2.7;
var outLine = 1;

// set the line quality
var lineA = {squigPixels:1.1,squigDensity:7,squigProb:0.3}; // this is the default for all lines if not otherwise specified.
var lineB = {squigPixels:0.7,squigDensity:7,squigProb:0.5}; // used for people & antennas

var lineC = {squigPixels:2,squigDensity:2,squigProb:0.1}; // Vegetation
// squigPixels = amount of squiggle
// squigDensity = lower is more squigs per line length 
// squigProb = chances there will be NO squig




var fade = true;

var lineCount = 0;
var buildingCount = 0;

var colors = ["#0081A7","#00AFB9","#F07167","#FED9B7"];

//var colors = ['#fff'];

function setup() {
  //createCanvas(canvasWidth, canvasHeight);
  createCanvas(windowWidth, windowHeight);
  createCity();
  
}

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
  createCity();
}

function keyReleased() { 
  if (key === 'r') {
    createCity();
  }
  if (key === 'd') {
    saveCanvas('cityDrawing', 'png');
  }
  if (key === '1') {
    cellX = 100; //this sets the size per building
    createCity();
  }
  if (key === '2') {
    cellX = 120; //this sets the size per building
    createCity();
  }
  if (key === '3') {
    cellX = 150; //this sets the size per building
    createCity();
  }
  if (key === '4') {
    cellX = 200; //this sets the size per building
    createCity();
  }
  if (key === '5') {
    cellX = 250; //this sets the size per building
    createCity();
  }
  if (key === '6') {
    cellX = 300; //this sets the size per building
    createCity();
  }
}


function createCity() {

  // sets the macro architecture
  cellSpacing = cellX/8;
  cellY = cellX/isoAngle/2;
  minBuildingHeight = cellX/20;
  maxBuildingHeight = 3.5*cellX;

  // sets the architectural details
  carLength = cellX/50;

  //adjusting the city dimension to the viewport
  rowsNum = Math.ceil(windowHeight/cellY);
  colsNum = Math.ceil(windowWidth/cellX);

  lineCount = 0;
  buildingCount = 0;
  
  for (row = 0; row < rowsNum+1; row++) {
    
    if(row % 2 == 0) {
      cellOffset = cellX/4;
    } else {
      cellOffset = cellX/4*-1;
    }
    //console.log(cellOffset);
    
    // add haze
    if (fade) {
      background(color('rgba(255, 255, 255, 0.01)'));
    }
     
    for (col = 0; col < colsNum+1; col++) {
      drawFloor(col*cellX+cellOffset,row*cellY,cellX,'street');
      
      drawCars(col*cellX+cellOffset,row*cellY,cellX-cellSpacing/2);
      
      if (Math.random() > (row)/rowsNum/3) {
 //draw a sinle building onto this one cell
        
        buildingCount++;
        
        drawPeople(col*cellX+cellOffset,row*cellY,cellX-cellSpacing,50);
 
        drawBuilding(col*cellX+cellOffset,row*cellY,cellX/2.1+Math.random()*cellX/2.1-cellSpacing/2,constrain(random()*minBuildingHeight*(rowsNum-row),minBuildingHeight,maxBuildingHeight)); 
      } else if (Math.random() > 0.6) {
 // draw up to 4 building on one cell?
 
       buildingCount = buildingCount+4;
        drawBuilding(col*cellX+cellOffset,row*cellY-cellY/2,cellX/2-cellSpacing,constrain(random()*minBuildingHeight*(rowsNum-row),minBuildingHeight,maxBuildingHeight));
        drawBuilding(col*cellX+cellOffset-cellX/4,row*cellY,cellX/2-cellSpacing,constrain(random()*minBuildingHeight*(rowsNum-row),minBuildingHeight,maxBuildingHeight));
        drawBuilding(col*cellX+cellOffset+cellX/4,row*cellY,cellX/2-cellSpacing,constrain(random()*minBuildingHeight*(rowsNum-row),minBuildingHeight,maxBuildingHeight));
        drawBuilding(col*cellX+cellOffset,row*cellY+cellY/2,cellX/2-cellSpacing,constrain(random()*minBuildingHeight*(rowsNum-row),minBuildingHeight,maxBuildingHeight));
 
      } else if (random() > 0.4){
 
        // draw people for the park
     drawPeople(col*cellX+cellOffset,row*cellY,cellX-cellSpacing,random(20));
 
        // draw the actual park
        drawPark(col*cellX+cellOffset,row*cellY,cellX-cellSpacing/1.3,parkFoliageHeight,parkElevation);
        
      } else {
 // add a crowd to an otherwise empty square   
        drawPeople(col*cellX+cellOffset,row*cellY,cellX-cellSpacing,random(10,60));
 
        
      }
    }
  }
  
  console.log('lines: '+lineCount);
  console.log('buildings: '+buildingCount);
  
  
  
  //add foreground Building
  drawBuilding(frameWidth+cellX/3,windowHeight,cellX,cellX);
  
  drawBuilding(frameWidth+cellX,windowHeight,cellX,cellX*0.7);
  
  drawBuilding(width-frameWidth-ratio(cellX),windowHeight,cellX,cellX*1.1);
  
  addFrame(frameWidth);
}

function addFrame(frameWidth) {
  fill('#FFF');
  noStroke();
  width = windowWidth;
  height = windowHeight;
  rect(0,0,width,frameWidth);
  rect(0,height-2*frameWidth,width,2*frameWidth);
  rect(0,0,frameWidth,height);
  rect(width-frameWidth,0,frameWidth,height);
  // top
  
  drawLine([frameWidth,frameWidth],[width-frameWidth,frameWidth]);
  // bottom
  
  drawLine([frameWidth,height-2*frameWidth],[width-frameWidth,height-2*frameWidth]);
  // left
  drawLine([frameWidth,frameWidth],[frameWidth,height-2*frameWidth]);
  // right
  drawLine([width-frameWidth,frameWidth],[width-frameWidth,height-2*frameWidth]);
  
}

function draw() {
  //clear();
  //drawLine([100,100],[100,350]);
  //drawLine([200,100],[200,350]);
  //drawLine([300,100],[300,350]);
  
  //drawLine(randomPoint(),randomPoint());

  }


function randomPoint() {
  newPoint = [Math.floor(Math.random()*canvasWidth),Math.floor(Math.random()*canvasHeight)]; 
  return newPoint;
}

function offSet(value,config) {
  if (!config) {
    config = lineA;
  }
  return value + Math.random()*config.squigPixels-config.squigPixels/2;
}


function drawCars(shapeX,shapeY,shapeWidth,numCars) {
  var shapeHeight = ratio(shapeWidth);
  
  //draw trees
  
  for (car = 0; car < shapeWidth; car=car+random(cellX/45,cellX/4) ) {
    
    xOffset = car-shapeWidth/2;
    length = random(carLength/2,carLength);
    if (car < shapeWidth/2) {
      yOffset = ratio(-car);
      yLength = ratio(length);
      drawLine([shapeX+xOffset,shapeY-yOffset],[shapeX+xOffset+length,shapeY-yOffset+yLength],lineB);
      drawLine([shapeX+shapeWidth/2+xOffset,shapeY-yOffset-shapeHeight/2],[shapeX+shapeWidth/2+xOffset+length,shapeY-yOffset-shapeHeight/2+yLength],lineB);
    
    } else {
      yOffset = ratio(car-shapeWidth);
      yLength = -ratio(length);
      drawLine([shapeX+xOffset,shapeY-yOffset],[shapeX+xOffset+length,shapeY-yOffset+yLength],lineB);
      drawLine([shapeX-shapeWidth/2+xOffset,shapeY-yOffset-shapeHeight/2],[shapeX-shapeWidth/2+xOffset+length,shapeY-yOffset-shapeHeight/2+yLength],lineB);
    
    
    }
    
  }
  
  
  
}

function drawPeople(xPos,yPos,width,numPeople) {
  for (a = 0; a < numPeople; a++) {
    var personX = random(width)-width/2;
    var plusOrMinus = Math.random() < 0.5 ? -1 : 1;
var personY = ratio(random(width/2-Math.abs(personX)))*plusOrMinus;
                
    
    
    drawLine([xPos+personX,yPos-personY],[xPos+personX,yPos-personY-2],lineB);
  }
}

function drawPark(shapeX,shapeY,shapeWidth,parkHeight,parkFloat) {
  var shapeDepth = ratio(shapeWidth);
  var trunkWidth = shapeWidth-cellSpacing/2;
  shapeY = shapeY - parkFloat;
  
  //draw shade
  
  drawShape(shapeX-shapeWidth/2,shapeY+parkHeight,shapeX,shapeY+shapeDepth/2+parkHeight,shapeX+shapeWidth/2,shapeY+parkHeight,shapeX,shapeY-shapeDepth/2+parkHeight,'rgba(70,30,0,0.2)');
  
  //draw trees
  
  for (p = 0; p < trunkWidth; p=p+random(cellX/50,cellX/15) ) {
    
    xOffset = p-trunkWidth/2;
    if (p < trunkWidth/2) {
      yOffset = ratio(-p)-parkFloat;  
    } else {
      yOffset = ratio(p-trunkWidth)-parkFloat;
    }
    drawLine([shapeX+xOffset,shapeY-yOffset],[shapeX+xOffset,shapeY-yOffset-parkFloat],lineB);
  }
  
  //drawbackgrounds
  //top
    drawShape(shapeX-shapeWidth/2,shapeY-parkHeight,shapeX,shapeY+shapeDepth/2-parkHeight,shapeX+shapeWidth/2,shapeY-parkHeight,shapeX,shapeY-shapeDepth/2-parkHeight,'#AC9');
  //left face
  drawShape(shapeX-shapeWidth/2,shapeY,shapeX,shapeY+shapeDepth/2,shapeX,shapeY+shapeDepth/2-parkHeight,shapeX-shapeWidth/2,shapeY-parkHeight,'#8A6');
  //right face
  drawShape(shapeX+shapeWidth/2,shapeY,shapeX,shapeY+shapeDepth/2,shapeX,shapeY+shapeDepth/2-parkHeight,shapeX+shapeWidth/2,shapeY-parkHeight,'#AC9');
  
  
    
    //bottom left to front
    drawLine([shapeX-shapeWidth/2,shapeY],[shapeX,shapeY+shapeDepth/2],lineC);
    //bottom front to right
    drawLine([shapeX,shapeY+shapeDepth/2],[shapeX+shapeWidth/2,shapeY],lineC);
    

    //top left to back
    drawLine([shapeX-shapeWidth/2,shapeY-parkHeight],[shapeX,shapeY-shapeDepth/2-parkHeight],lineC);
    //top back to right
    drawLine([shapeX,shapeY-shapeDepth/2-parkHeight],[shapeX+shapeWidth/2,shapeY-parkHeight],lineC);
  
  //left elevation 
  drawLine([shapeX-shapeWidth/2,shapeY],[shapeX-shapeWidth/2,shapeY-parkHeight],lineC);
  
  //right elevation
  drawLine([shapeX+shapeWidth/2,shapeY],[shapeX+shapeWidth/2,shapeY-parkHeight],lineC);

  
  // add shading
  
  for (p = 0; p < shapeWidth; p=p+random(cellX/10,cellX/30) ) {
    
    xOffset = p-shapeWidth/2;
    if (p < shapeWidth/2) {
      yOffset = ratio(-p);  
    } else {
      yOffset = ratio(p-shapeWidth);
    }
    drawLine([shapeX+xOffset,shapeY-yOffset],[shapeX+xOffset,shapeY-yOffset-random(parkHeight/4,parkHeight/1.5)]);
  }

  
  
}

function ratio(input) {
  return input/isoAngle;
}

function drawFloor(shapeX,shapeY,shapeWidth,type) {
  
  var shapeDepth = ratio(shapeWidth);
  
  if (type == 'street') {
    // street color
    drawShape(shapeX-shapeWidth/2,shapeY,shapeX,shapeY+shapeDepth/2,shapeX+shapeWidth/2,shapeY,shapeX,shapeY-shapeDepth/2,'#CCC');
    
    //adding the padding
    shapeWidth = shapeWidth-cellSpacing;
    var shapeDepth = ratio(shapeWidth)
    
    //side walk color;
    drawShape(shapeX-shapeWidth/2,shapeY,shapeX,shapeY+shapeDepth/2,shapeX+shapeWidth/2,shapeY,shapeX,shapeY-shapeDepth/2,'#EEE');   
    
    
    //bottom left to front
    drawLine([shapeX-shapeWidth/2,shapeY],[shapeX,shapeY+shapeDepth/2]);
    //bottom front to right
    drawLine([shapeX,shapeY+shapeDepth/2],[shapeX+shapeWidth/2,shapeY]);
    

    //top left to back
    drawLine([shapeX-shapeWidth/2,shapeY],[shapeX,shapeY-shapeDepth/2]);
    //top back to right
    drawLine([shapeX,shapeY-shapeDepth/2],[shapeX+shapeWidth/2,shapeY]);


  }
}

function drawBuilding(houseX,houseY,houseWidth,houseHeight) {
  //function to draw isometric buildings
  var houseDepth = ratio(houseWidth);
  
  //drawbackgrounds
  //left face
  drawShape(houseX-houseWidth/2,houseY,houseX,houseY+houseDepth/2,houseX,houseY+houseDepth/2-houseHeight,houseX-houseWidth/2,houseY-houseHeight,'#DDD');
  //right face
  drawShape(houseX+houseWidth/2,houseY,houseX,houseY+houseDepth/2,houseX,houseY+houseDepth/2-houseHeight,houseX+houseWidth/2,houseY-houseHeight,'#FFF');
  //top face
  drawShape(houseX-houseWidth/2,houseY-houseHeight,houseX,houseY+houseDepth/2-houseHeight,houseX+houseWidth/2,houseY-houseHeight,houseX,houseY-houseDepth/2-houseHeight,'#EEE');
    
  
  for (a = 0; a < outLine; a++) {
    //bottom left to front
    drawLine([houseX-houseWidth/2,houseY],[houseX,houseY+houseDepth/2]);
    //bottom front to right
    drawLine([houseX,houseY+houseDepth/2],[houseX+houseWidth/2,houseY]);
    

    //top left to back
    drawLine([houseX-houseWidth/2,houseY-houseHeight],[houseX,houseY-houseDepth/2-houseHeight]);
    //top back to right
    drawLine([houseX,houseY-houseDepth/2-houseHeight],[houseX+houseWidth/2,houseY-houseHeight]);

    //vertical lines
    drawLine([houseX-houseWidth/2,houseY],[houseX-houseWidth/2,houseY-houseHeight]);
    drawLine([houseX+houseWidth/2,houseY],[houseX+houseWidth/2,houseY-houseHeight]);
  }
  
  // inner lines
  // front endge
  //drawLine([houseX,houseY+houseDepth/2],[houseX,houseY-houseHeight+houseDepth/2]);
  //top left to front
    drawLine([houseX-houseWidth/2,houseY-houseHeight],[houseX,houseY+houseDepth/2-houseHeight]);
    //top front to right
    drawLine([houseX,houseY+houseDepth/2-houseHeight],[houseX+houseWidth/2,houseY-houseHeight]);
  
  // draw shading each side of the building
  // left
  for (b = houseHeight-4; b > 2; b=b-4 ) {
    drawLine([houseX-houseWidth/2,houseY-b],[houseX,houseY+houseDepth/2-b]);
  }
  // right
  for (b = houseHeight-6; b > 4; b=b-6 ) {
    drawLine([houseX+houseWidth/2,houseY-b],[houseX,houseY+houseDepth/2-b]);
  }
  
  if (Math.random() > 0.8){
  drawPeople(houseX,houseY-houseHeight,houseWidth,random(5,10));
    }
  
  // recursion happens here
  if (Math.random() > 0.5 && houseWidth > cellX/8) {
    drawBuilding(houseX,houseY-houseHeight,houseWidth/(0.9+Math.random()/1.5),houseHeight/2*Math.random()+5);
  } else if (houseWidth > cellX/1.5 ) {
    drawBuilding(houseX-houseWidth/4,houseY-houseHeight,houseWidth/2,houseHeight/2*Math.random()+5);
  } else {
    // draw Antennas on the roof
    if (Math.random() > row/rowsNum) {
    drawAntennas(houseX, houseY,houseWidth,houseHeight, cellX/30,cellX/7);
    }
    
    if (Math.random() > 0.95) {
      drawPark(houseX,houseY-houseHeight,houseWidth-cellSpacing/2,parkFoliageHeight/2,parkElevation/2);
    }
 
    
  } 
  
  if (Math.random() > 0.4) {
    drawAdvert(houseX,houseY,houseWidth, houseHeight);
  }
}


function drawShape(a,b,c,d,e,f,g,h,fillColor) {
  fill(fillColor);
  noStroke();
  quad(a,b,c,d,e,f,g,h);
}

function drawLine(pointA,pointB,config) {
 
  lineCount++;
  points = [];
  if (!config) {
    config = lineA;
  }
  
  points.push(pointA,[offSet(pointA[0],config),offSet(pointA[1],config)]); // start point twice due to the nature of curve algrorithm
  
  // this is where we add the squiggles
  xLength = (pointB[0]-pointA[0]);
  yLength = pointB[1]-pointA[1];
  lineLength = Math.sqrt(xLength*xLength+yLength*yLength);
  
  
  
  division = Math.floor(lineLength/config.squigDensity);
  xinc = (pointB[0]-pointA[0])/division;
  yinc = (pointB[1]-pointA[1])/division;
  for (i = 1; i < division; i++) {
    if (Math.random() > config.squigProb) {
     points.push([offSet(pointA[0]+xinc*i,config),offSet(pointA[1]+yinc*i,config)]); 
      
    }
  }
  
  // points.push(randomPoint());
  
  points.push([offSet(pointB[0],config),offSet(pointB[1]),config],pointB);
  
  beginShape();
  stroke(1);
  noFill();

  for (i = 0; i < points.length; i++) {
    curveVertex(points[i][0],points[i][1]);
  }
  
  endShape();
}


function randColor() {  
  return colors[Math.floor(Math.random()*colors.length)];
  
}

function drawAdvert(xPos,yPos, buildingWidth,buildingHeight) {
  var aHeight = ratio(buildingHeight)*Math.random();
  var aWidth = buildingWidth/2*Math.random();
  
  if (aHeight > cellX/20 && aWidth > cellX/10) {
    if (Math.random() > 0.5) {
      // right facing
   var aX = xPos+
       (buildingWidth/2-aWidth)*Math.random()+2; 
    var aY = yPos-buildingHeight+(buildingHeight-aHeight)*Math.random();
    var aShift = ratio(aWidth);
  drawShape(aX,aY+aShift,aX+aWidth,aY,aX+aWidth,aY+aHeight,aX,aY+aHeight+aShift,randColor());
    drawLine([aX,aY+aShift],[aX+aWidth,aY]);
    drawLine([aX+aWidth,aY],[aX+aWidth,aY+aHeight]);
    drawLine([aX+aWidth,aY+aHeight],[aX,aY+aHeight+aShift]);
    drawLine([aX,aY+aHeight+aShift],[aX,aY+aShift]);
    } else {
      // left facing
   var aX = xPos-
       (buildingWidth/2-aWidth)*Math.random()-2; 
    var aY = yPos-buildingHeight+(buildingHeight-aHeight)*Math.random();
    var aShift = ratio(aWidth);
  drawShape(aX,aY+aShift,aX-aWidth,aY,aX-aWidth,aY+aHeight,aX,aY+aHeight+aShift,randColor());
    drawLine([aX,aY+aShift],[aX-aWidth,aY]);
    drawLine([aX-aWidth,aY],[aX-aWidth,aY+aHeight]);
    drawLine([aX-aWidth,aY+aHeight],[aX,aY+aHeight+aShift]);
    drawLine([aX,aY+aHeight+aShift],[aX,aY+aShift]);
    }
  }
  
}

function drawAntennas(xPos, yPos, houseWidth, houseHeight, minHeight,maxHeight) {
  aNum = 3-Math.random()*8;
  for (c = 0; c < aNum; c++) {
    height = constrain(Math.random()*maxHeight,minHeight,maxHeight);
    aX = Math.random()*(houseWidth-8)-(houseWidth-8)/2+xPos;
    aY = yPos-houseHeight;
    drawLine([aX,aY],[aX,aY-height],lineB);
    if (Math.random() > 0.5) {
      drawLine([aX-2,aY],[aX-2,aY-height],lineB);
    } else {
      drawLine([aX-2,aY-height],[aX+2,aY-height],lineB);  
    } 
    
    }
}


