import { Round, CourseHole } from "../types/golf";

// export const mockPlayers: Player[] = [
//   {
//     id: "1",
//     name: "Matti Virtanen",
//     tee: "Keltainen",
//     tee
//     accuracy: "Vaikea",
//     gender: "mies",
//     tasoitus: 13,
//     gamemode: "lyontipeli",
//   },
//   {
//     id: "2",
//     name: "Liisa Korhonen",
//     tee: "Punainen",
//     accuracy: "Keskivaikea",
//     gender: "nainen",
//     tasoitus: 12,
//     gamemode: "lyontipeli",
//   },
//   {
//     id: "3",
//     name: "Jussi Nieminen",
//     tee: "Valkoinen",
//     accuracy: "Helppo",
//     gender: "mies",
//     tasoitus: 11,
//     gamemode: "lyontipeli",
//   },
//   {
//     id: "4",
//     name: "Anna Mäkinen",
//     tee: "Punainen",
//     accuracy: "Keskivaikea",
//     gender: "nainen",
//     tasoitus: 12,
//     gamemode: "lyontipeli",
//   },
//   {
//     id: "5",
//     name: "Pekka Salo",
//     tee: "Sininen",
//     accuracy: "Vaikea",
//     gender: "mies",
//     tasoitus: 18,
//     gamemode: "lyontipeli",
//   },
// ];

// export const mockCourseHoles: CourseHole[] = [
//   { hole: 1, par: 4, length: 352 },
//   { hole: 2, par: 3, length: 165 },
//   { hole: 3, par: 5, length: 487 },
//   { hole: 4, par: 4, length: 378 },
//   { hole: 5, par: 4, length: 341 },
//   { hole: 6, par: 3, length: 178 },
//   { hole: 7, par: 5, length: 512 },
//   { hole: 8, par: 4, length: 389 },
//   { hole: 9, par: 4, length: 356 },
//   { hole: 10, par: 4, length: 368 },
//   { hole: 11, par: 3, length: 182 },
//   { hole: 12, par: 5, length: 498 },
//   { hole: 13, par: 4, length: 372 },
//   { hole: 14, par: 4, length: 345 },
//   { hole: 15, par: 3, length: 171 },
//   { hole: 16, par: 5, length: 523 },
//   { hole: 17, par: 4, length: 394 },
//   { hole: 18, par: 4, length: 367 },
// ];

// export const mockCourseHoles: CourseHole[] = [
//   { hole: 1, par: 4, length: 352, hcpIndex: 7 },
//   { hole: 2, par: 4, length: 165, hcpIndex: 13 },
//   { hole: 3, par: 4, length: 487, hcpIndex: 3 },
//   { hole: 4, par: 3, length: 378, hcpIndex: 15 },
//   { hole: 5, par: 4, length: 341, hcpIndex: 11 },
//   { hole: 6, par: 5, length: 178, hcpIndex: 1 },
//   { hole: 7, par: 3, length: 512, hcpIndex: 17 },
//   { hole: 8, par: 4, length: 389, hcpIndex: 5 },
//   { hole: 9, par: 4, length: 356, hcpIndex: 9 },
//   { hole: 10, par: 3, length: 368, hcpIndex: 18 },
//   { hole: 11, par: 4, length: 182, hcpIndex: 12 },
//   { hole: 12, par: 5, length: 498, hcpIndex: 4 },
//   { hole: 13, par: 3, length: 372, hcpIndex: 14 },
//   { hole: 14, par: 4, length: 345, hcpIndex: 8 },
//   { hole: 15, par: 5, length: 171, hcpIndex: 2 },
//   { hole: 16, par: 3, length: 523, hcpIndex: 16 },
//   { hole: 17, par: 4, length: 394, hcpIndex: 6 },
//   { hole: 18, par: 4, length: 367, hcpIndex: 10 },
// ];

export const mockCourseHoles: CourseHole[] = [
  { hole: 1, par: 3, length: 352, hcpIndex: 15 },
  { hole: 2, par: 4, length: 165, hcpIndex: 5 },
  { hole: 3, par: 5, length: 487, hcpIndex: 11 },
  { hole: 4, par: 5, length: 378, hcpIndex: 1 },
  { hole: 5, par: 4, length: 341, hcpIndex: 3 },
  { hole: 6, par: 4, length: 178, hcpIndex: 7 },
  { hole: 7, par: 4, length: 512, hcpIndex: 9 },
  { hole: 8, par: 3, length: 389, hcpIndex: 17 },
  { hole: 9, par: 4, length: 356, hcpIndex: 13 },
  { hole: 10, par: 3, length: 368, hcpIndex: 16 },
  { hole: 11, par: 4, length: 182, hcpIndex: 6 },
  { hole: 12, par: 5, length: 498, hcpIndex: 12 },
  { hole: 13, par: 5, length: 372, hcpIndex: 2 },
  { hole: 14, par: 4, length: 345, hcpIndex: 4 },
  { hole: 15, par: 4, length: 171, hcpIndex: 8 },
  { hole: 16, par: 4, length: 523, hcpIndex: 10 },
  { hole: 17, par: 3, length: 394, hcpIndex: 18 },
  { hole: 18, par: 4, length: 367, hcpIndex: 14 },
];

// const generateScores = (playerId: string): HoleScore[] => {
//   return mockCourseHoles.map((hole) => {
//     const variance = Math.floor(Math.random() * 3) - 1; // -1, 0, or 1
//     return {
//       hole: hole.hole,
//       par: hole.par,
//       score: hole.par + variance,
//     };
//   });
// };

// export const mockRounds: Round[] = [
//   {
//     id: "r1",
//     playerId: "1",
//     playerName: "Matti Virtanen",
//     venue: "Helsinki Golf Club",
//     date: "2025-05-15",
//     scores: generateScores("1"),
//     totalScore: 0,
//     totalPar: 0,
//     tee: "yellow",
//     teeDescription: "Keltainen",
//     tasoitus: 13,
//   },
//   {
//     id: "r2",
//     playerId: "2",
//     playerName: "Liisa Korhonen",
//     venue: "Espoo Golf",
//     date: "2025-05-14",
//     scores: generateScores("2"),
//     totalScore: 0,
//     totalPar: 0,
//     tee: "red",
//     teeDescription: "Punainen",
//     tasoitus: 12,
//   },
//   {
//     id: "r3",
//     playerId: "3",
//     playerName: "Jussi Nieminen",
//     venue: "Vantaa Golf",
//     date: "2025-05-13",
//     scores: generateScores("3"),
//     totalScore: 0,
//     totalPar: 0,
//     tee: "white",
//     teeDescription: "Valkoinen",
//     tasoitus: 11,
//   },
//   {
//     id: "r4",
//     playerId: "1",
//     playerName: "Matti Virtanen",
//     venue: "Tali Golf",
//     date: "2025-05-12",
//     scores: generateScores("1"),
//     totalScore: 0,
//     totalPar: 0,
//     tee: "yellow",
//     teeDescription: "Keltainen",
//     tasoitus: 13,
//   },
//   {
//     id: "r5",
//     playerId: "4",
//     playerName: "Anna Mäkinen",
//     venue: "Helsinki Golf Club",
//     date: "2025-05-11",
//     scores: generateScores("4"),
//     totalScore: 0,
//     totalPar: 0,
//     tee: "red",
//     teeDescription: "Punainen",
//     tasoitus: 12,
//   },
// ];

// // Calculate totals
// mockRounds.forEach((round) => {
//   round.totalScore = round.scores.reduce((sum, score) => sum + score.score, 0);
//   round.totalPar = round.scores.reduce((sum, score) => sum + score.par, 0);
// });

import { HoleScore } from "../types/golf";
