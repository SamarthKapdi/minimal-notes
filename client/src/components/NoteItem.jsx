import React from 'react';

function NoteItem({ note, onDelete, isDeleting }) {
  const formatDate = (isoString) => {
    try {
      const date = new Date(isoString);
      return new Intl.DateTimeFormat('en-US', {
        dateStyle: 'medium',
        timeStyle: 'short',
      }).format(date);
    } catch {
      return 'Just now';
    }
  };

  return (
    <article className="note-card">
      <div className="note-card-header">
        <h3 className="note-title">{note.title}</h3>
        <button
          type="button"
          onClick={() => onDelete(note.id)}
          disabled={isDeleting}
          className="delete-button"
          title="Delete note"
          aria-label={`Delete note titled ${note.title}`}
        >
          {isDeleting ? (
            <span className="spinner-small" aria-hidden="true" />
          ) : (
            <svg
              className="delete-icon"
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <polyline points="3 6 5 6 21 6" />
              <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" />
              <line x1="10" y1="11" x2="10" y2="17" />
              <line x1="14" y1="11" x2="14" y2="17" />
            </svg>
          )}
          <span className="button-text">{isDeleting ? 'Deleting...' : 'Delete'}</span>
        </button>
      </div>

      {note.content && <p className="note-content">{note.content}</p>}

      <footer className="note-card-footer">
        <time dateTime={note.createdAt} className="note-date">
          {formatDate(note.createdAt)}
        </time>
      </footer>
    </article>
  );
}

export default NoteItem;
