/*
  Basic ESP8266 MQTT example

  This sketch demonstrates the capabilities of the pubsub library in combination
  with the ESP8266 board/library.

  It connects to an MQTT server then:
  - publishes "hello world" to the topic "outTopic" every two seconds
  - subscribes to the topic "inTopic", printing out any messages
    it receives. NB - it assumes the received payloads are strings not binary
  - If the first character of the topic "inTopic" is an 1, switch ON the ESP Led,
    else switch it off

  It will reconnect to the server if the connection is lost using a blocking
  reconnect function. See the 'mqtt_reconnect_nonblocking' example for how to
  achieve the same result without blocking the main loop.

  To install the ESP8266 board, (using Arduino 1.6.4+):
  - Add the following 3rd party board manager under "File -> Preferences -> Additional Boards Manager URLs":
       http://arduino.esp8266.com/stable/package_esp8266com_index.json
  - Open the "Tools -> Board -> Board Manager" and click install for the ESP8266"
  - Select your ESP8266 in "Tools -> Board"

*/

#include <ESP8266WiFi.h>
#include <PubSubClient.h>


// Update these with values suitable for your network.

const char* ssid = "HackTMsibiu";
const char* password = "hacktmsibiu";
const char* mqtt_server = "m2m.eclipse.org";
const int interval = 1000;
const char* id = "a716510f-2974-488c-8c1a-e33a143656ac";

WiFiClient espClient;
PubSubClient client(espClient);
long lastMsg = 0;
char msg[50];


void setup_wifi() {

  delay(10);
  // We start by connecting to a WiFi network
  Serial.println();
  Serial.print("Connecting to ");
  Serial.println(ssid);

  WiFi.begin(ssid, password);

  while (WiFi.status() != WL_CONNECTED) {
    delay(500);
    Serial.print(".");
  }

  randomSeed(micros());

  Serial.println("");
  Serial.println("WiFi connected");
  Serial.println("IP address: ");
  Serial.println(WiFi.localIP());
}

void reconnect() {
  // Loop until we're reconnected
  while (!client.connected()) {
    Serial.print("Attempting MQTT connection...");
    // Create a random client ID
    String clientId = "ESP8266Client-";
    clientId += String(random(0xffff), HEX);
    // Attempt to connect
    if (client.connect(clientId.c_str())) {
      Serial.println("connected");
      // Once connected, publish an announcement...
      client.publish("hacktmsibiu", "hello world");
      // ... and resubscribe
      //client.subscribe("hacktmsibiu");
    } else {
      Serial.print("failed, rc=");
      Serial.print(client.state());
      Serial.println(" try again in 5 seconds");
      // Wait 5 seconds before retrying
      delay(5000);
    }
  }
}

void setup() {
  pinMode(BUILTIN_LED, OUTPUT);     // Initialize the BUILTIN_LED pin as an output
  Serial.begin(115200);
  setup_wifi();
  client.setServer(mqtt_server, 1883);
}


void send_data(char* channel, float value)
{
  if (!client.connected()) {
    reconnect();
  }
  client.loop();
  
  char pChannel[100];
  snprintf(pChannel, 100, "hacktmsibiu/%s/%s", id, channel);
  snprintf (msg, 75, "%f", value);
  Serial.print("Publish message:");
  Serial.print(pChannel);
  Serial.print("  ");
  Serial.println(msg);
  client.publish(pChannel, msg);
}


void send_data(char* channel, double latitude, double longitude)
{
  if (!client.connected()) {
    reconnect();
  }
  client.loop();


  char pChannel[100];
  snprintf(pChannel, 100, "hacktmsibiu/%s/%s", id, channel);
  snprintf (msg, 75, "%f;%f", latitude,longitude);
  Serial.print("Publish message:");
  Serial.print(pChannel);
  Serial.print("  ");
  Serial.println(msg);
  client.publish(pChannel, msg);
}



void loop() {
// EXAMPLES
  long now = millis();
  if (now - lastMsg > interval) {
    lastMsg = now;
    send_data("noise", 4.5f);
    send_data("coordinates", 12.45678d, 14.58974d);
  }
}
