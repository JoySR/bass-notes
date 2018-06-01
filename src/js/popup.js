import React from 'react';
import ReactDOM from 'react-dom';

class Notes extends React.Component {
  state = {
    allNotes: [],
  }

  componentDidMount() {
    this.getAllLists();
    this.trackNotesChange();

    window.addEventListener('click', function(e) {
      if(e.target.href) {
        chrome.tabs.create({
          active: localStorage.getItem('activeTab') === '1',
          url: e.target.href
        })
      }
    })
  }

  getAllLists = () => {
    chrome.storage.local.get('notes', (result) => {
      this.setState({
        allNotes: result.notes || [],
      });
    });
  }

  trackNotesChange = () => {
    chrome.storage.onChanged.addListener(() => {
      this.getAllLists()
    });
  }

  removeNote = (id) => {
    const allNotes = this.state.allNotes
    const newAllNotes = allNotes.filter(note => {
      return note.created !== id;
    })
    chrome.storage.local.set({notes: newAllNotes}, function(){
      // TODO
    });
  }

  renderRemoveText = () => {
    return chrome.i18n.getMessage('remove_note');
  }

  renderNotes = () => {
    const {allNotes} = this.state;
    return (
      <ul className="bass-notes-list">
        {allNotes.map(note => {
          return (
            <li key={note.created}>
              <div className="note-title">
                <a href={note.url}>
                  {note.title}
                </a>
                <button onClick={() => this.removeNote(note.created)}>
                  {this.renderRemoveText()}
                </button>
              </div>
              <p>{note.text}</p>
            </li>
          )
        })}
      </ul>
    )
  }

  renderReadMe = () => {
    return (
      <div className="bass-notes-readme">
        <h3>{chrome.i18n.getMessage('instruction_title')}</h3>
        <p>{chrome.i18n.getMessage('instruction_select_text')}</p>
        <ul>
          <li>- {chrome.i18n.getMessage('instruction_add_with_context_menu')}</li>
          <li>- {chrome.i18n.getMessage('instruction_add_with_shortcuts')}</li>
        </ul>
        <p>{chrome.i18n.getMessage('instruction_saved_and_review')}</p>
        <p><strong>P.S.</strong>: {chrome.i18n.getMessage('instruction_show_popup_shortcuts')}</p>
      </div>
    )
  }

  render() {
    const {allNotes} = this.state;

    return (
      <div className="bass-notes">
        {allNotes.length ? this.renderNotes() : this.renderReadMe()}
      </div>
    );
  }
}

ReactDOM.render(<Notes/>, document.getElementById('app'));
