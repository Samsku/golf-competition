export interface Player {
  id: string;
  name: string;
  tee: string;
  teeDescription: string;
  accuracy: string;
  gender: "mies" | "nainen";
  tasoitus: number;
  gamemode: string;
  reikapeliVastustaja: string;
}

export interface HoleScore {
  hole: number;
  par: number;
  score: number;
}

export interface Round {
  id: string;
  playerId: string;
  playerName: string;
  venue: string;
  date: string;
  points: HoleScore[];
  totalScore: number;
  totalPar: number;
  tee: string;
  teeDescription: string;
  tasoitus: number;
  gamemode: string;
  reikapeliVastustaja?: string;
}

export interface CourseHole {
  hole: number;
  par: number;
  length: number;
  hcpIndex: number;
}
