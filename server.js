// Dependencies
// =============================================================
const express = require("express");
const util = require('util');
const path = require("path");
const fs = require("fs");

const DB_DIR = path.resolve(__dirname, "public/db");
const dbPath = path.join(DB_DIR, "db.json");

console.log(__dirname);
//promisify the file object for Async operation
const writeFileAsync = util.promisify(fs.writeFile);


// Sets up the Express App
// =============================================================
const app = express();
const PORT = (process.env.PORT || 3000);

// Sets up the Express app to handle data parsing
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(express.static("public"));

// note test (DATA)
// =============================================================
var notes = [
  {
    id: 0,
    title: "Test Title",
    text: "Test text 0"
  },
  {
    id: 1,
    title: "Test Title 1",
    text: "Test text 1"
  },
  {
    id: 2,
    title: "Test Title 2",
    text: "Test text 2"
  },
];

// Routes
// =============================================================

// Displays notes.html file
app.get("/notes", function (req, res) {
  res.sendFile(path.join(__dirname, "public/notes.html"));
});

//Displays notes - GET `/api/notes` - Should read the `db.json` file and return all saved notes as JSON.
app.get("/api/notes", function (req, res) {
  fs.readFile(path.join(DB_DIR, "db.json"), 'utf8', (err, notes) => {

    if (err) throw err;
    const notesArray = JSON.parse(notes);

    console.log(notesArray);

    return res.json(notesArray);

  });

});

// Displays index.html file
app.get("/", function (req, res) {
  res.sendFile(path.join(__dirname, "public/index.html"));
});

// Displays index.html file
app.get("*", function (req, res) {
  res.sendFile(path.join(__dirname, "public/index.html"));
});

//Post route 
// POST `/api/notes` - Should receive a new note to save on the request body, 
// add it to the `db.json` file, and then return the new note to the client.
app.post("/api/notes", function (req, res) {

  //get new note information
  let newNote = req.body;
  console.log(`Original request body : ${newNote}`);

  //retrieve existing notes from db.json file and add req.body(new note) and save back to db.json file
  fs.readFile(path.join(DB_DIR, "db.json"), 'utf8', (err, notes) => {

    if (err) throw err;

    //console.log(`Original note string from file (parsed) : ${JSON.parse(notes)}`);

    //convert file data to an array 
    const notesArray = JSON.parse(notes);
    console.log(`Original note string saved to parsed array : ${notesArray}`);

    //add new note from req.body to array
    const countNotes = notesArray.push(newNote);

    console.log(`Updated Note Array to save to file : ${notesArray}`);
    console.log(`Total number of notes : ${countNotes}`);

    //ID renumber algorithm
    //add unique ids to the array before saving     
    notesArray.forEach((element, index) => {

      console.log(`Before element ID: ${element.id}`);
      element.id = index;
      console.log(`After element ID: ${element.id}`);

    })
    //convert array to string for saving to file
    // JSON.stringify Array object to string 
    let notesString = JSON.stringify(notesArray);
    console.log(`Stringified notes : ${notesString}`);

    //save updates back to db.json file
    fs.writeFile(path.join(DB_DIR, "db.json"), notesString, 'utf8', (err) => {
      if (err) throw err;
      console.log('The file has been saved!');
    });

    //return added note as json response
    return res.json(newNote);

  });



});

//DELETE `/api/notes/:id` - Should receive a query parameter containing the id of a note to delete. 
//This means you'll need to find a way to give each note a unique `id` when it's saved. 
//In order to delete a note, you'll need to read all notes from the `db.json` file, remove 
//the note with the given `id` property, and then rewrite the notes to the `db.json` file.

app.delete("/api/notes/:id", function (req, res) {
  //retrieve the file from storage
  fs.readFile(path.join(DB_DIR, "db.json"), 'utf8', (err, notes) => {

    if (err) throw err;

    let saveArray = [];
    let deleteArray = [];
    //convert file data to an array 
    const notesArray = JSON.parse(notes);

    //find note to delete and send it as a response  
    let deleteId = req.params.id;
    console.log(`params id = ${req.params.id}`);

    //create delete Array and save Array
    notesArray.forEach((element, index) => {
      //console.log(element);
      console.log(`element ID: ${element.id} ID: ${deleteId}`);
      if (parseInt(element.id) === parseInt(deleteId)) {
        deleteArray.push(element);
        console.log("found it");
      } else {
        saveArray.push(element);
        console.log("NOT found");
      }
    })
    console.log(`Save Array: ${JSON.stringify(saveArray)}`);

    console.log(`Delete Array: ${JSON.stringify(deleteArray)}`);

    //ID renumber algorithm
    //add unique ids to the array before saving     
    saveArray.forEach((element, index) => {

      console.log(`Before element ID: ${element.id}`);
      element.id = index;
      console.log(`After element ID: ${element.id}`);

    })

    //convert array to string for saving to file
    // JSON.stringify converts Array object to string 
    let notesString = JSON.stringify(saveArray);
    console.log(`Stringified notes : ${notesString}`);

    //save updates back to db.json file
    fs.writeFile(path.join(DB_DIR, "db.json"), notesString, 'utf8', (err) => {
      if (err) throw err;
      console.log('The file has been saved!');
    });

    //return deleted note as json response
    return res.json(deleteArray);
  });


});

// Starts the server to begin listening
// =============================================================
app.listen(PORT, function () {
  console.log("App listening on PORT " + PORT);
});
