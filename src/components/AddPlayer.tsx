import { UserPlus } from "lucide-react";

// interface AddPlayer {
//   isRoundStarted: boolean;
//   newPlayer: any; // State variable
//   setNewPlayer: any;
//   tasoitus: any;
//   tarkkaTasoitus: any;
// }

const AddPlayer = ({
  isRoundStarted,
  newPlayer,
  setNewPlayer,
  tasoitus,
  tarkkaTasoitus,
  handleTasoitusChange,
  players,
  handleAddPlayer,
}: any) => {
  return (
    <div className="flex justify-center items-center h-screen">
      {!isRoundStarted && (
        <div className="bg-white rounded-xl shadow-md overflow-hidden">
          <div className="px-6 py-4 bg-gradient-to-r from-green-600 to-emerald-700">
            <h2 className="text-white">Lisää Pelaaja</h2>
          </div>
          <div className="p-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
              <div>
                <label className="block text-sm text-gray-700 mb-2">
                  Pelaajan nimi
                </label>
                <input
                  type="text"
                  value={newPlayer.name}
                  onChange={(e) =>
                    setNewPlayer({ ...newPlayer, name: e.target.value })
                  }
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                  placeholder="Syötä nimi"
                />
              </div>
              <div>
                <label className="block text-sm text-gray-700 mb-2">
                  Tee-valinta
                </label>
                <select
                  value={newPlayer.tee}
                  onChange={(e) => {
                    const t = e.target.value;
                    setNewPlayer({
                      ...newPlayer,
                      tee: t,
                      teeDescription:
                        t === "Keltainen"
                          ? "yellow"
                          : t === "Punainen"
                          ? "red"
                          : t === "Valkoinen"
                          ? "white"
                          : "blue",
                    });
                  }}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                >
                  <option>Keltainen</option>
                  <option>Punainen</option>
                  <option>Valkoinen</option>
                  <option>Sininen</option>
                </select>
              </div>
              <div>
                <label className="block text-sm text-gray-700 mb-2">
                  Tasoitus
                </label>
                <input
                  type="number"
                  value={tasoitus}
                  onChange={(e) =>
                    setNewPlayer({
                      ...newPlayer,
                      tasoitus: Number(e.target.value),
                    })
                  }
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                />
                <label className="block text-sm text-gray-700 mb-2">
                  Tarkka Tasoitus
                </label>
                <input
                  type="number"
                  value={tarkkaTasoitus}
                  onChange={handleTasoitusChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                />
              </div>
              <div>
                <label className="block text-sm text-gray-700 mb-2">
                  Sukupuoli
                </label>
                <select
                  value={newPlayer.gender}
                  onChange={(e) =>
                    setNewPlayer({
                      ...newPlayer,
                      gender: e.target.value as "mies" | "nainen",
                    })
                  }
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                >
                  <option value="mies">Mies</option>
                  <option value="nainen">Nainen</option>
                </select>
              </div>
              <div>
                <label className="block text-sm text-gray-700 mb-2">
                  Pelimuoto
                </label>
                <select
                  value={newPlayer.gamemode}
                  onChange={(e) =>
                    setNewPlayer({ ...newPlayer, gamemode: e.target.value })
                  }
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                >
                  <option value="lyontipeli">Lyöntipeli</option>
                  <option value="piste-bogey">Piste-Bogey</option>
                  <option value="scratch">Scratch</option>
                  <option value="reikapeli">Reikäpeli</option>
                </select>
              </div>
              <div>
                <label className="block text-sm text-gray-700 mb-2">
                  Reikäpeli vastustaja
                </label>
                <select
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                  value={newPlayer.reikapeliVastustaja}
                  onChange={(e) =>
                    setNewPlayer({
                      ...newPlayer,
                      reikapeliVastustaja: e.target.value,
                    })
                  }
                >
                  <option value="">Valitse pelaaja</option>
                  {players.map((p: any) => (
                    <option key={p.id} value={p.name}>
                      {p.name}
                    </option>
                  ))}
                </select>
              </div>
              <label className="block text-sm text-gray-700 mb-2">&nbsp;</label>
              <button
                onClick={handleAddPlayer}
                className="w-full px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors flex items-center justify-center gap-2"
              >
                <UserPlus className="w-4 h-4" />
                Lisää pelaaja
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AddPlayer;
