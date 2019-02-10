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
            score:0,
            netID: 'placeholder'
          };
        },
        firebase: {
          artInfo: dbRef,
        },
        methods: {
            updateScore(keyVal, score){
                //console.log(keyVal);
                dbRef.child(keyVal).child("voteTotal").transaction(function (count) {
                    count = count + parseInt(score);
                    return count;
                });  
                dbRef.child(keyVal).child("numVotes").transaction(function (count) {
                    count = count + 1
                    return count;
                });
                this.calculateAvg(keyVal);
            },
            calculateAvg(keyVal){
                var dbLoc = db.ref(keyVal);
                var numVotes = 0;
                var voteTotal = 0;

                dbLoc.on('value', function(snapshot) {
                    numVotes = parseFloat(snapshot.val().numVotes);
                    voteTotal = parseFloat(snapshot.val().voteTotal);
                });

                if (numVotes != 0 && voteTotal != 0){
                    voteAvg = (voteTotal / numVotes).toFixed(2);
                    dbLoc.update({
                        voteAvg : voteAvg
                    });
                }
            },
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
                this.netID = childData[0].netID;
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
            this.netID = childData[iter].netID;
          },
          vote(score, netID){
            dbRef.once("value")
            .then(function(snapshot) { snapshot.forEach(function(childSnapshot) {
              if (childSnapshot.val().netID === netID){
                app.updateScore(childSnapshot.key, score);
              }
            });
          });
            app.nextSlide(1);
          },
          downloadCSV(){
              keys = Object.keys(childData[0]);

              let csvContent = "data:text/csv;charset=utf-8,";
              csvContent += 'First Name,Last Name,Title,Photo URL,Description,Medium,Dimensions,NetID\r\n'
              childData.forEach(function(el){
                // ctr = 0;
                // keys.forEach(function(key){
                //   if(ctr > 0) csvContent += ",";
                //   console.log(el[key]);
                //   csvContent += "\"" + el[key].replace(/"/g, '\\"') + "\"";
                //   ctr++;
                // })
                // csvContent += "\r\n";
                rowArray = [el.firstName, el.lastName, el.title, el.url, "\"" + el.description.replace(/"/g, '\\"') + "\"", el.medium, el.dimensions, el.netID];
                let row = rowArray.join(",");
                csvContent += row + '\r\n';
              }); 
              var encodedUri = encodeURI(csvContent);
              var link = document.createElement("a");
              link.setAttribute("href", encodedUri);
              link.setAttribute("download", "VisArts_data.csv");
              document.body.appendChild(link); // Required for FF

              link.click(); // This will download the data file named "my_data.csv".
        }
    }
})
app.$mount('#input')