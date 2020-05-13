// Import the messaging module
import * as messaging from "messaging";
import document from "document";
import * as fs from "fs";

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
  saveVerseToFile(data);
  updateScreen();
  //versetext.text = data;
}

function recieveData() {
  console.log("Begin Companion messaging.");
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
  setInterval(fetchVerse, 60 * 1000 * 60);
}

function updateScreen() {
  console.log("Updating verse on screen.");
  console.log("Reading verse from file.");
  var asciiRead = fs.readFileSync("/private/data/verse.txt", "ascii");
  console.log("Verse read from file.");
  console.log("Verse is: " + asciiRead);
  console.log("Setting verse on display.");
  versetext.text = asciiRead;
}

function saveVerseToFile(verseString) {
  console.log("Saving verse to file.")
  fs.writeFileSync("/private/data/verse.txt", verseString, "ascii");
  console.log("Verse wrote to /private/data/verse.txt");
}

if (fs.existsSync("/private/data/verse.txt")) {
  console.log("file exists!");
  updateScreen();
  recieveData();
} else {
  console.log("file does not exist!")
  recieveData();
}