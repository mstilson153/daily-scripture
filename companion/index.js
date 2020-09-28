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
import { me as companion } from "companion";

var ENDPOINT = "https://www.ourmanna.com/verses/api/get/?format=text";

function queryOurmana() {
  fetch(ENDPOINT)
  .then(function (response) {
      response.text()
      .then(function(data) {
        var verse = data
        // Print verse
        console.log("Verse is: " + verse);
        // Send the verse to the device
        returnVerseData(verse);
      });
  })
  .catch(function (err) {
    console.log("Error fetching weather: " + err);
  });
}

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
    if (!companion.permissions.granted("access_internet")) {
      let consoleMsg = "Permissions to access the internet is not granted. Please grant permissions through the Fitbit app to allow us to get the verse.";
      console.log("We're not allowed to access the internet!");
      returnVerseData(consoleMsg);
    } else {
      queryOurmana();
    }
  }
}

// Listen for the onerror event
messaging.peerSocket.onerror = function(err) {
  // Handle any errors
  console.log("Connection error: " + err.code + " - " + err.message);
}