
//  Wait until DOM is loaded
$(document).ready(function () {

  // ---------- Initialize Firebase ---------- //

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


  // ---------- Selectors ---------- //

  var selectors = {
    button: "#add-train-btn",
    trainTable: "#train-table"
  };


  // ---------- Classes ---------- //

  classes = {};


  // ---------- Events ---------- //

  // Click submit button to add new train to db
  $(selectors.button).on("click", function (event) {
    event.preventDefault();

    // Grab user input
    var trainName = $("#train-name-input").val().trim();
    var trainDestination = $("#destination-input").val().trim();
    var firstTrainTime = moment($("#first-train-time-input").val().trim(), "HH:mm").format("X");
    var trainFrequency = $("#frequency-input").val().trim();

    // Create temporary object for holding train data
    var newTrain = {
      train: trainName,
      destination: trainDestination,
      firstTrainTime: firstTrainTime,
      frequency: trainFrequency
    };

    // Upload train data to the database
    // TODO better user input validation
    if (trainName && trainDestination && firstTrainTime && trainFrequency) {
      database.ref().push(newTrain);
    }
    else {
      alert("Invalid entry - please verify your information");
    }

    // Clear all of the text-boxes
    $("#train-name-input").val("");
    $("#destination-input").val("");
    $("#first-train-time-input").val("");
    $("#frequency-input").val("");
  });

  // Get db info to populate the current train schedule
  database.ref().on("child_added", function (snapshot) {
    // Get values from snapshot
    var train = snapshot.val().train;
    var destination = snapshot.val().destination;
    var firstTrainTime = snapshot.val().firstTrainTime;
    var frequency = snapshot.val().frequency;

    // Create new row
    var newRow = $("<tr>").append(
      $("<td>").text(train),
      $("<td>").text(destination),
      $("<td>").text(frequency),
      $("<td>").text(nextArrival(firstTrainTime, frequency).format("h:mm A")),
      $("<td>").text(minutesAway(firstTrainTime, frequency))
    );

    // Add new row to table
    $(selectors.trainTable).append(newRow);

  }, function (errorObject) {
    console.log("The read failed: " + errorObject.code);
  });


  // ---------- Helpers ---------- //

  function nextArrival(initialVoyage, trainFrequency) {
    var nextTrip = moment(initialVoyage, "X");
    while (nextTrip.isBefore(moment())) {
      nextTrip.add(trainFrequency, "minutes");
    }
    // Returns a moment object
    return nextTrip;
  }

  function minutesAway(initialVoyage, trainFrequency) {
    var nextTrip = nextArrival(initialVoyage, trainFrequency);
    // Returns a number
    return nextTrip.diff(moment(), 'minutes');
  }

});