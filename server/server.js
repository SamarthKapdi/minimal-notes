const express = require('express');
const cors = require('cors');
const crypto = require('crypto');

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());

// In-memory data store for notes
// Each note format: { id: string, title: string, content: string, createdAt: string }
let notes = [];

// Health Check / Root Endpoint
app.get('/', (req, res) => {
  res.json({
    status: 'online',
    message: 'Notes API is running',
    endpoints: {
      'GET /notes': 'List all notes',
      'POST /notes': 'Create a note (requires title, optional content)',
      'DELETE /notes/:id': 'Delete a note by ID',
    },
  });
});

// GET /notes - Retrieve all notes (sorted newest first)
app.get('/notes', (req, res) => {
  // Return notes sorted newest first
  const sortedNotes = [...notes].sort(
    (a, b) => new Date(b.createdAt) - new Date(a.createdAt)
  );
  res.status(200).json(sortedNotes);
});

// POST /notes - Create a note
app.post('/notes', (req, res) => {
  const { title, content } = req.body;

  // Basic validation: title is required and cannot be empty/whitespace only
  if (!title || typeof title !== 'string' || !title.trim()) {
    return res.status(400).json({
      error: 'Title is required and cannot be empty.',
    });
  }

  const newNote = {
    id: crypto.randomUUID(),
    title: title.trim(),
    content: content ? content.trim() : '',
    createdAt: new Date().toISOString(),
  };

  notes.unshift(newNote);

  res.status(201).json(newNote);
});

// DELETE /notes/:id - Delete a note by id
app.delete('/notes/:id', (req, res) => {
  const { id } = req.params;

  const noteIndex = notes.findIndex((note) => note.id === id);

  if (noteIndex === -1) {
    return res.status(404).json({
      error: 'Note not found.',
    });
  }

  const [deletedNote] = notes.splice(noteIndex, 1);

  res.status(200).json({
    message: 'Note deleted successfully.',
    deletedNote,
  });
});

// 404 Handler for undefined routes
app.use((req, res) => {
  res.status(404).json({ error: 'Endpoint not found.' });
});

// Global Error Handler
app.use((err, req, res, next) => {
  console.error('Unhandled server error:', err);
  res.status(500).json({ error: 'Internal server error.' });
});

// Start Server only if executed directly
if (require.main === module) {
  app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
  });
}

module.exports = app;
