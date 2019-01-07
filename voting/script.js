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
var todoRef = db.ref('visartssubmissions-67e5b');

todoRef.on('child_added', function(data){
    console.log(data);
})

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
        images: imagesRef,
        
    },
    methods: {
        add: function() {
            console.log(this.rating);
        },
        remove: function(){
            console.log("Removed a vote");
        }
    }
})
app.$mount('#input')