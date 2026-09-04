import React, { useState, useEffect, useCallback } from 'react';
import NoteForm from './components/NoteForm';
import NoteList from './components/NoteList';
import './App.css';

const API_BASE_URL = (
  import.meta.env.VITE_API_BASE_URL ??
  (import.meta.env.DEV ? 'http://localhost:5000' : '')
).replace(/\/+$/, '');

function App() {
  const [notes, setNotes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [deletingId, setDeletingId] = useState(null);

  // Fetch all notes from API
  const fetchNotes = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await fetch(`${API_BASE_URL}/notes`);
      if (!response.ok) {
        throw new Error(`Server returned ${response.status}: Failed to fetch notes`);
      }
      const data = await response.json();
      setNotes(data);
    } catch (err) {
      console.error('Error fetching notes:', err);
      setError(
        'Unable to connect to the notes service. Please verify the backend is running.'
      );
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchNotes();
  }, [fetchNotes]);

  // Handle adding a new note
  const handleAddNote = async (noteData) => {
    setIsSubmitting(true);
    setError(null);
    try {
      const response = await fetch(`${API_BASE_URL}/notes`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(noteData),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to create note');
      }

      // Add newly created note to the top of the list
      setNotes((prevNotes) => [data, ...prevNotes]);
      return true;
    } catch (err) {
      console.error('Error adding note:', err);
      setError(err.message || 'An error occurred while creating the note.');
      return false;
    } finally {
      setIsSubmitting(false);
    }
  };

  // Handle deleting a note
  const handleDeleteNote = async (id) => {
    setDeletingId(id);
    setError(null);
    try {
      const response = await fetch(`${API_BASE_URL}/notes/${id}`, {
        method: 'DELETE',
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to delete note');
      }

      // Remove note from local state
      setNotes((prevNotes) => prevNotes.filter((note) => note.id !== id));
    } catch (err) {
      console.error('Error deleting note:', err);
      setError(err.message || 'An error occurred while deleting the note.');
    } finally {
      setDeletingId(null);
    }
  };

  return (
    <div className="app-layout">
      <header className="app-header">
        <div className="header-content">
          <div className="brand">
            <svg
              className="brand-icon"
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M19 3H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2z" />
              <polyline points="9 7 9 17" />
              <polyline points="15 7 15 17" />
              <line x1="9" y1="12" x2="15" y2="12" />
            </svg>
            <h1 className="brand-title">Notes App</h1>
          </div>
        </div>
      </header>

      {/* Global Error Banner */}
      {error && (
        <div className="error-banner" role="alert">
          <div className="error-message">
            <svg
              className="error-icon"
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <circle cx="12" cy="12" r="10" />
              <line x1="12" y1="8" x2="12" y2="12" />
              <line x1="12" y1="16" x2="12.01" y2="16" />
            </svg>
            <span>{error}</span>
          </div>
          <div className="error-actions">
            <button
              type="button"
              className="error-retry-btn"
              onClick={fetchNotes}
            >
              Retry
            </button>
            <button
              type="button"
              className="error-dismiss-btn"
              onClick={() => setError(null)}
              aria-label="Dismiss alert"
            >
              &times;
            </button>
          </div>
        </div>
      )}

      <main className="app-main">
        <div className="content-grid">
          <div className="sidebar-column">
            <NoteForm onSubmit={handleAddNote} isSubmitting={isSubmitting} />
          </div>
          <div className="main-column">
            <NoteList
              notes={notes}
              onDelete={handleDeleteNote}
              isLoading={loading}
              deletingId={deletingId}
            />
          </div>
        </div>
      </main>

      <footer className="app-footer">
        <p>Built with React & Express &bull; In-Memory Architecture &bull; Clean REST API</p>
      </footer>
    </div>
  );
}

export default App;
