// Import the messaging module
import * as messaging from "messaging";
import document from "document";

let versetext = document.getElementById("verse");

// Request weather data from the companion
function fetchVerse() {
  if (messaging.peerSocket.readyState === messaging.peerSocket.OPEN) {
    // Send a command to the companion
    messaging.peerSocket.send({
      command: 'verse'
    });
  }
}

// Display the weather data received from the companion
function processVerseData(data) {
  console.log("Verse of the day is: " + data);
  versetext.text = data;
}

// Listen for the onopen event
messaging.peerSocket.onopen = function() {
  // Fetch weather when the connection opens
  fetchVerse();
}

// Listen for messages from the companion
messaging.peerSocket.onmessage = function(evt) {
  if (evt.data) {
    processVerseData(evt.data);
  }
}

// Listen for the onerror event
messaging.peerSocket.onerror = function(err) {
  // Handle any errors
  console.log("Connection error: " + err.code + " - " + err.message);
}

// Fetch the weather every 30 minutes
setInterval(fetchVerse, 30 * 1000 * 60);