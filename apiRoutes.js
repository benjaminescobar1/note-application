const express = require('express');
const router = express.Router();
const fs = require('fs');
const path = require('path');
const { v4: uuid4 } = require('uuid');

const dbFilePath = path.join(__dirname, 'db', 'db.json');

const getNotes = () => {
  return new Promise((resolve, reject) => {
    fs.readFile(dbFilePath, 'utf8', (err, data) => {
      if (err) { 
        reject(err);
      }
      else {
        const info = JSON.parse(data) || []
        resolve(info);
      }
    });
  })
};

const saveNotes = (notes) => {
  return new Promise((resolve, reject) => {
    fs.writeFile(dbFilePath, JSON.stringify(notes), 'utf8', (err) => {
      if (err) reject(err);
      else resolve();
    })
})};

router.get('/notes', (req, res) => {
  getNotes().then((notes) => {
    res.json(notes)  
  }) 
    .catch((err) => res.status(500).json(err));

});

router.post('/notes', (req, res) => {
  let newNote = req.body;
  newNote.id = uuid4();
  getNotes().then((notes) => {
    notes.push(newNote);
    saveNotes(notes).then(() => res.json(newNote));
  }) .catch((err) => res.status(500).json(err));
  });


router.delete('/notes/:id', (req, res) => {
  const idToDelete = req.params.id;
  getNotes().then((notes) => {
    const filteredNotes = notes.filter((note) => note.id !== idToDelete);
    saveNotes(filteredNotes).then(() => res.json({ message: 'Note deleted successfully' }));
  }) .catch((err) => res.status(500).json(err))
  });

// Export the router
module.exports = router;