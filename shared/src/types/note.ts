// Describes note structure for btoh client and server

export interface Note {
  id: string
  content: string
  createdAt: Date
  modifiedAt: Date
  revision: number
}