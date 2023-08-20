#include <Servo.h>

int throttle = 1500;
unsigned long lastThrottle;

Servo pusherESC;
Servo wheelservo;

void setup() {
  Serial.begin(115200);
  Serial.println("Start init of TeslaRC");
  /* init wheel */
  wheelservo.attach(2);

  /* init esc */
  pusherESC.attach(4);
  pusherESC.writeMicroseconds(1500); //arm
  Serial.println("Initialization completed, waiting for ESC");
  delay(2000);
  Serial.println("ESC armed successfully");
}

int throttlee;

void loop() {
  if (Serial.available() > 0) {
    throttlee = Serial.parseInt();

    if (throttlee >= 1000 && throttlee <= 2000) {
      Serial.print("set to ");
      Serial.println(throttlee);
      pusherESC.writeMicroseconds(throttlee);
      throttle = throttlee;
    } else if (throttlee >= 2001 && throttle <= 2181) {
      int wheel = throttlee - 2001;
      wheelservo.write(wheel);
      
    } else {
      Serial.println("invalid");
    }
  }
}
