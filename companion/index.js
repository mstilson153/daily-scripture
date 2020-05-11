// Import the messaging module
import * as messaging from "messaging";

var ENDPOINT = "https://www.ourmanna.com/verses/api/get/?format=text";

// Fetch the weather from OpenWeather
function queryOurmana() {
  fetch(ENDPOINT)
  .then(function (response) {
      response.text()
      .then(function(data) {
        // We just want the current temperature
        var verse = data
        // Print verse
        console.log("Verse is: " + verse);
        // Send the weather data to the device
        returnWeatherData(verse);
      });
  })
  .catch(function (err) {
    console.log("Error fetching weather: " + err);
  });
}

// Send the weather data to the device
function returnWeatherData(data) {
  if (messaging.peerSocket.readyState === messaging.peerSocket.OPEN) {
    // Send a command to the device
    messaging.peerSocket.send(data);
  } else {
    console.log("Error: Connection is not open");
  }
}

// Listen for messages from the device
messaging.peerSocket.onmessage = function(evt) {
  if (evt.data && evt.data.command == "verse") {
    // The device requested weather data
    queryOurmana();
  }
}

// Listen for the onerror event
messaging.peerSocket.onerror = function(err) {
  // Handle any errors
  console.log("Connection error: " + err.code + " - " + err.message);
}