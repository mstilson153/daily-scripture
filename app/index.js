/*
    Daily Scripture - A small app to get the verse of the day from OurMana.
    Copyright (C) 2020  Michael Stilson

    This program is free software: you can redistribute it and/or modify
    it under the terms of the GNU General Public License as published by
    the Free Software Foundation, either version 3 of the License, or
    (at your option) any later version.

    This program is distributed in the hope that it will be useful,
    but WITHOUT ANY WARRANTY; without even the implied warranty of
    MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
    GNU General Public License for more details.

    You should have received a copy of the GNU General Public License
    along with this program.  If not, see <https://www.gnu.org/licenses/>.
*/

// Import the messaging module
import * as messaging from "messaging";
import document from "document";
import * as fs from "fs";

let versetext = document.getElementById("verse");

// Request verse data from the companion
function fetchVerse() {
  if (messaging.peerSocket.readyState === messaging.peerSocket.OPEN) {
    // Send a command to the companion
    messaging.peerSocket.send({
      command: 'verse'
    });
  }
}

// Display the verse data received from the companion
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
    // Fetch verse when the connection opens
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

  // Fetch the verse every 30 minutes
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