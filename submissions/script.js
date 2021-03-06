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
            firstName: "",
            lastName: "",  //TODO: NEED TO ENSURE THERE ARE NO SPACES
            dukeEmail: "",
            yearAtDuke: "",
            title: "",
            medium: "",
            yearCreated: "",
            dimensions: "",
            description: "",
            photo: "",
            hardcopy: "",
            newImageTitle: ""
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
                var currentdate = new Date(); 
                var datetime =  (currentdate.getMonth()+1)  + "/"
                                + currentdate.getDate() + "/"
                                + currentdate.getFullYear() + " at "  
                                + currentdate.getHours() + ":"  
                                + currentdate.getMinutes();
                
                storageRef.child('images/' + file.name)
                          .put(file)
                          .then(snapshot => {
                               return snapshot.ref.getDownloadURL();   // Will return a promise with the download link
                           })
                           .then(downloadURL => {
                                db.ref('/').push({
                                    firstName: this.clean(firstName, false),
                                    lastName: this.clean(lastName, false), 
                                    dukeEmail: this.clean(dukeEmail, true),
                                    netID: this.clean(dukeEmail, true).split("@")[0],
                                    yearAtDuke: this.clean(yearAtDuke, false),
                                    title: this.clean(title, false),
                                    medium: this.clean(medium, false),
                                    yearCreated: this.clean(yearCreated, false),
                                    dimensions: this.clean(dimensions, false),
                                    description: this.clean(description, false),
                                    hardcopy: this.clean(hardcopy, false),
                                    voteTotal: 0,
                                    numVotes: 0,
                                    voteAvg: 0,
                                    fileName: file.name,
                                    url: downloadURL,
                                    timeStamp: datetime
                                }, function(error) {
                                      if (error){
                                        alert("Error: There was a problem with your submission");
                                      } 
                                      else {
                                        app.sendemail(firstName, lastName, title, dukeEmail);
                                            input.value = '';
                                            document.getElementById("main").style.display = "none";
                                            document.getElementById("post").style.display = "inline";
                                      }
                                });
                           })
                           .catch(error => {
                              alert("There was an error with your submission. Please reach out to duuvisarts@gmail.com")
                           });
                // reset input values so user knows to input new data
                
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
            if (!dukeEmail.includes("@")){
                alert("Please enter a valid email (e.g. abc123@duke.edu).");
                return false;
            }
            return true;
        },
        clean(word, isEmail){
            if (isEmail){
                word = word.replace(/[^A-Za-z0-9@., ]/g, " ") 
            }
            else{
                word = word.replace(/[^A-Za-z0-9.?!, ]/g, " ") 
            }
            return word
        },
        sendemail(firstName, lastName, title, dukeEmail){
            var template_params = {
               "to_email": dukeEmail,
               "reply_to": "duudevops@gmail.com",
               "to_name": firstName + " " + lastName,
               "title": title
            }

            var service_id = "default_service";
            var template_id = "template_38GFeTtz";
            emailjs.send(service_id, template_id, template_params);
        }
    }
})
app.$mount('#input')