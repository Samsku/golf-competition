import { toast } from "sonner";

const handleNextMatchHole = ({
  playerA,
  playerB,
  scoresA,
  scoresB,
  currentHole,
  setMatchScoreA,
  setMatchScoreB,
  setCurrentHoleWinner,
  matchScoreA,
  matchScoreB,
  setCurrentHole,
  setMatchStatus,
  setIsReikapeliStarted,
  handleSaveRound, // lisää tämä parametri
}: any) => {
  if (!playerA || !playerB) return;

  const scoreA = scoresA[currentHole];
  const scoreB = scoresB[currentHole];

  let newScoreA = matchScoreA;
  let newScoreB = matchScoreB;

  // Väylän voittaja
  if (scoreA < scoreB) {
    newScoreA += 1;
    setMatchScoreA(newScoreA);
    setCurrentHoleWinner("A");
  } else if (scoreB < scoreA) {
    newScoreB += 1;
    setMatchScoreB(newScoreB);
    setCurrentHoleWinner("B");
  } else {
    setCurrentHoleWinner("AS");
  }

  const lead = newScoreA - newScoreB;
  const holesRemaining = 17 - currentHole;

  // Peli päättyy ennen viimeistä reikää
  if (lead > holesRemaining) {
    setMatchStatus(`${playerA.name} wins ${lead} & ${holesRemaining}`);
    toast.success(`${playerA.name} voitti reikäpelin!`);
    setIsReikapeliStarted(false);
    handleSaveRound(); // tallennus backendille
    return;
  }

  if (-lead > holesRemaining) {
    setMatchStatus(`${playerB.name} wins ${-lead} & ${holesRemaining}`);
    toast.success(`${playerB.name} voitti reikäpelin!`);
    setIsReikapeliStarted(false);
    handleSaveRound(); // tallennus backendille
    return;
  }

  // Viimeinen reikä
  if (currentHole === 17) {
    if (lead > 0) {
      setMatchStatus(`${playerA.name} wins 1 UP`);
      toast.success(`${playerA.name} voitti 1 UP`);
    } else if (lead < 0) {
      setMatchStatus(`${playerB.name} wins 1 UP`);
      toast.success(`${playerB.name} voitti 1 UP`);
    } else {
      setMatchStatus("All Square");
      toast.success("Tasapeli / All Square");
    }

    setIsReikapeliStarted(false);
    handleSaveRound(); // tallennus backendille
    return;
  }

  // Siirry seuraavalle väylälle
  setCurrentHole((prev) => prev + 1);
};

export default handleNextMatchHole;
