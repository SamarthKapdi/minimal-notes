import React from 'react';
import NoteItem from './NoteItem';

function NoteList({ notes, onDelete, isLoading, deletingId }) {
  if (isLoading) {
    return (
      <section className="notes-container" aria-busy="true" aria-live="polite">
        <div className="section-header">
          <h2 className="section-title">All Notes</h2>
        </div>
        <div className="loading-state">
          <div className="spinner-large" />
          <p className="loading-text">Loading your notes...</p>
        </div>
      </section>
    );
  }

  if (notes.length === 0) {
    return (
      <section className="notes-container">
        <div className="section-header">
          <h2 className="section-title">All Notes</h2>
          <span className="count-badge">0 notes</span>
        </div>
        <div className="empty-state">
          <div className="empty-icon-wrapper">
            <svg
              className="empty-icon"
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
              <polyline points="14 2 14 8 20 8" />
              <line x1="16" y1="13" x2="8" y2="13" />
              <line x1="16" y1="17" x2="8" y2="17" />
              <polyline points="10 9 9 9 8 9" />
            </svg>
          </div>
          <h3 className="empty-title">No notes yet</h3>
          <p className="empty-subtitle">
            Create your first note using the form to get started.
          </p>
        </div>
      </section>
    );
  }

  return (
    <section className="notes-container">
      <div className="section-header">
        <h2 className="section-title">All Notes</h2>
        <span className="count-badge">
          {notes.length} {notes.length === 1 ? 'note' : 'notes'}
        </span>
      </div>

      <div className="notes-grid">
        {notes.map((note) => (
          <NoteItem
            key={note.id}
            note={note}
            onDelete={onDelete}
            isDeleting={deletingId === note.id}
          />
        ))}
      </div>
    </section>
  );
}

export default NoteList;
