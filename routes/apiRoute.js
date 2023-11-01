// Import modules
const express = require("express");
const router = express.Router();
const fs = require("fs");
const { v4: uuidv4 } = require("uuid");

// GET Route for getting notes
router.get("/notes", async (req, res) => {
  try {
    // Reads the data from the file system and parse JSON asynchronously
    const data = await fs.promises.readFile("./db/db.json", "utf8");
    const notes = JSON.parse(data);

    res.json(notes);
  } catch (error) {
    // Handle error while reading file
    console.error("Error reading notes from db:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

// POST Route for creating a new note
router.post("/notes", async (req, res) => {
  // Log the incoming request body for debugging purposes
  console.log(req.body);

  // Destructure properties from the request body
  const { title, text } = req.body;

  // Check if both title and text properties exist in the request body
  if (title && text) {
    try {
      // Read existing data from the db.json file
      const data = fs.readFileSync("./db/db.json", "utf8");
      const notes = JSON.parse(data);

      // Create a new note object with the provided title and text
      const newNote = {
        title,
        text,
        id: uuidv4(), // Create unique IDs for each note
      };

      // Add the new note to the array of existing notes
      notes.push(newNote);

      // Write the updated notes back to the db.json file asynchronously
      fs.writeFileSync("./db/db.json", JSON.stringify(notes), "utf8");

      // Respond with the newly created note
      res.json(newNote);
    } catch (error) {
      // Handle errors during the note creation process
      console.error("Error creating a new note:", error);
      res.status(500).json({ error: "Internal Server Error" });
    }
  } else {
    // Respond with an error if title or text is missing from the request body
    res
      .status(400)
      .json({ error: "Invalid data provided for creating a note" });
  }
});

// PUT Route for updating a note by ID
router.put("/notes/:id", async (req, res) => {
  const noteId = req.params.id; // Extract note ID from the request parameters

  // Log the incoming request body for debugging purposes
  console.log(req.body);

  // Destructure properties from the request body
  const { title, text } = req.body;

  // Check if both title and text properties exist in the request body
  if (title && text) {
    try {
      // Read existing data from the db.json file
      const data = await fs.promises.readFile("./db/db.json", "utf8");
      let notes = JSON.parse(data);

      // Find the index of the note to be updated based on its ID
      const noteIndex = notes.findIndex((note) => note.id === noteId);

      if (noteIndex !== -1) {
        // Update the note with the new title and text
        notes[noteIndex].title = title;
        notes[noteIndex].text = text;

        // Write the updated notes back to the db.json file asynchronously
        await fs.promises.writeFile(
          "./db/db.json",
          JSON.stringify(notes),
          "utf8"
        );

        // Respond with the updated note
        res.json(notes[noteIndex]);
      } else {
        // Respond with an error if given id is not found
        res.status(404).json({ error: "Note not found" });
      }
    } catch (error) {
      // Handle errors during the note update process
      console.error("Error updating a note:", error);

      // If the error is due to file not found, provide a more helpful error message
      if (error.code === "ENOENT") {
        res.status(404).json({ error: "Database file not found" });
      } else {
        res.status(500).json({ error: "Internal Server Error" });
      }
    }
  } else {
    // Respond with an error if title or text is missing from the request body
    res
      .status(400)
      .json({ error: "Invalid data provided for updating a note" });
  }
});

// DELETE Route for deleting a note by ID
// :id -> in insomnia, the preview shows id. In the url, replace :id with the id of note to delete
router.delete("/notes/:id", async (req, res) => {
  const noteId = req.params.id; // Extract note ID from the request parameters

  try {
    // Read existing data from db.json file
    const data = await fs.promises.readFile("./db/db.json", "utf8");

    let notes = JSON.parse(data);

    // Find the index of the note to be deleted based on its ID
    const noteIndex = notes.findIndex((note) => note.id === noteId);

    if (noteIndex !== -1) {
      // Remove the note from the array
      notes.splice(noteIndex, 1);

      // Write the updated notes back to the db.json file asynchronously
      await fs.promises.writeFile(
        "./db/db.json",
        JSON.stringify(notes),
        "utf8"
      );

      // Respond with success message
      res.json({ message: "Note deleted successfully" });
    } else {
      // Respond with an error if given id is not found
      res.status(404).json({ error: "Note not found" });
    }
  } catch (error) {
    // Handle errors during the note deletion process
    console.error("Error deleting a note:", error);

    // If the error is due to file not found, provide a more helpful error message
    if (error.code === "ENOENT") {
      res.status(404).json({ error: "Database file not found" });
    } else {
      res.status(500).json({ error: "Internal Server Error" });
    }
  }
});

// Export the router
module.exports = router;