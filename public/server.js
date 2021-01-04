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

// Star Wars Characters (DATA)
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



// app.get("/api/notes", function(req, res) {
//   fs.readFile(path.join(DB_DIR, "db.json"), (err, notes) => {
//     if (err) throw err;
//     console.log(notes);
//     //return res.json(notes);
//   });


  //res.sendFile(path.join(DB_DIR, "db.json"));
  //return res.json(notes);
//});

// Displays a single character, or returns false
// app.get("/api/characters/:character", function(req, res) {
//   var chosen = req.params.character;

//   console.log(chosen);

//   for (var i = 0; i < characters.length; i++) {
//     if (chosen === characters[i].routeName) {
//       return res.json(characters[i]);
//     }
//   }

//   return res.json(false);
// });

// POST `/api/notes` - Should receive a new note to save on the request body, 
// add it to the `db.json` file, and then return the new note to the client.
app.post("/api/notes", function(req, res) {
  // const animals = ['pigs', 'goats', 'sheep'];
  // const count = animals.push('cows');
  // console.log(animals);

  //get new note information
  let newNote = JSON.stringify(req.body);
  
  //get existing notes from db.json file and add req.body and save updates back to db.json file
  fs.readFile(path.join(DB_DIR, "dbtest.json"),'utf8', (err, notes) => {
    
    const notesArray = notes.split(" ");
    if (err) throw err;
    console.log(`Original Note Array from file : ${notesArray}`);
    
    //add new note from req.body 
    const countNotes = notesArray.push(newNote);    
    console.log(`Updated Note Array to save to file : ${notesArray}`);
    console.log(`Total number of notes : ${countNotes}`);

    let notesString = notesArray.join("");
    console.log(`Parsed notes : ${countNotes}`);

    //save updates back to db.json file
    fs.writeFile(path.join(DB_DIR, "dbtest.json"), notesString, 'utf8', (err) => {
      if (err) throw err;
      console.log('The file has been saved!');
    });
    //send updated notes back as json response
    return res.json(notesArray);
  });
  // req.body hosts is equal to the JSON post sent from the user
  // This works because of our body parsing middleware
  
  //console.log(`New Note Info for POST: ${JSON.stringify(newNote)}`);
  //let notesArray = JSON.stringify(newNote);
  //console.log(`New Note Array for POST: ${notesArray}`);

  

  
  
  // res.json(notesArray);
  //  res.json(notesArray);

  // Using a RegEx Pattern to remove spaces from newCharacter
  // You can read more about RegEx Patterns later https://www.regexbuddy.com/regex.html
  //newCharacter.routeName = newCharacter.name.replace(/\s+/g, "").toLowerCase();
  // fs.readFile(path.join(DB_DIR, "db.json"),'utf8', (err, notes) => {

  //   if (err) throw err;
  //   let notesArray = [];

  //   notesArray = JSON.stringify(newNote);
    
  //   const count = notesArray.push(newNote);

  //   console.log(notesArray);
  //   return res.json(notesArray);
    
  // });
  

  

  //will need to write to the db also 
  //fs.writeFile(file, data[, options], callback)
  //fs.writeFile('db.json', 'message.txt', 'utf8', callback);

  // fs.writeFile(path.join(DB_DIR, "db.json"), notesArray, 'utf8', (err) => {
  //   if (err) throw err;
  //   console.log('The file has been saved!');
  // });

  // res.json(notesArray);
  
});

// Delete a note - takes in JSON input
app.delete("/api/notes", function(req, res) {
    // req.body hosts is equal to the JSON post sent from the user
  // This works because of our body parsing middleware
  var newNote = req.body;

  // Using a RegEx Pattern to remove spaces from newCharacter
  // You can read more about RegEx Patterns later https://www.regexbuddy.com/regex.html
  //newCharacter.routeName = newCharacter.name.replace(/\s+/g, "").toLowerCase();

  console.log(newNote);

  notes.push(newNote);
  
  //will need to write to the db also 
  res.json(newNote);
});

// Starts the server to begin listening
// =============================================================
app.listen(PORT, function() {
  console.log("App listening on PORT " + PORT);
});
