import { toast } from "sonner";

const handleStartReikapeli = ({
  players,
  selectedPlayerId,
  setPlayerA,
  setPlayerB,
  setScoresA,
  setScoresB,
  setMatchScoreA,
  setMatchScoreB,
  setCurrentHoleWinner,
  setCurrentHole,
  setMatchStatus,
  setIsReikapeliStarted,
}: any) => {
  const A = players.find((p) => p.id === selectedPlayerId);
  const B = players.find((p) => p.name === A?.reikapeliVastustaja);

  if (!A || !B) {
    toast.error("Valitse molemmat pelaajat");
    return;
  }

  setPlayerA(A);
  setPlayerB(B);
  setScoresA(Array(18).fill(0));
  setScoresB(Array(18).fill(0));
  setMatchScoreA(0);
  setMatchScoreB(0);
  setCurrentHoleWinner("");
  setCurrentHole(0);
  setMatchStatus("All Square");
  setIsReikapeliStarted(true);
};

export default handleStartReikapeli;
