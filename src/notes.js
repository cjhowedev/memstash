import React, { Component } from "react";
import { deleteNote, getNotes, postNote, shareNote } from "./api";
import { AuthContext } from "./auth";
import NoteList from "./note-list";

export default class Notes extends Component {
  state = {
    notes: [],
    isLoadingNotes: true,
    loadingErrors: null,
    note: "",
    isSubmittingNote: false,
    submissionErrors: null,
    isDeletingNote: false,
    deletingErrors: null,
    isSharingNote: false,
    sharingErrors: null
  };

  static contextType = AuthContext;

  async submitNote() {
    if (this.state.isSubmittingNote) {
      return;
    }

    const text = this.state.note.trim();
    if (text === "") {
      return;
    }

    this.setState({
      isSubmittingNote: true,
      note: ""
    });

    try {
      const note = await postNote(text);

      this.setState(({ notes }) => ({
        isSubmittingNote: false,
        submissionErrors: null,
        notes: [note, ...notes]
      }));
    } catch (err) {
      this.setState({
        isSubmittingNote: false,
        submissionErrors: err.messages != null ? err.messages : [err.toString()]
      });
    }
  }

  async loadNotes() {
    try {
      this.setState({ isLoadingNotes: true });
      const notes = await getNotes();
      this.setState({
        isLoadingNotes: false,
        loadingErrors: null,
        notes
      });
    } catch (err) {
      if (err.response && err.response.status === 404) {
        this.setState({
          isLoadingNotes: false,
          loadingErrors: null,
          notes: []
        });
      } else {
        this.setState({
          isLoadingNotes: false,
          loadingErrors: err.messages != null ? err.messages : [err.toString()]
        });
      }
    }
  }

  async deleteNote(id) {
    try {
      this.setState({ isDeletingNote: true });
      await deleteNote(id);
      this.setState({ isDeletingNote: false });
      await this.loadNotes();
    } catch (err) {
      this.setState({
        isDeletingNote: false,
        deletingErrors: err.messages != null ? err.messages : [err.toString()]
      });
    }
  }

  async shareNote(id) {
    try {
      this.setState({ isSharingNote: true });
      await shareNote(id);
      this.setState({ isSharingNote: false });
      await this.loadNotes();
    } catch (err) {
      this.setState({
        isSharingNote: false,
        sharingErrors: err.messages != null ? err.messages : [err.toString()]
      });
    }
  }

  hasError() {
    return (
      (!this.state.isSharingNote && this.state.sharingErrors != null) ||
      (!this.state.isDeletingNote && this.state.deletingErrors != null) ||
      (!this.state.isSubmittingNote && this.state.submissionErrors != null)
    );
  }

  getErrors() {
    return [
      ...(this.state.sharingErrors != null ? this.state.sharingErrors : []),
      ...(this.state.deletingErrors != null ? this.state.deletingErrors : []),
      ...(this.state.submissionErrors != null
        ? this.state.submissionErrors
        : [])
    ];
  }

  componentDidMount() {
    this.loadNotes();
  }

  render() {
    const loadingNoteClass = this.state.isSubmittingNote ? " is-loading" : "";
    return (
      <>
        <h1 className="title">Your Notes</h1>
        <div className="mb-3">
          <div className="field has-addons">
            <p className="control is-expanded">
              <input
                className="input is-large"
                type="text"
                placeholder="Enter a note..."
                onChange={e => this.setState({ note: e.target.value })}
                value={this.state.note}
                onKeyDown={e => {
                  if (e.keyCode === 13) {
                    this.submitNote();
                  }
                }}
              />
            </p>
            <p className="control">
              <button
                className={"button is-large is-primary" + loadingNoteClass}
                onClick={() => this.submitNote()}
              >
                Post
              </button>
            </p>
          </div>
        </div>
        {this.hasError() && (
          <div className="notification is-danger">
            <ul>
              {this.getErrors().map((message, i) => (
                <li key={i}>{message}</li>
              ))}
            </ul>
          </div>
        )}
        <NoteList
          notes={this.state.notes}
          isLoadingNotes={this.state.isLoadingNotes}
          loadingErrors={this.state.loadingErrors}
          isPrivate
          onDelete={id => this.deleteNote(id)}
          isDeleting={this.state.isDeletingNote}
          onShare={id => this.shareNote(id)}
          isSharing={this.state.isSharingNote}
        />
      </>
    );
  }
}
