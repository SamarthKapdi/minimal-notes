import React, { useState } from 'react';

function NoteForm({ onSubmit, isSubmitting }) {
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [validationError, setValidationError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();

    const trimmedTitle = title.trim();
    if (!trimmedTitle) {
      setValidationError('Title is required');
      return;
    }

    setValidationError('');

    const success = await onSubmit({
      title: trimmedTitle,
      content: content.trim(),
    });

    if (success) {
      setTitle('');
      setContent('');
    }
  };

  const handleTitleChange = (e) => {
    setTitle(e.target.value);
    if (validationError && e.target.value.trim()) {
      setValidationError('');
    }
  };

  return (
    <section className="form-container">
      <h2 className="section-title">Create a Note</h2>
      <form onSubmit={handleSubmit} className="note-form" noValidate>
        <div className="form-group">
          <label htmlFor="note-title" className="form-label">
            Title <span className="required-marker">*</span>
          </label>
          <input
            id="note-title"
            type="text"
            className={`form-input ${validationError ? 'input-error' : ''}`}
            placeholder="e.g., Team Standup Notes"
            value={title}
            onChange={handleTitleChange}
            disabled={isSubmitting}
            maxLength={120}
          />
          {validationError && (
            <p className="validation-error" role="alert">
              {validationError}
            </p>
          )}
        </div>

        <div className="form-group">
          <label htmlFor="note-content" className="form-label">
            Content <span className="optional-label">(optional)</span>
          </label>
          <textarea
            id="note-content"
            className="form-textarea"
            placeholder="Write down your thoughts, tasks, or meeting notes..."
            rows={4}
            value={content}
            onChange={(e) => setContent(e.target.value)}
            disabled={isSubmitting}
          />
        </div>

        <div className="form-actions">
          <button
            type="submit"
            className="submit-button"
            disabled={isSubmitting}
          >
            {isSubmitting ? (
              <>
                <span className="spinner-small" aria-hidden="true" />
                <span>Creating Note...</span>
              </>
            ) : (
              <>
                <svg
                  className="button-icon"
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <line x1="12" y1="5" x2="12" y2="19" />
                  <line x1="5" y1="12" x2="19" y2="12" />
                </svg>
                <span>Add Note</span>
              </>
            )}
          </button>
        </div>
      </form>
    </section>
  );
}

export default NoteForm;
