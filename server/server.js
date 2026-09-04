const express = require('express');
const cors = require('cors');
const crypto = require('crypto');

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());

// Normalize incoming URL for Vercel rewrites (supports /notes, /notes/:id, and /api/notes)
app.use((req, res, next) => {
  const matchedPath = req.headers['x-matched-path'];
  if (matchedPath && matchedPath.startsWith('/notes')) {
    req.url = matchedPath;
  }
  next();
});

// In-memory data store for notes
// Each note format: { id: string, title: string, content: string, createdAt: string }
let notes = [];

// Health Check / Root Endpoint
app.get(['/', '/api'], (req, res) => {
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

// Handlers
const getNotes = (req, res) => {
  const sortedNotes = [...notes].sort(
    (a, b) => new Date(b.createdAt) - new Date(a.createdAt)
  );
  res.status(200).json(sortedNotes);
};

const createNote = (req, res) => {
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
};

const deleteNote = (req, res) => {
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
};

// GET /notes (and /api/notes) - Retrieve all notes (sorted newest first)
app.get(['/notes', '/api/notes'], getNotes);

// POST /notes (and /api/notes) - Create a note
app.post(['/notes', '/api/notes'], createNote);

// DELETE /notes/:id (and /api/notes/:id) - Delete a note by id
app.delete(['/notes/:id', '/api/notes/:id'], deleteNote);

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
