
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
    button: "#add-train-btn",
    trainTable: "#train-table"
  };

  // Classes
  classes = {};

  // Events

  $(selectors.button).on("click", function(event) {
    event.preventDefault();

    // Grabs user input
    var trainName = $("#train-name-input").val().trim();
    var trainDestination = $("#destination-input").val().trim();
    var firstTrainTime = moment($("#first-train-time-input").val().trim(), "HH:mm").format("X");
    var trainFrequency = $("#frequency-input").val().trim();

    // Creates temporary object for holding train data
    var newTrain = {
      train: trainName,
      destination: trainDestination,
      firstJourney: firstTrainTime,
      frequency: trainFrequency
    };

    // Uploads train data to the database
    database.ref().push(newTrain);

    // Clears all of the text-boxes
    $("#train-name-input").val("");
    $("#destination-input").val("");
    $("#first-train-time-input").val("");
    $("#frequency-input").val("");
  });

  database.ref().on("child_added", function (snapshot) {
    var train = snapshot.val().train;
    var destination = snapshot.val().destination;
    var firstJourney = snapshot.val().firstJourney;
    var frequency = snapshot.val().frequency;

    var newRow = $("<tr><td>" + train + "</td>" +
      "<td>" + destination + "</td>" +
      "<td>" + frequency + "</td>" +
      "<td>" + "Some value" + "</td>" +
      "<td>" + "Some other value" + "</td></tr>");

    $(selectors.trainTable).append(newRow);

  }, function (errorObject) {
    console.log("The read failed: " + errorObject.code);
  });

  // Helpers


});