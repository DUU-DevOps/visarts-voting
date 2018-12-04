var config = {
    apiKey: "AIzaSyC4B3UpwTcv33YV8_mnUk7O90cQwhZd_CE",
    authDomain: "visartssubmissions-67e5b.firebaseapp.com",
    databaseURL: "https://visartssubmissions-67e5b.firebaseio.com",
    projectId: "visartssubmissions-67e5b",
    storageBucket: "visartssubmissions-67e5b.appspot.com",
    messagingSenderId: "959959918208"
};

var db = firebase.initializeApp(config).database();
var storageRef = firebase.storage().ref();
var imagesRef = db.ref('images');

Vue.use(VueFire);

var app = new Vue({
    el: "#input",
    data: function(){
        return {
            firstName: null,
            lastName: null,  //TODO: NEED TO ENSURE THERE ARE NO SPACES
            dukeEmail: null,
            yearAtDuke: null,
            title: null,
            medium: null,
            yearCreated: null,
            dimensions: null,
            description: null,
            photo: null,
            hardcopy: null,
            newImageTitle: ''
        };
    },
    firebase: {
        images: imagesRef
    },
    methods: {
        addImage: function(title, url) {
            // now that image has been stored in Firebase, create a reference to it in database
            console.log("called");
            imagesRef.push({
                title: title,
                url: url
            });
            // reset input values so user knows to input new data
            this.newImageTitle = '';
        },
        storeImage: function(firstName, lastName, dukeEmail, yearAtDuke, title, medium, yearCreated, dimensions, description, hardcopy) {
            // get input element user used to select local image
            var input = document.getElementById('files');
            // have all fields in the form been completed
            var validInput = this.checkInput(firstName, lastName, dukeEmail, yearAtDuke, title, medium, yearCreated, dimensions, description, hardcopy);
            if (typeof input.files[0] === "undefined"){
                alert("Invalid Input. Please upload a file.");
                return;
            }
            if (validInput) {
                var file = input.files[0];
                // get reference to a storage location and
                var refLoc = storageRef.child('images/' + file.name);
                storageRef.child('images/' + file.name)
                          .put(file)
                          .then(snapshot => {
                               return snapshot.ref.getDownloadURL();   // Will return a promise with the download link
                           })
                           .then(downloadURL => {
                                db.ref('/').push({
                                    firstName: firstName,
                                    lastName: lastName, 
                                    dukeEmail: dukeEmail,
                                    netID: dukeEmail.split("@")[0],
                                    yearAtDuke: yearAtDuke,
                                    title: title,
                                    medium: medium,
                                    yearCreated: yearCreated,
                                    dimensions: dimensions,
                                    description: description,
                                    hardcopy: hardcopy,
                                    votes: 0,
                                    fileName: file.name,
                                    url: downloadURL
                                });
                           })
                           .catch(error => {
                              console.log(`Failed to upload file and get link - ${error}`);
                           });
                // reset input values so user knows to input new data
                input.value = '';
                document.getElementById("main").style.display = "none";
                document.getElementById("post").style.display = "inline";
            }
        },
        checkInput: function(firstName, lastName, dukeEmail, yearAtDuke, title, medium, yearCreated, dimensions, description, hardcopy){
            var inputs = [firstName, lastName, dukeEmail, yearAtDuke, title, medium, yearCreated, dimensions, description, hardcopy];
            
            for (var x=0; x < inputs.length; x++){
                if (inputs[x] === null || inputs[x].length < 1){
                    alert("Invalid input. Please check all fields and resubmit");
                    return false;
                }
            }
            return true;
        }
    }
})
app.$mount('#input')