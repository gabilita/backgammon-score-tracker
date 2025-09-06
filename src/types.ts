export type UserName = string

export interface Game {
  id: string
  a: UserName
  b: UserName
  lines: number
  winner: UserName
}

