// Dependencies
// =============================================================
const express = require("express");
const util = require('util');
const path = require("path");
const fs = require("fs");

const DB_DIR = path.resolve(__dirname, "db");
const dbPath = path.join(DB_DIR, "db.json");

//promisify the file object for Async operation
const writeFileAsync = util.promisify(fs.writeFile);


// Sets up the Express App
// =============================================================
const app = express();
const PORT = (process.env.PORT || 3000);

// Sets up the Express app to handle data parsing
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

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
app.get("/notes", function(req, res) {
  res.sendFile(path.join(__dirname, "notes.html"));
});

// Displays index.html file
app.get("/", function(req, res) {
  res.sendFile(path.join(__dirname, "index.html"));
});

//Displays test info
app.get("/api", function(req, res) {
  res.json(notes);
});

//Displays notes - GET `/api/notes` - Should read the `db.json` file and return all saved notes as JSON.
app.get("/api/notes", function(req, res) {
  fs.readFile(path.join(DB_DIR, "dbtest.json"),'utf8', (err, notes) => {

    if (err) throw err;

    console.log(notes);
    return res.json(notes);

  });
});

//post route 
// POST `/api/notes` - Should receive a new note to save on the request body, 
// add it to the `db.json` file, and then return the new note to the client.
app.post("/api/notes", function(req, res) {
  
  //get new note information
  let newNote = req.body;
  console.log(`Original request body : ${newNote}`);
    
  //retrieve existing notes from db.json file and add req.body(new note) and save back to db.json file
  fs.readFile(path.join(DB_DIR, "dbtest.json"),'utf8', (err, notes) => {

    console.log(`Original note string from file (parsed) : ${JSON.parse(notes)}`);
    
    //convert file data to an array 
    const notesArray = JSON.parse(notes);
    console.log(`Original note string saved to parsed array : ${notesArray}`);
    
    if (err) throw err;   
    
    //add new note from req.body to array
    const countNotes = notesArray.push(newNote);   
     
    console.log(`Updated Note Array to save to file : ${notesArray}`);
    
    console.log(`Total number of notes : ${countNotes}`);
    

    //convert array to string for saving to file
    // JSON.stringify Array object to string 
    let notesString = JSON.stringify(notesArray);    
     console.log(`Stringified notes : ${notesString}`);

    //save updates back to db.json file
    fs.writeFile(path.join(DB_DIR, "dbtest.json"), notesString , 'utf8', (err) => {
      if (err) throw err;
      console.log('The file has been saved!');
    });
    //send updated notes back as json response
    return res.json(notesArray);
  });
    
  
  
});

//DELETE `/api/notes/:id` - Should receive a query parameter containing the id of a note to delete. 
//This means you'll need to find a way to give each note a unique `id` when it's saved. 
//In order to delete a note, you'll need to read all notes from the `db.json` file, remove 
//the note with the given `id` property, and then rewrite the notes to the `db.json` file.

app.delete("/api/notes:id", function(req, res) {
  //retrieve the file from storage
  fs.readFile(path.join(DB_DIR, "dbtest.json"),'utf8', (err, notes) => {
    
    //convert file data to an array 
    const notesArray = notes.split(" ");
    if (err) throw err;
    console.log(`Original note string from file converted to Array : ${notesArray}`);
    
    //find note to delete and send it as a response  
    var id = req.params.id;
    
    for (var i = 0; i < notesArray.length; i++) {
        if (id === notesArray[i].id) {
          return res.json(notesArray[i]);
        }
    }


  });
  
  
});

// Starts the server to begin listening
// =============================================================
app.listen(PORT, function() {
  console.log("App listening on PORT " + PORT);
});
