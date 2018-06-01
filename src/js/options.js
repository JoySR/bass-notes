import React from 'react';
import ReactDOM from 'react-dom';

class Options extends React.Component {
  state = {
    activeTab: localStorage.getItem('activeTab') || "0",
    showBadge: localStorage.getItem('showBadge') || "0",
    message: ''
  }

  onTabOptionChange = (e) => {
    const activeTab = e.target.value;
    this.setState({
      activeTab,
    }, () => {
      localStorage.setItem('activeTab', activeTab)
      this.setState({
        message: chrome.i18n.getMessage('options_saved')
      }, () => {
        setTimeout(() => {
          this.setState({
            message: ''
          });
        }, 600)
      });
    });
  }

  onBadgeOptionChange = (e) => {
    const showBadge = e.target.value;
    this.setState({
      showBadge: showBadge,
    }, () => {
      localStorage.setItem('showBadge', showBadge)

      chrome.storage.local.get('notes', function(result){
        const allNotes = result.notes || [];
        if (showBadge === "1") {
          chrome.browserAction.setBadgeText({text: allNotes.length.toString()});
        } else {
          chrome.browserAction.setBadgeText({text: ""});
        }
      });

      this.setState({
        message: chrome.i18n.getMessage('options_saved')
      }, () => {
        setTimeout(() => {
          this.setState({
            message: ''
          });
        }, 600)
      });
    });
  }

  render() {
    return (
      <div className="bass-notes-options">
        <div className="open-url-option">
          <h3>{chrome.i18n.getMessage('open_note_url_option_text')}</h3>
          <p>
            <input
              id="open-url-background"
              type="radio"
              name="open-url-option"
              value="0"
              checked={this.state.activeTab === '0'}
              onChange={this.onTabOptionChange}
            />
            <label htmlFor="open-url-background">{chrome.i18n.getMessage('open_note_url_in_background')}</label>
          </p>
          <p>
            <input id="open-url-active" type="radio" name="open-url-option" value="1" checked={this.state.activeTab === '1'} onChange={this.onTabOptionChange} /><label htmlFor="open-url-active">{chrome.i18n.getMessage('open_note_url_in_active_tab')}</label></p>
        </div>
        <div className="show-badge-option">
          <h3>{chrome.i18n.getMessage('show_badge_option_text')}</h3>
          <p>
            <input
              id="show-badge"
              type="radio"
              name="show-badge-option"
              value="1"
              checked={this.state.showBadge === '1'}
              onChange={this.onBadgeOptionChange}
            />
            <label htmlFor="show-badge">{chrome.i18n.getMessage('show_badge_text')}</label>
          </p>
          <p>
            <input
              id="hide-badge"
              type="radio"
              name="show-badge-option"
              value="0"
              checked={this.state.showBadge === '0'}
              onChange={this.onBadgeOptionChange}
            />
            <label htmlFor="hide-badge">{chrome.i18n.getMessage('hide_badge_text')}</label>
          </p>
        </div>
        <p className="message">{this.state.message}</p>
      </div>
    );
  }
}

ReactDOM.render(<Options/>, document.getElementById('options'));
