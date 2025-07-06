export interface Option {
  id: string
  text: string
  votes?: number
}

export interface Poll {
  id: string
  question: string
  options: Option[]
  isPublic: boolean
  isActive: boolean
  totalVotes?: number
  userVoted?: boolean
  endDate: string
  timeRemaining: string
  createdAt: string
}

export interface Analytics {
  totalPolls: number
  totalVotes: number
  activePolls: number
  avgParticipation: number
}