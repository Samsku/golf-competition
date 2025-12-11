const handleScoreInput = (
  player: "A" | "B",
  score: number,
  setScoresA: any,
  setScoresB: any,
  currentHole: number
) => {
  if (player === "A") {
    setScoresA((prev) => {
      const newScores = [...prev];
      newScores[currentHole] = score;
      return newScores;
    });
  } else {
    setScoresB((prev) => {
      const newScores = [...prev];
      newScores[currentHole] = score;
      return newScores;
    });
  }
};

export default handleScoreInput;
