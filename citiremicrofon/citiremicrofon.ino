unsigned int citiri[1000];
int sensorPin = 0;
unsigned int sensorValue;
unsigned int pozitie_libera=0; 
unsigned int i;

void setup() {
  Serial.begin(250000);
  Serial.println("am inceput");
}

void loop() {
  sensorValue = analogRead(sensorPin);
  if ( pozitie_libera == 1000) {
    for (i=0;i<1000;i++)
    { 
       Serial.print(citiri[i]);
       Serial.print(" ");
       if (i%20==0){
          Serial.println();
       }
    }
    pozitie_libera=0;
  }
  citiri[pozitie_libera]=sensorValue;
  pozitie_libera=pozitie_libera+1;
  delayMicroseconds(8);
}








 
