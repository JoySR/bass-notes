export default class Background {
  constructor() {
    this.allNotes = [];
  }

  init = () => {
    this.getAllLists();
    this.listenNotes();

    chrome.runtime.onInstalled.addListener(this.createContextMenus);
    chrome.contextMenus.onClicked.addListener(this.onContextMenusClickHandler);
    chrome.storage.onChanged.addListener((changes, areaName) => {
      this.getAllLists()
    });

  }

  getAllLists = () => {
    chrome.storage.local.get('notes', (result) => {
      const notes = this.allNotes
      this.allNotes = result.notes || notes;
      this.showBadge()
    });
  }

  listenNotes = () => {
    chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
      this.saveToLists(message.data);
      // TODO
    });
  }

  saveToLists = (data) => {
    this.allNotes.push(data)
    chrome.storage.local.set({notes: this.allNotes}, () => {
      // TODO
    });
  }

  createContextMenus = () => {
    chrome.contextMenus.create({
      type: 'normal',
      title: chrome.i18n.getMessage("add_to_note"),
      id: 'bass-notes-context-menu',
      contexts: ['selection']
    });
  }

  onContextMenusClickHandler = (info, tab) => {
    if (info.menuItemId === 'bass-notes-context-menu') {
      this.addToNote(info, tab);
    }
  }

  addToNote = (selection, tab) => {
    const title = tab.title;
    const text = selection.selectionText;
    const url = selection.pageUrl;
    const created = new Date().getTime();
    const data = {
      text,
      title,
      url,
      created
    };
    this.saveToLists(data);
  }

  showBadge = () => {
    if (localStorage.getItem('showBadge') === "1") {
      const length = this.allNotes.length;
      const text = length > 999 ? "999+" : length.toString()
      chrome.browserAction.setBadgeText({text: text});
    } else {
      chrome.browserAction.setBadgeText({text: ""});
    }
  }
}

const background = new Background();
background.init();
