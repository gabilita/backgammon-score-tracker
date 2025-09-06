export const STORAGE_KEYS = {
  users: 'bst:users',
  games: 'bst:games',
  scheme: 'bst:scheme',
} as const

export const UI_TEXT = {
  appTitle: 'Backgammon Score Tracker',
  welcome: 'Welcome to Backgammon Score Tracker',
  addUser: 'Add Player',
  nameLabel: 'Name',
  add: 'Add',
  noUsers: 'No players yet.',
  users: 'Players',
  addGame: 'Add Match / Lines',
  playerA: 'Player A',
  playerB: 'Player B',
  lines: 'Lines',
  recordWinner: 'Record Winner',
  confirmWinner: 'Confirm Winner',
  selectWinner: 'Select the winner for this game.',
  close: 'Close',
  games: 'Matches',
  ranking: 'Rankings',
  rank: 'Rank',
  player: 'Player',
  totalLines: 'Total Lines',
  toggleToDark: 'Switch to Dark',
  toggleToLight: 'Switch to Light',
  darkMode: 'Dark mode',
} as const

export type ColorScheme = 'light' | 'dark'

