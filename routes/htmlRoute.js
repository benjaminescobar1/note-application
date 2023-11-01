// Import modules
const express = require("express");
const router = express.Router();
const path = require("path");

// GET Route for homepage
router.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "../public/index.html"));
});

// GET Route for notes page
router.get("/notes", (req, res) => {
  res.sendFile(path.join(__dirname, "../public/notes.html"));
});

// Export the router
module.exports = router;