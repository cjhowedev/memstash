import React, { Component } from "react";
import { getPublicNotes } from "./api";
import NoteList from "./note-list";

class PublicNotes extends Component {
  state = {
    notes: [],
    isLoadingNotes: true,
    loadingErrors: null
  };

  getUsername() {
    return this.props.match.params.username;
  }

  async componentDidMount() {
    try {
      this.setState({ isLoadingNotes: true });
      const notes = await getPublicNotes(this.getUsername());
      this.setState({ isLoadingNotes: false, loadingErrors: null, notes });
    } catch (err) {
      this.setState({
        isLoadingNotes: false,
        loadingErrors: err.messages != null ? err.messages : [err.toString()]
      });
    }
  }

  render() {
    return (
      <div className="container">
        <h1 className="title">Public Notes for {this.getUsername()}</h1>
        <NoteList
          notes={this.state.notes}
          isLoadingNotes={this.state.isLoadingNotes}
          loadingErrors={this.state.loadingErrors}
        />
      </div>
    );
  }
}

export default PublicNotes;
