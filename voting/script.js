

var config = {
    apiKey: "AIzaSyC4B3UpwTcv33YV8_mnUk7O90cQwhZd_CE",
    authDomain: "visartssubmissions-67e5b.firebaseapp.com",
    databaseURL: "https://visartssubmissions-67e5b.firebaseio.com",
    projectId: "visartssubmissions-67e5b",
    storageBucket: "visartssubmissions-67e5b.appspot.com",
    messagingSenderId: "959959918208"
};

var db = firebase.initializeApp(config).database();
var dbRef = db.ref();

var childData = []
var childDataCount = 0;
var iter = -1;

Vue.use(VueFire);

// Required once to load the data from the database into childData array
dbRef.once("value")
        .then(function(snapshot) {
            snapshot.forEach(function(childSnapshot) {
                childData[childDataCount++] = childSnapshot.val();
            });
        }); 
var app = new Vue({
    el: "#input",
    data: function(){
        return {
            firstName: "",
            lastName: '',  //TODO: NEED TO ENSURE THERE ARE NO SPACES
            dukeEmail: '',
            yearAtDuke: '',
            title: '',
            medium: '',
            yearCreated: '',
            dimensions: '',
            description: '',
            photo: '',
            hardcopy: '',
            newImageTitle: '',
            url: '',
        };
    },
    firebase: {
        artInfo: dbRef,
    },
    methods: {
        initializeSlides(){
              document.getElementById('startButton').style.display = 'none';
              document.getElementById('slideshow').style.display = 'block';
              iter = 0;
              this.firstName = childData[0].firstName;
              this.lastName = childData[0].lastName;
              this.title = childData[0].title;
              this.url = childData[0].url;
              this.description = childData[0].description;
              this.medium = childData[0].medium;
              this.dimensions = childData[0].dimensions;
        },
        nextSlide(n){
              iter = iter + n;
              if(iter < 0){
                iter = childData.length - 1;
              }
              if(iter >= childData.length){
                iter = 0;
              }
              this.firstName = childData[iter].firstName;
              this.lastName = childData[iter].lastName;
              this.title = childData[iter].title;
              this.url = childData[iter].url;
              this.description = childData[iter].description;
              this.medium = childData[iter].medium;
              this.dimensions = childData[iter].dimensions;
              
        },
    }
})
app.$mount('#input')