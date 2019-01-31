
//  Wait until DOM is loaded
$(document).ready(function () {
  
  // Initialize Firebase
  var config = {
    apiKey: "AIzaSyB8KYO0f98nGoqdEVfFhYinq6ux-1cWuNY",
    authDomain: "train-scheduler-63d00.firebaseapp.com",
    databaseURL: "https://train-scheduler-63d00.firebaseio.com",
    projectId: "train-scheduler-63d00",
    storageBucket: "train-scheduler-63d00.appspot.com",
    messagingSenderId: "1059878096912"
  };
  firebase.initializeApp(config);
  var database = firebase.database();

  // Selectors
  var selectors = {
    button: "#add-train-btn"
  };

  // Classes
  classes = {};

  // Events

  $(selectors.button).on("click", function(event) {
    console.log($(selectors.button));
    event.preventDefault();
  });

  // Helpers


});