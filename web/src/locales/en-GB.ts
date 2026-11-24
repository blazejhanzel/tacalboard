export default {
  app: {
    backupAndRestore: 'Backup and Restore',
    settings: 'Settings',
    theme: 'Theme',
    themes: {
      system: 'System',
      light: 'Light',
      dark: 'Dark',
    },
  },
  backupAndRestore: {
    backupButton: 'Download backup file',
    backupHeader: 'Backup to file',
    backupHint: `Gives ability to download currently used database to the file, so it can be restored if necessery. In case of using app in serveless mode, it's recommended to create backup every time after creating or editing big amount of data.`,
    restoreHeader: 'Restore from file',
    restoreHint: 'Provides ability to import database from the .json file to the application.',
    importHint:
      'Select file to the import and click the button to import database to the application.',
    importAlerts: {
      success: 'Imported succesfully',
      error: 'Import error occured',
    },
    importTypes: {
      replace: 'Replace existing database',
      append: 'Append to existing database',
    },
  },
  common: {
    cancel: 'Cancel',
    delete: 'Delete',
    deletePermanent: 'Delete permanently',
    edit: 'Edit',
    export: 'Export',
    import: 'Import',
    pin: 'Pin',
    pinToTop: 'Repin to top',
    restore: 'Restore',
    save: 'Save',
    selectFile: 'Select file...',
    trashed: 'Moved to trash',
    untrashed: 'Restored from trash',
    undo: 'Undo',
    unpin: 'Unpin',
  },
  dates: {
    today: 'Today',
    yesterday: 'Yesterday',
  },
  dump: {
    composerPlaceholder: 'Capture a thought...',
    emptyPlaceholder: 'Nothing to show, start with capturing first thought',
    deleteTitle: 'Delete note?',
    deleteMessage: 'Are you sure you want to delete this note? This cannot be undone.',
    pinnedNotesSeparator: 'Pinned Notes',
    recentNotesSeparator: 'Recent Notes',
    recentlyDeletedSeparator: 'Recently deleted',
    recentlyDeletedLink: 'Load recently deleted',
  },
  header: {
    backupAndRestoreView: 'Backup and Restore',
    noteEditView: 'Editing note',
    settingsView: 'Settings',
  },
  navbar: {
    dump: 'Dump',
    notepad: 'Notepad',
  },
}
