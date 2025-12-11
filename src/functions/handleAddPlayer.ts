import { toast } from "sonner";

const handleAddPlayer = ({
  newPlayer,
  players,
  setPlayers,
  setNewPlayer,
  tasoitus,
}: any) => {
  if (!newPlayer.name.trim()) {
    toast.error("Pelaajan nimi puuttuu");
    return;
  }

  const player = {
    id: String(Date.now()),
    name: newPlayer.name,
    tee: newPlayer.tee,
    teeDescription: newPlayer.teeDescription,
    accuracy: newPlayer.accuracy,
    gender: newPlayer.gender,
    tasoitus: newPlayer.tasoitus,
    gamemode: newPlayer.gamemode,
    reikapeliVastustaja: newPlayer.reikapeliVastustaja,
  };

  if (player.tee === "Keltainen") player.teeDescription = "yellow";
  else if (player.tee === "Punainen") player.teeDescription = "red";
  else if (player.tee === "Valkoinen") player.teeDescription = "white";
  else if (player.tee === "Sininen") player.teeDescription = "blue";

  try {
    fetch("http://localhost:3001/players/addPlayer", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(player),
    });
  } catch (e: any) {
    console.error("Error: ", e.message);
  }

  setPlayers([...players, player]);
  setNewPlayer({
    name: "",
    tee: "Keltainen",
    teeDescription: "yellow",
    accuracy: newPlayer.accuracy,
    gender: player.gender,
    tasoitus: tasoitus,
    gamemode: newPlayer.gamemode,
    reikapeliVastustaja: "",
  });

  toast.success("Pelaaja lisätty!");
  console.log(player.gamemode);
  console.log(player.gender);
};

export default handleAddPlayer;
