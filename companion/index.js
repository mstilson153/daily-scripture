// Import the messaging module
import * as messaging from "messaging";
import { me as companion } from "companion";

if (!companion.permissions.granted("access_internet")) {
  console.log("We're not allowed to access the internet!");
}

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
        returnVerseData(verse);
      });
  })
  .catch(function (err) {
    console.log("Error fetching weather: " + err);
  });
}

// Send the weather data to the device
function returnVerseData(data) {
  if (messaging.peerSocket.readyState === messaging.peerSocket.OPEN) {
    // Send a command to the device
    messaging.peerSocket.send(data);
  } else {
    console.log("Error: Connection is not open");
  }
}

if (!companion.permissions.granted("access_internet")) {
  console.log("We're not allowed to access the internet!");
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