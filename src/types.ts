export type UserName = string

export interface Game {
  id: string
  a: UserName
  b: UserName
  lines: number
  winner: UserName
}

export interface GameResult {
  id: string
  winner: UserName
}

export interface Match {
  id: string
  games: GameResult[]
  winner?: UserName
}

export interface Session {
  id: string
  dateISO: string
  playerA: UserName
  playerB: UserName
  matches: Match[]
}

