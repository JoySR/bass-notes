import keyboardJS from 'keyboardjs';

export default class ContentScripts {
  init = () => {
    this.listenKeyDown();
  }

  getSelectedText = () => {
    if (window.getSelection) {
      return window.getSelection().toString();
    } else if (document.getSelection) {
      return document.getSelection();
    }
  }

  generateNote = () => {
    const title = document.title;
    const text = this.getSelectedText();
    const url = window.location.href;
    const created = new Date().getTime();
    const data = {
      text,
      title,
      url,
      created
    };
    return {
      data: data
    }
  }

  sendNote = (note) => {
    chrome.runtime.sendMessage(note, (response) => {
      // TODO: deal with response
    });
  }

  listenKeyDown = () => {
    keyboardJS.bind('alt + shift + n', () => {
      const text = this.getSelectedText();
      if (!text) return;
      const note = this.generateNote();
      this.sendNote(note);
    });
  }
}

const contentScripts = new ContentScripts();
contentScripts.init();
