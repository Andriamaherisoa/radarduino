// Include the Servo library 
#include <Servo.h> 
// Declare the Servo pin 
int servoPin = 12; 
int rotationSpeed = 10;

const int trigPin = 10;
const int echoPin = 11;

// Variables for the duration and the distance
long duration;
int distance;

Servo Servo1; 

void setup() { 
  Serial.begin(9600);
   Servo1.attach(servoPin); 
   pinMode(trigPin, OUTPUT);
   pinMode(echoPin, INPUT);   
}

void loop(){ 
    
   for(int pos=0;pos<=180;pos++){  
    Servo1.write(pos);
    delay(rotationSpeed);    
    calculateDistance(pos);
  }
  // Repeats the previous lines from 165 to 15 degrees
  for(int pos=180; pos> 0; pos--){  
    Servo1.write(pos);
    delay(rotationSpeed);   
    calculateDistance(pos);
  }

}

int calculateDistance(int pos){   
  digitalWrite(trigPin, LOW);
  delayMicroseconds(2);
  digitalWrite(trigPin, HIGH);
  delayMicroseconds(10);
  digitalWrite(trigPin, LOW);
  duration = pulseIn(echoPin, HIGH); // Reads the echoPin, returns the sound wave travel time in microseconds
  distance = 100.0*(343.0*(duration/2.0))/1000000.0;
  // distance= duration*0.034/2;
  Serial.print(pos); // position of servo motor
  Serial.print(","); // comma separate variables
  Serial.print(distance); // print distance in cm
  Serial.print(".");
}
