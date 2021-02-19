var angle, distance, data = '';
var noObject,
    pixDistance,
    iAngle, 
    iDistance;
var index1 = index2 = 0;

var serial;
let portName = '';

function setup() {
    createCanvas(1920, 1080);
    smooth();
    serial = new p5.SerialPort();
    
    serial.list();

    serial.open('/dev/tty.usbmodem14501');
    

  // Assuming our Arduino is connected, let's open the connection to it
  // Change this to the name of your arduino's serial port  

  // Register some callbacks

  // When we connect to the underlying server
  serial.on('connected', serverConnected);

  // When we get a list of serial ports that are available
  serial.on('list', gotList);

  // When we some data from the serial port
  serial.on('data', gotData);

  // When or if we get an error
  serial.on('error', gotError);

  // When our serial port is opened and ready for read/write
  serial.on('open', gotOpen);
}

// We are connected and ready to go
function serverConnected() {
    print("We are connected!");
}

// Got the list of ports
function gotList(thelist) {
  // theList is an array of their names
  for (let i = 0; i < thelist.length; i++) {
    // Display in the console 
    print(thelist[i]);   
    if(thelist[i].startsWith('/dev/tty.usbmodem')) {
        portName = thelist[i];
    }
  }
}

// Connected to our serial device
function gotOpen() {
  print("Serial Port is open!");
}

// Ut oh, here is an error, let's log it
function gotError(theerror) {
  print(theerror);
}

// There is data available to work with from the serial port
function gotData() {    

   // reads the data from the Serial Port up to the character '.' and puts it into the String variable "data".
   data = serial.readStringUntil('.');
   data = data.substring(0,data.length-1);
   
   index1 = data.indexOf(","); // find the character ',' and puts it into the variable "index1"
   angle= data.substring(0, index1); // read the data from position "0" to position of the variable index1 or thats the value of the angle the Arduino Board sent into the Serial Port
   distance= data.substring(index1+1, data.length); // read the data from position "index1" to the end of the data pr thats the value of the distance
   
   // converts the String variables into Integer
   iAngle = Number(angle);
   iDistance = Number(distance);
}
  
function draw() {        
    fill(98,245,31);
    noStroke();
    fill(0,4); 
    rect(0, 0, width, 1010); 
    
    fill(98,245,31); // green color
    // calls the functions for drawing the radar
    drawRadar(); 
    drawLine();
    drawObject();
    drawText();
}

// socket.on("moving", (val) => { 
//     // reads the data from the Serial Port up to the character '.' and puts it into the String variable "data".
//     data = val.substring(0, val.indexOf('.'));
//     data = data.substring(0, data.length-1);
    
//     index1 = data.indexOf(","); // find the character ',' and puts it into the variable "index1"
//     angle = data.substring(0, index1); // read the data from position "0" to position of the variable index1 or thats the value of the angle the Arduino Board sent into the Serial Port
//     distance = data.substring(index1+1, data.length); // read the data from position "index1" to the end of the data pr thats the value of the distance
    
//     // converts the String variables into Integer
//     iAngle = Number(angle);
//     iDistance = Number(distance);           
//   });

function drawRadar() {
    push();
    translate(960,1000); // moves the starting coordinats to new location
    noFill();
    strokeWeight(2);
    stroke(98,245,31);
    // draws the arc lines
    arc(0,0,1800,1800,PI,TWO_PI);
    arc(0,0,1400,1400,PI,TWO_PI);
    arc(0,0,1000,1000,PI,TWO_PI);
    arc(0,0,600,600,PI,TWO_PI);
    // draws the angle lines
    line(-960,0,960,0);
    line(0,0,-960*cos(radians(30)),-960*sin(radians(30)));
    line(0,0,-960*cos(radians(60)),-960*sin(radians(60)));
    line(0,0,-960*cos(radians(90)),-960*sin(radians(90)));
    line(0,0,-960*cos(radians(120)),-960*sin(radians(120)));
    line(0,0,-960*cos(radians(150)),-960*sin(radians(150)));
    line(-960*cos(radians(30)),0,960,0);
    pop();
  }

  function drawObject() {
    push();
    translate(960,1000); // moves the starting coordinats to new location
    strokeWeight(9);
    stroke(255,10,10); // red color
    pixsDistance = iDistance*22.5; // covers the distance from the sensor from cm to pixels
    // limiting the range to 40 cms
    if(iDistance<40){
      // draws the object according to the angle and the distance
    line(pixsDistance*cos(radians(iAngle)),-pixsDistance*sin(radians(iAngle)),950*cos(radians(iAngle)),-950*sin(radians(iAngle)));
    }
    pop();
  }
  
  function drawLine() {
    push();
    strokeWeight(9);
    stroke(30,250,60);
    translate(960,1000); // moves the starting coordinats to new location
    line(0,0,950*cos(radians(iAngle)),-950*sin(radians(iAngle))); // draws the line according to the angle
    pop();
  }
  
  function drawText() { // draws the texts on the screen
    
    push();
    if(iDistance>40) {
    noObject = "Out of Range";
    }
    else {
    noObject = "In Range";
    }
    fill(0,0,0);
    noStroke();
    rect(0, 1010, width, 1080);
    fill(98,245,31);
    textSize(25);
    text("10cm",1180,990);
    text("20cm",1380,990);
    text("30cm",1580,990);
    text("40cm",1780,990);
    textSize(40);
    text("Object: " + noObject, 240, 1050);
    text("Angle: " + iAngle +" °", 1050, 1050);
    text("Distance: ", 1380, 1050);
    if(iDistance<40) {
    text("        " + iDistance +" cm", 1400, 1050);
    }
    textSize(25);
    fill(98,245,60);
    translate(961+960*cos(radians(30)),982-960*sin(radians(30)));
    rotate(-radians(-60));
    text("30°",0,0);
    resetMatrix();
    translate(954+960*cos(radians(60)),984-960*sin(radians(60)));
    rotate(-radians(-30));
    text("60°",0,0);
    resetMatrix();
    translate(945+960*cos(radians(90)),990-960*sin(radians(90)));
    rotate(radians(0));
    text("90°",0,0);
    resetMatrix();
    translate(935+960*cos(radians(120)),1003-960*sin(radians(120)));
    rotate(radians(-30));
    text("120°",0,0);
    resetMatrix();
    translate(940+960*cos(radians(150)),1018-960*sin(radians(150)));
    rotate(radians(-60));
    text("150°",0,0);
    pop(); 
  }
    


