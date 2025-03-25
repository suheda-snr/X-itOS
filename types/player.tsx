export interface Player{
    id?: string
    gameId: string
    userId?: string
    isGuest: boolean
    isAdult: boolean
}

export interface Guest{
    gameId: string
    isGuest: boolean
    isAdult: boolean
}

export interface UserFull{
    name: string
    isGuest: boolean
    isAdult: boolean
}