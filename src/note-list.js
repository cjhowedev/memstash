import React from "react";

const NoteList = ({
  notes = [],
  isLoadingNotes = false,
  loadingErrors = null,
  isPrivate = false,
  onDelete = () => {},
  isDeleting = false,
  onShare = () => {},
  isSharing = false
}) => (
  <>
    {isLoadingNotes && (
      <div className="level">
        <div className="level-item has-text-centered is-size-2">
          <div className="loader" />
        </div>
      </div>
    )}
    {!isLoadingNotes && loadingErrors != null && (
      <div className="notification is-danger">
        <ul>
          {loadingErrors.map((message, i) => (
            <li key={i}>{message}</li>
          ))}
        </ul>
      </div>
    )}
    {notes.length < 1 && <div class="subtitle">No notes found</div>}
    {notes.map(({ id, text, isPublic }) => (
      <div key={id} className="columns is-vcentered is-marginless note">
        <p className="column is-paddingless">{text}</p>
        {isPrivate && (
          <div className="column is-narrow is-paddingless">
            <div className="field has-addons">
              <p className="control">
                <button
                  className={
                    "button is-small is-danger" +
                    (isDeleting ? " is-loading" : "")
                  }
                  onClick={() => !isDeleting && onDelete(id)}
                >
                  <span className="icon is-small">
                    <i className="fas fa-trash" />
                  </span>
                  <span>Delete</span>
                </button>
              </p>
              <p className="control">
                <button
                  className={
                    "button is-small " +
                    (isPublic ? "is-dark" : "is-light") +
                    (isSharing ? " is-loading" : "")
                  }
                  onClick={() => !isSharing && onShare(id)}
                >
                  <span className="icon is-small">
                    <i className="fas fa-share" />
                  </span>
                  <span>Share</span>
                </button>
              </p>
            </div>
          </div>
        )}
      </div>
    ))}
  </>
);

export default NoteList;
