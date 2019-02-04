
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
    button: '#add-train-btn',
    trainTable: '#train-table',
    modalBody: '#modal-body',
    modalAlert: '#modal-alert'
  };

  // Regex patterns for input validation
  var patterns = {
    trainNamePattern: /\w+/,
    trainDestinationPattern: /\w+/,
    trainTimePattern: /\d{1,2}:\d{2}/,
    trainFrequencyPattern: /\d+/
  }


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

    // Input validation
    if (!patterns.trainNamePattern.test(trainName)) {
      // alert('Train name must not be empty');
      $(selectors.modalBody).text('Train Name must not be empty.');
      $(selectors.modalAlert).modal('show');
      return;
    }
    if (!patterns.trainDestinationPattern.test(trainDestination)) {
      $(selectors.modalBody).text('Destination must not be empty.');
      $(selectors.modalAlert).modal('show');
      return;
    } 
    // Test against the original text field string instead of the moment object
    if (!patterns.trainTimePattern.test($("#first-train-time-input").val().trim())) { 
      $(selectors.modalBody).text('First Train Time must use the following format: HH:mm.');
      $(selectors.modalAlert).modal('show');
      return;
    }
    if (!patterns.trainFrequencyPattern.test(trainFrequency)) {
      $(selectors.modalBody).text('Frequency must be a number.');
      $(selectors.modalAlert).modal('show');
      return;
    }
    
    // Upload train data to the database
    database.ref().push(newTrain);

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

  // Returns a moment object representing the next arrival time
  function nextArrival(initialVoyage, trainFrequency) {
    var nextTrip = moment(initialVoyage, "X");
    var now = moment();
    while (nextTrip.isBefore(now)) {
      nextTrip.add(trainFrequency, "minutes");
    }
    return nextTrip;
  }

  // Returns a number representing minutes to next arrival
  function minutesAway(initialVoyage, trainFrequency) {
    var nextTrip = nextArrival(initialVoyage, trainFrequency);   
    return nextTrip.diff(moment(), 'minutes');
  }

});