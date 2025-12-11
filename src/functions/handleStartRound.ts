import { toast } from "sonner";

const handleStartRound = ({
  players,
  selectedPlayerId,
  setPlayerA,
  setPlayerB,
  setIsRoundStarted,
  setIsReikapeliStarted,
  setCurrentHole,
}: any) => {
  const player = players.find((p) => p.id === selectedPlayerId);
  if (!player) {
    toast.error("Valitse pelaaja");
    return;
  }

  if (player.gamemode === "reikapeli") {
    const A = player;
    const B = players.find((p) => p.name === A.reikapeliVastustaja);

    if (!B) {
      toast.error("Valitse vastustaja");
      return;
    }

    setPlayerA(A);
    setPlayerB(B);
    setIsReikapeliStarted(true);
    setCurrentHole(0);
    return;
  }

  // Non-matchplay (stroke, scratch, bogey) start
  const playableModes = ["lyontipeli", "scratch", "piste-bogey"];
  if (!playableModes.includes(player.gamemode)) {
    toast.error("Laskeminen ei ole mahdollista");
    return;
  }

  setIsRoundStarted(true);
  setCurrentHole(0);
};

export default handleStartRound;
