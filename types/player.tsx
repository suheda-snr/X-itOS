export interface UserPlayer {
    id: string;
    email: string;
    password: string;
    username: string;
    firstName: string;
    lastName: string;
    phoneNumber: string;
    dateOfBirth: string; 
    role: string
    createdAt: string; 
    updatedAt: string; 
    companyId: string | null;
    profilePictureId: string | null;
  }
  
  export interface Player {
    id?: string | null;
    userId?: string | null;
    gameId: string;
    isGuest: boolean;
    isAdult: boolean;
    user?: UserPlayer | null;
  }

  export interface DisplayPlayers {
    id: string
    name: string
    isAdult: boolean | null
    isGuest: boolean
  }