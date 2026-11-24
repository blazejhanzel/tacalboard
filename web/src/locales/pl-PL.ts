export default {
  app: {
    backupAndRestore: 'Kopia zapasowa i przywracanie',
    settings: 'Ustawienia',
    theme: 'Motyw',
    themes: {
      system: 'Systemowy',
      light: 'Jasny',
      dark: 'Ciemny',
    },
  },
  backupAndRestore: {
    backupButton: 'Pobierz plik z kopią zapasową',
    backupHeader: 'Kopia zapasowa do pliku',
    backupHint:
      'Pozwala pobrać aktualną kopię bazy danych do pliku, dzięki czemu możliwe będzie jej odtworzenie, gdy zajdzie taka potrzeba. W przypadku korzystania z aplikacji w trybie serverless, zaleca się tworzenie kopii każdorazowo po wgraniu lub edycji dużej ilości danych.',
    restoreHeader: 'Przywracanie z pliku',
    restoreHint: 'Pozwala zaimportować bazę danych z pliku .json do aplikacji.',
    importAlerts: {
      success: 'Pomyślnie zaimportowano',
      error: 'Wystąpił błąd importowania',
    },
    importHint:
      'Wskaż plik, który ma zostać zaimportowany, a następnie naciśnij przycisk importu, aby wczytać bazę danych do aplikacji.',
    importTypes: {
      replace: 'Nadpisz istniejącą bazę danych',
      append: 'Dopisz do istniejącej bazy danych',
    },
  },
  common: {
    cancel: 'Anuluj',
    delete: 'Usuń',
    deletePermanent: 'Usuń trwale',
    edit: 'Edytuj',
    export: 'Eksportuj',
    import: 'Importuj',
    pin: 'Przypnij',
    pinToTop: 'Przepnij na górę',
    restore: 'Przywróć',
    save: 'Zapisz',
    selectFile: 'Wybierz plik...',
    trashed: 'Przeniesiono do kosza',
    untrashed: 'Przywrócono z kosza',
    undo: 'Cofnij',
    unpin: 'Odepnij',
  },
  dates: {
    today: 'Dzisiaj',
    yesterday: 'Wczoraj',
  },
  dump: {
    composerPlaceholder: 'Uchwyć myśl...',
    emptyPlaceholder: 'Nic do wyświetlenia, zacznij od uchwycenia pierwszej myśli',
    deleteTitle: 'Usunąć notatkę?',
    deleteMessage: 'Czy na pewno chcesz usunąć tę notatkę? Tej operacji nie można cofnąć.',
    pinnedNotesSeparator: 'Przypięte notatki',
    recentNotesSeparator: 'Ostatnie notatki',
    recentlyDeletedSeparator: 'Ostatnio usunięte',
    recentlyDeletedLink: 'Załaduj ostatnio usunięte',
  },
  header: {
    backupAndRestoreView: 'Kopia i przywracanie',
    noteEditView: 'Edycja notatki',
    settingsView: 'Ustawienia',
  },
  navbar: {
    dump: 'Stos',
    notepad: 'Notatnik',
  },
}
