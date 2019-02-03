var config = {
    apiKey: "AIzaSyC24_KvIe85-kV8_qhZHM9jI9HspnpUz7M",
    authDomain: "train-schedule-6994c.firebaseapp.com",
    databaseURL: "https://train-schedule-6994c.firebaseio.com",
    projectId: "train-schedule-6994c",
    storageBucket: "train-schedule-6994c.appspot.com",
    messagingSenderId: "1029032363844"
  };
firebase.initializeApp(config);

var database = firebase.database();


document.getElementById("#current-time").innerHTML = formatAMPM();

function formatAMPM() {
var d = new Date(),
    minutes = d.getMinutes().toString().length == 1 ? '0'+d.getMinutes() : d.getMinutes(),
    hours = d.getHours().toString().length == 1 ? '0'+d.getHours() : d.getHours(),
    ampm = d.getHours() >= 12 ? 'pm' : 'am',
    months = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'],
    days = ['Sun','Mon','Tue','Wed','Thu','Fri','Sat'];
return days[d.getDay()]+' '+months[d.getMonth()]+' '+d.getDate()+' '+d.getFullYear()+' '+hours+':'+minutes+ampm;
}

//Button for adding Trains
$("#submit").on("click", function() {

    // Grab user input from text input field
    var trainName = $("#train-name-input").val().trim();
    var trainDestination = $("#train-destination-input").val().trim();
    var trainTime = $("#train-time-input").val().trim();
    var trainFrequency = parseInt($("#train-frequency-input").val().trim());
    //object for holding train data
    var newTrain = {
        name: trainName,
        destination: trainDestination,
        time: trainTime,
        frequency: trainFrequency
    };
    // Uploads train data to the database
    database.ref().push(newTrain);
    // Clears all of the text-boxes
    $("#train-name-input").val("");
    $("#train-destination-input").val("");
    $("#train-time-input").val("");
    $("#train-frequency-input").val("");
});

//Creates Firebase event for adding train to the database and a row in the html when a user adds a train
database.ref().on("child_added", function(childSnapshot, prevChildKey) {

    // Store train data into  variables
    var trainName = childSnapshot.val().name;
    var trainDestination = childSnapshot.val().destination;
    var trainTime = childSnapshot.val().time;
    var trainFrequency = childSnapshot.val().frequency;

    var trainTimeConverted = moment(childSnapshot.val().time, "HH:mm");
    console.log(trainTimeConverted);

    var timeDiff = moment().diff(moment(trainTimeConverted), "minutes");
    console.log(timeDiff);

    var timeRemaining = timeDiff % childSnapshot.val().frequency;
    console.log(timeRemaining);

    var minutesAway = childSnapshot.val().frequency - timeRemaining;
    console.log(minutesAway);

    var nextTrainArrival = moment().add(minutesAway, "minutes");
    var nextArrivalConverted = moment(nextTrainArrival).format("HH:mm");
    console.log(nextArrivalConverted);

//Add train times to train schedule
var row = $('<tr>');
    $(row).append($('<td>').text(childSnapshot.val().name));
    $(row).append($('<td>').text(childSnapshot.val().destination));
    $(row).append($('<td>').text(childSnapshot.val().frequency));
    $(row).append($('<td>').text(nextArrivalConverted));
    $(row).append($('<td>').text(minutesAway));
    $('#table-body-train-schedule').append(row);
});
