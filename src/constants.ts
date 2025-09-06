export const STORAGE_KEYS = {
  users: 'bst:users',
  games: 'bst:games',
  scheme: 'bst:scheme',
} as const

export const UI_TEXT = {
  appTitle: 'Backgammon Score Tracker',
  addUser: 'Add User',
  nameLabel: 'Name',
  add: 'Add',
  noUsers: 'No users yet.',
  users: 'Users',
  addGame: 'Add Game / Lines',
  playerA: 'Player A',
  playerB: 'Player B',
  lines: 'Lines',
  recordWinner: 'Record Winner',
  confirmWinner: 'Confirm Winner',
  selectWinner: 'Select the winner for this game.',
  close: 'Close',
  games: 'Games',
  ranking: 'Ranking',
  rank: 'Rank',
  player: 'Player',
  totalLines: 'Total Lines',
  toggleToDark: 'Switch to Dark',
  toggleToLight: 'Switch to Light',
} as const

export type ColorScheme = 'light' | 'dark'

