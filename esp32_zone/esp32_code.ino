#include <WiFi.h>
#include <HTTPClient.h>
#include "DHT.h"

// WiFi credentials
const char* ssid = "Your_SSID";
const char* password = "Your_PASSWORD";

// Server URL and API Key
const char* serverName = "https://your-backend-url.com/api/data";
const char* apiKey = "Your_SECRET_KEY";

// DHT22 setup
#define DHTPIN 4 // GPIO where the DHT22 is connected
#define DHTTYPE DHT22
DHT dht(DHTPIN, DHTTYPE);

// GP2Y1014AU setup
#define LED_PIN 5 // GPIO connected to the LED control pin
#define VO_PIN 34 // GPIO connected to the analog output pin

// MQ-135 setup
#define MQ135_PIN 35 // GPIO connected to the MQ-135 analog output

// Timing
unsigned long previousMillis = 0;
const long interval = 60000; // Send data every 60 seconds

void setup() {
  Serial.begin(115200);

  // Initialize DHT sensor
  dht.begin();

  // Initialize WiFi
  WiFi.begin(ssid, password);
  Serial.print("Connecting to WiFi");
  while (WiFi.status() != WL_CONNECTED) {
    delay(1000);
    Serial.print(".");
  }
  Serial.println("\nConnected to WiFi");
}

void loop() {
  unsigned long currentMillis = millis();

  // Send data at regular intervals
  if (currentMillis - previousMillis >= interval) {
    previousMillis = currentMillis;

    // Read sensor data
    float temperature = dht.readTemperature();
    float humidity = dht.readHumidity();
    float dustDensity = readDustDensity();
    int gasLevel = analogRead(MQ135_PIN);

    // Ensure valid readings
    if (isnan(temperature) || isnan(humidity) || dustDensity < 0) {
      Serial.println("Failed to read from sensors!");
      return;
    }

    // Send data to server
    sendDataToServer(temperature, humidity, dustDensity, gasLevel);
  }
}

// Read dust density from GP2Y1014AU
float readDustDensity() {
  digitalWrite(LED_PIN, LOW); // Turn on the LED
  delayMicroseconds(280);

  int voMeasured = analogRead(VO_PIN);
  delayMicroseconds(40);

  digitalWrite(LED_PIN, HIGH); // Turn off the LED
  delayMicroseconds(9680);

  // Convert voltage to dust density
  float voltage = voMeasured * (5.0 / 4095.0);
  float dustDensity = (voltage - 0.1) * 1000.0 / 5.0;

  return dustDensity;
}

// Send data to server
void sendDataToServer(float temperature, float humidity, float dustDensity, int gasLevel) {
  if (WiFi.status() == WL_CONNECTED) {
    HTTPClient http;

    // Prepare JSON payload
    String jsonData = "{\"temperature\":";
    jsonData += String(temperature, 2);
    jsonData += ",\"humidity\":";
    jsonData += String(humidity, 2);
    jsonData += ",\"dust_density\":";
    jsonData += String(dustDensity, 2);
    jsonData += ",\"gas_level\":";
    jsonData += String(gasLevel);
    jsonData += "}";

    // Send HTTP POST request
    http.begin(serverName);
    http.addHeader("Content-Type", "application/json");
    http.addHeader("x-api-key", apiKey);

    int httpResponseCode = http.POST(jsonData);

    if (httpResponseCode > 0) {
      Serial.print("HTTP Response code: ");
      Serial.println(httpResponseCode);
    } else {
      Serial.print("Error code: ");
      Serial.println(httpResponseCode);
    }
    http.end();
  } else {
    Serial.println("WiFi Disconnected");
  }
}
