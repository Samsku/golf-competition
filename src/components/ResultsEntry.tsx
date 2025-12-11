import React, { useEffect, useState } from "react";
import { mockCourseHoles } from "../data/mockData";
import { Player, HoleScore } from "../types/golf";
import { UserPlus, Save, ChevronLeft, ChevronRight, Flag } from "lucide-react";
import { toast } from "sonner";
import { useNavigate } from "react-router-dom";
import { convertToPeliTasoitus } from "../convertToTarkka";
import AddPlayer from "./AddPlayer";
import handleAddPlayer from "../functions/handleAddPlayer";
import handleStartReikapeli from "../functions/handleStartReikapeli";
import handleScoreInput from "../functions/handleScoreInput";
import handleStartRound from "../functions/handleStartRound";
import handleNextMatchHole from "../functions/handleNextMatchHole";
import importedHandleTasoitusChange from "../functions/handleTasoitusChange";

interface NewPlayer {
  name: string;
  tee: string;
  teeDescription: string;
  accuracy: string;
  gender: "mies" | "nainen";
  tasoitus: number;
  gamemode: string;
  reikapeliVastustaja: string;
}

export function ResultsEntry() {
  const navigate = useNavigate();

  const [players, setPlayers] = useState<Player[]>([]);
  const [selectedPlayerId, setSelectedPlayerId] = useState<string>("");
  const [venue, setVenue] = useState("");
  const [date, setDate] = useState(new Date().toISOString().split("T")[0]);
  const [currentHole, setCurrentHole] = useState(0); // Index 0-17
  const [scores, setScores] = useState<HoleScore[]>(
    mockCourseHoles.map((hole) => ({
      hole: hole.hole,
      par: hole.par,
      score: hole.par,
    }))
  );
  const [isRoundStarted, setIsRoundStarted] = useState(false);
  const [isReikapeliStarted, setIsReikapeliStarted] = useState(false);
  const [newPlayer, setNewPlayer] = useState<NewPlayer>({
    name: "",
    tee: "Keltainen",
    teeDescription: "yellow",
    accuracy: "13",
    gender: "mies",
    tasoitus: 0,
    gamemode: "lyontipeli",
    reikapeliVastustaja: "",
  });
  const [tasoitus, setTasoitus] = useState(0);
  // Players in the match
  const [playerA, setPlayerA] = useState<Player | null>(null);
  const [playerB, setPlayerB] = useState<Player | null>(null);

  // Scores per hole (individual) for matchplay
  const [scoresA, setScoresA] = useState<number[]>(Array(18).fill(1));
  const [scoresB, setScoresB] = useState<number[]>(Array(18).fill(1));

  // Matchplay tracking
  const [matchScoreA, setMatchScoreA] = useState(0);
  const [matchScoreB, setMatchScoreB] = useState(0);
  const [currentHoleWinner, setCurrentHoleWinner] = useState<
    "A" | "B" | "AS" | ""
  >("");
  const [matchStatus, setMatchStatus] = useState("All Square");

  const [score, setScore] = useState(0);

  const [tarkkaTasoitus, setTarkkaTasoitus] = useState("");

  useEffect(() => {
    // fetch players
    const abort = new AbortController();
    fetch("http://localhost:3001/players/players", { signal: abort.signal })
      .then((res) => res.json())
      .then((data) => setPlayers(data))
      .catch((err) => {
        if (err.name !== "AbortError") console.error(err);
      });
    return () => abort.abort();
  }, []);

  // Immutable score update for the scores state (single hole)
  const handleScoreChange = (newScore: number) => {
    setScores((prev) =>
      prev.map((s, idx) => (idx === currentHole ? { ...s, score: newScore } : s))
    );
  };

  const handleNextHole = () => {
    if (currentHole < 17) {
      setCurrentHole((c) => c + 1);
    }
  };

  const handlePreviousHole = () => {
    if (currentHole > 0) {
      setCurrentHole((c) => c - 1);
    }
  };

  // addScore now expects the final prepared scores array
  async function addScore(totalScore: number, finalScores: HoleScore[]) {
    const player = players.find((p) => p.id === selectedPlayerId);
    if (!player) {
      toast.error("Valitse pelaaja!");
      return;
    }

    try {
      const res = await fetch("http://localhost:3001/scores/add", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          player: player.name,
          points: finalScores,
          pointsPerHole: finalScores,
          totalPoints: totalScore,
          totalPar: finalScores.reduce((sum, s) => sum + s.par, 0),
          tee: player.tee,
          teeDescription: player.teeDescription,
          date: new Date(),
          venue,
        }),
      });

      if (!res.ok) {
        const text = await res.text().catch(() => "");
        console.error("Add score failed:", res.status, text);
        toast.error("Tallennus epäonnistui (server error).");
        return;
      }

      const data = await res.json().catch(() => ({}));
      console.log("Inserted ID:", data.insertedId);
      if (data.insertedId) {
        toast.success("Kierros tallennettu palvelimeen!");
      } else {
        // backend might return different shape; still inform user
        toast.success("Kierros tallennettu!");
      }
    } catch (err) {
      console.error("Network or parsing error:", err);
      toast.error("Tallennus epäonnistui (verkko tai JSON).");
    }
  }

  const handleSaveRound = async () => {
    const totalDataPar = mockCourseHoles.reduce((sum, s) => sum + s.par, 0);
    const player = players.find((p) => p.id === selectedPlayerId);
    if (!player) {
      toast.error("Valitse pelaaja!");
      return;
    }

    // Use immutable transformations — create local prepared arrays (fixedScores)
    try {
      if (player.gamemode === "lyontipeli") {
        const fixedScores = scores.map((s, i) => {
          const tasoitusMahdollisuus =
            mockCourseHoles[i].hcpIndex <= player.tasoitus;
          const tasoitusLyonnit = 1;

          if (tasoitusMahdollisuus) {
            const maxScore = mockCourseHoles[i].par + 2 + tasoitusLyonnit;
            return { ...s, score: Math.min(s.score, maxScore) };
          }
          return s;
        });

        const totalScore =
          fixedScores.reduce((sum, s) => sum + s.score, 0) - player.tasoitus;
        const totalPar = fixedScores.reduce((sum, s) => sum + s.par, 0);
        const scoreToPar = totalScore - totalPar;

        toast.success(
          `Kierros tallennettu! Tulos: ${totalScore} (${
            scoreToPar > 0 ? "+" : ""
          }${scoreToPar})`
        );

        await addScore(totalScore, fixedScores);

        // reset UI
        setScores(
          mockCourseHoles.map((hole) => ({
            hole: hole.hole,
            par: hole.par,
            score: hole.par,
          }))
        );
        setVenue("");
        setSelectedPlayerId("");
        setIsRoundStarted(false);
        setCurrentHole(0);
      } else if (player.gamemode === "scratch") {
        // scratch: no handicap subtraction
        const fixedScores = scores.map((s, i) => {
          const tasoitusMahdollisuus =
            mockCourseHoles[i].hcpIndex <= player.tasoitus;
          const tasoitusLyonnit = 1;
          if (tasoitusMahdollisuus) {
            const maxScore = mockCourseHoles[i].par + 2 + tasoitusLyonnit;
            return { ...s, score: Math.min(s.score, maxScore) };
          }
          return s;
        });

        const totalScore = fixedScores.reduce((sum, s) => sum + s.score, 0);
        toast.success(`Kierros tallennettu! Lyönnit: ${totalScore}`);
        console.log("Lyönnit:", totalScore);

        await addScore(totalScore, fixedScores);

        // reset UI
        setScores(
          mockCourseHoles.map((hole) => ({
            hole: hole.hole,
            par: hole.par,
            score: hole.par,
          }))
        );
        setVenue("");
        setSelectedPlayerId("");
        setIsRoundStarted(false);
        setCurrentHole(0);
      } else if (player.gamemode === "piste-bogey" || player.gamemode === "pistebogey") {
        // build newPars and newScores immutably
        const newPars = mockCourseHoles.map((hole, i) =>
          hole.hcpIndex <= player.tasoitus ? hole.par + 1 : hole.par
        );

        const fixedScores = scores.map((s, i) => {
          const maxScore = mockCourseHoles[i].par + 10; // generous cap
          return { ...s, score: Math.min(s.score, maxScore) };
        });

        const newScores = fixedScores.map((s, i) => {
          const difference = newPars[i] - s.score;
          if (difference === 1) return 3;
          if (difference === 0) return 2;
          if (difference === -1) return 1;
          if (difference < -1) return 0;
          if (difference === 2) return 4;
          if (difference === 3) return 5;
          if (difference === 4) return 6;
          return 0;
        });

        const totalScore = newScores.reduce((sum, v) => sum + v, 0);

        toast.success(`Kierros tallennettu! Pisteet: ${totalScore}`);

        // For piste-bogey we store points array rather than raw hole scores.
        // Compose a payload that backend expects: keep finalScores as HoleScore[] for compatibility
        const finalScores: HoleScore[] = fixedScores.map((s, i) => ({
          ...s,
          // optionally attach point value in another field if backend expects it
          // e.g. (s as any).points = newScores[i];
        }));

        await addScore(totalScore, finalScores);

        // reset UI
        setScores(
          mockCourseHoles.map((hole) => ({
            hole: hole.hole,
            par: hole.par,
            score: hole.par,
          }))
        );
        setVenue("");
        setSelectedPlayerId("");
        setIsRoundStarted(false);
        setCurrentHole(0);
        return;
      } else if (player.gamemode === "reikapeli") {
        // Matchplay path: ensure match players exist
        if (!playerA || !playerB) {
          toast.error("Reikäpelin pelaajia ei löytynyt");
          return;
        }

        // send match to backend
        try {
          const res = await fetch("http://localhost:3001/scores/add", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              playerA: playerA.name,
              playerB: playerB.name,
              scoresA,
              scoresB,
              matchScoreA,
              matchScoreB,
              winner:
                matchScoreA > matchScoreB
                  ? playerA.name
                  : matchScoreB > matchScoreA
                  ? playerB.name
                  : "Tasapeli",
              date: new Date(),
            }),
          });

          if (!res.ok) {
            const text = await res.text().catch(() => "");
            console.error("Add match failed:", res.status, text);
            toast.error("Reikäpelin tallennus epäonnistui (server error).");
          } else {
            toast.success("Reikäpelin tulokset tallennettu!");
            setIsReikapeliStarted(false);
            setIsRoundStarted(false);
            setPlayerA(null);
            setPlayerB(null);
            setCurrentHole(0);
          }
        } catch (err) {
          console.error("Match save error:", err);
          toast.error("Reikäpelin tallennus epäonnistui (verkko).");
        }

        return;
      } else {
        // fallback generic save (if gamemode not matched)
        const fixedScores = scores.map((s) => ({ ...s }));
        const totalScore = fixedScores.reduce((sum, s) => sum + s.score, 0);
        await addScore(totalScore, fixedScores);

        // reset UI
        setScores(
          mockCourseHoles.map((hole) => ({
            hole: hole.hole,
            par: hole.par,
            score: hole.par,
          }))
        );
        setVenue("");
        setSelectedPlayerId("");
        setIsRoundStarted(false);
        setCurrentHole(0);
      }
    } catch (err) {
      console.error("handleSaveRound error:", err);
      toast.error("Tallennus epäonnistui.");
    }
  };

  const currentHoleData = mockCourseHoles[currentHole];
  const currentScore = scores[currentHole];
  const completedHoles = currentHole;
  const totalScore = scores
    .slice(0, currentHole + 1)
    .reduce((sum, s) => sum + s.score, 0);
  const totalPar = scores
    .slice(0, currentHole + 1)
    .reduce((sum, s) => sum + s.par, 0);

  return (
    <div className="space-y-8">
      <AddPlayer
        isRoundStarted={isRoundStarted}
        newPlayer={newPlayer}
        setNewPlayer={setNewPlayer}
        tasoitus={tasoitus}
        tarkkaTasoitus={tarkkaTasoitus}
        // wrap the imported handler so 'e' is provided correctly when AddPlayer calls this prop
        handleTasoitusChange={(e: any) =>
          importedHandleTasoitusChange(e, {
            newPlayer,
            setTarkkaTasoitus,
            setTasoitus,
          })
        }
        players={players}
        handleAddPlayer={() =>
          handleAddPlayer({
            newPlayer,
            players,
            setPlayers,
            tasoitus,
            tarkkaTasoitus,
          })
        }
      />
      {/* Round Setup or Score Entry */}
      <div className="bg-white rounded-xl shadow-md overflow-hidden">
        <div className="px-6 py-4 bg-gradient-to-r from-blue-600 to-indigo-700">
          <h2 className="text-white">
            <span>
              {isRoundStarted ? `Väylä ${currentHole + 1} / 18` : "Aloita Kierros"}
            </span>
          </h2>
        </div>

        {isReikapeliStarted && (
          <div className="p-6">
            {/* Header */}
            <h2 className="text-xl font-bold text-center mb-4">
              Reikäpeli: {playerA?.name} vs {playerB?.name}
            </h2>

            {/* Current Hole */}
            <div className="bg-blue-50 p-4 rounded-xl mb-6 text-center">
              <div className="text-sm text-gray-500">Väylä</div>
              <div className="text-3xl font-bold">{currentHole + 1}</div>
            </div>

            {/* Score Inputs */}
            <div className="grid grid-cols-2 gap-4 mb-6">
              {/* Player A Score */}
              <div className="bg-white p-4 rounded-xl shadow text-center">
                <div className="font-bold text-lg mb-2">{playerA?.name}</div>

                <div className="flex items-center justify-center gap-3">
                  <button
                    onClick={() =>
                      setScoresA((prev) =>
                        prev.map((score, idx) =>
                          idx === currentHole ? Math.max(1, score - 1) : score
                        )
                      )
                    }
                  >
                    −
                  </button>

                  <div className="text-2xl">{scoresA[currentHole]}</div>

                  <button
                    onClick={() =>
                      setScoresA((prev) =>
                        prev.map((score, idx) =>
                          idx === currentHole ? Math.min(15, score + 1) : score
                        )
                      )
                    }
                  >
                    +
                  </button>
                </div>
              </div>

              {/* Player B Score */}
              <div className="bg-white p-4 rounded-xl shadow text-center">
                <div className="font-bold text-lg mb-2">{playerB?.name}</div>

                <div className="flex items-center justify-center gap-3">
                  <button
                    onClick={() =>
                      setScoresB((prev) =>
                        prev.map((score, idx) =>
                          idx === currentHole ? Math.max(1, score - 1) : score
                        )
                      )
                    }
                    className="w-10 h-10 bg-gray-200 rounded-full"
                  >
                    −
                  </button>

                  <div className="text-2xl">{scoresB[currentHole]}</div>

                  <button
                    onClick={() =>
                      setScoresB((prev) =>
                        prev.map((score, idx) =>
                          idx === currentHole ? Math.min(15, score + 1) : score
                        )
                      )
                    }
                    className="w-10 h-10 bg-gray-200 rounded-full"
                  >
                    +
                  </button>
                </div>
              </div>
            </div>

            {/* Hole Winner */}
            <div className="text-center text-xl font-bold mb-6">
              {currentHoleWinner === "A" && (
                <span className="text-green-600">{playerA?.name} voitti reiän</span>
              )}
              {currentHoleWinner === "B" && (
                <span className="text-blue-600">{playerB?.name} voitti reiän</span>
              )}
              {currentHoleWinner === "AS" && (
                <span className="text-gray-600">Reikä tasattiin</span>
              )}
            </div>

            {/* Navigation */}
            <div className="flex justify-between">
              <button
                onClick={handlePreviousHole}
                disabled={currentHole === 0}
                className="px-6 py-3 bg-gray-200 rounded-lg disabled:opacity-50"
              >
                Edellinen
              </button>

              <button
                onClick={() =>
                  handleNextMatchHole({
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
                    handleSaveRound,
                  })
                }
                className="px-6 py-3 bg-green-600 text-white rounded-lg"
              >
                Seuraava
              </button>
            </div>

            {/* Match Status */}
            <div className="mt-6 text-center text-2xl font-bold">{matchStatus}</div>
            {!isReikapeliStarted && (
              <button
                onClick={handleSaveRound}
                className="w-full mt-6 py-3 bg-blue-600 text-white rounded-lg"
              >
                Tallenna reikapeli tulos
              </button>
            )}
          </div>
        )}

        {!isRoundStarted ? (
          // Round Setup
          <div className="p-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
              <div>
                <label className="block text-sm text-gray-700 mb-2">Pelaaja</label>
                <select
                  value={selectedPlayerId}
                  onChange={(e) => setSelectedPlayerId(e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value="">Valitse pelaaja</option>
                  {players.map((player) => (
                    <option key={player.id} value={player.id}>
                      {player.name}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm text-gray-700 mb-2">Pelipaikka</label>
                <input
                  type="text"
                  value={venue}
                  onChange={(e) => setVenue(e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Esim. Helsinki Golf Club"
                />
              </div>
              <div>
                <label className="block text-sm text-gray-700 mb-2">Päivämäärä</label>
                <input
                  type="date"
                  value={date}
                  onChange={(e) => setDate(e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
            </div>
            <div className="flex justify-center">
              <button
                onClick={() =>
                  handleStartRound({
                    players,
                    selectedPlayerId,
                    setPlayerA,
                    setPlayerB,
                    setIsRoundStarted,
                    setIsReikapeliStarted,
                    setCurrentHole,
                  })
                }
                className="px-8 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center gap-2"
              >
                <Flag className="w-5 h-5" />
                Aloita kierros
              </button>
            </div>
          </div>
        ) : (
          // Score Entry for Current Hole
          <div className="p-6">
            {/* Progress Bar */}
            <div className="mb-6">
              <div className="flex justify-between text-sm text-gray-600 mb-2">
                <span>Edistyminen</span>
                <span>{currentHole + 1} / 18</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div
                  className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                  style={{ width: `${((currentHole + 1) / 18) * 100}%` }}
                />
              </div>
            </div>

            {/* Current Hole Info */}
            <div className="bg-gradient-to-r from-green-50 to-emerald-50 rounded-xl p-6 mb-6">
              <div className="grid grid-cols-3 gap-4 mb-6">
                <div className="text-center">
                  <div className="text-sm text-gray-600 mb-1">Väylä</div>
                  <div className="text-green-800">{currentHoleData.hole}</div>
                </div>
                <div className="text-center">
                  <div className="text-sm text-gray-600 mb-1">PAR</div>
                  <div className="text-green-800">{currentHoleData.par}</div>
                </div>
                <div className="text-center">
                  <div className="text-sm text-gray-600 mb-1">Pituus (m)</div>
                  <div className="text-green-800">{currentHoleData.length}</div>
                </div>
              </div>

              {/* Score Input */}
              <div className="text-center">
                <label className="block text-sm text-gray-700 mb-3">Syötä tulos</label>
                <div className="flex items-center justify-center gap-4">
                  <button
                    onClick={() =>
                      handleScoreChange(Math.max(1, currentScore.score - 1))
                    }
                    className="w-12 h-12 bg-white rounded-full shadow-md hover:shadow-lg transition-shadow flex items-center justify-center text-gray-700 hover:text-green-600"
                  >
                    <span className="text-xl">−</span>
                  </button>
                  <div className="w-24 h-24 bg-white rounded-full shadow-lg flex items-center justify-center">
                    <span className="text-green-800">{currentScore.score}</span>
                  </div>
                  <button
                    onClick={() =>
                      handleScoreChange(Math.min(15, currentScore.score + 1))
                    }
                    className="w-12 h-12 bg-white rounded-full shadow-md hover:shadow-lg transition-shadow flex items-center justify-center text-gray-700 hover:text-green-600"
                  >
                    <span className="text-xl">+</span>
                  </button>
                </div>
                <div className="mt-3 text-sm text-gray-600">
                  {currentScore.score - currentHoleData.par === 0 && "PAR"}
                  {currentScore.score - currentHoleData.par === -2 && "Eagle!"}
                  {currentScore.score - currentHoleData.par === -1 && "Birdie!"}
                  {currentScore.score - currentHoleData.par === 1 && "Bogey"}
                  {currentScore.score - currentHoleData.par === 2 && "Double Bogey"}
                  {currentScore.score - currentHoleData.par > 2 &&
                    `+${currentScore.score - currentHoleData.par}`}
                </div>
              </div>
            </div>

            {/* Current Score Summary */}
            <div className="grid grid-cols-3 gap-4 mb-6">
              <div className="bg-gray-50 rounded-lg p-4 text-center">
                <div className="text-sm text-gray-600 mb-1">Pelattu</div>
                <div className="text-gray-900">{completedHoles + 1} väylää</div>
              </div>
              <div className="bg-gray-50 rounded-lg p-4 text-center">
                <div className="text-sm text-gray-600 mb-1">Tulos tähän asti</div>
                <div className="text-gray-900">{totalScore}</div>
              </div>
              <div className="bg-gray-50 rounded-lg p-4 text-center">
                <div className="text-sm text-gray-600 mb-1">Pariin</div>
                <div className="text-gray-900">
                  {totalScore - totalPar > 0 ? "+" : ""}
                  {totalScore - totalPar}
                </div>
              </div>
            </div>

            {/* Navigation Buttons */}
            <div className="flex items-center justify-between gap-4">
              <button
                onClick={handlePreviousHole}
                disabled={currentHole === 0}
                className="flex-1 px-6 py-3 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-colors flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <ChevronLeft className="w-5 h-5" />
                Edellinen
              </button>

              {currentHole < 17 ? (
                <button
                  onClick={handleNextHole}
                  className="flex-1 px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center justify-center gap-2"
                >
                  Seuraava
                  <ChevronRight className="w-5 h-5" />
                </button>
              ) : (
                <button
                  onClick={handleSaveRound}
                  className="flex-1 px-6 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors flex items-center justify-center gap-2"
                >
                  <Save className="w-5 h-5" />
                  Tallenna kierros
                </button>
              )}
            </div>

            {/* Hole by Hole Summary */}
            <div className="mt-6">
              <h3 className="text-gray-900 mb-3">Väyläkohtaiset tulokset</h3>
              <div className="grid grid-cols-9 gap-2">
                {scores.slice(0, 9).map((score, idx) => {
                  const isCompleted = idx <= currentHole;
                  const isCurrent = idx === currentHole;
                  return (
                    <button
                      key={idx}
                      onClick={() => setCurrentHole(idx)}
                      className={`p-2 rounded text-center transition-colors ${
                        isCurrent
                          ? "bg-blue-600 text-white"
                          : isCompleted
                          ? "bg-green-100 text-green-800 hover:bg-green-200"
                          : "bg-gray-100 text-gray-400"
                      }`}
                    >
                      <div className="text-xs">{idx + 1}</div>
                      {isCompleted && <div className="text-sm">{score.score}</div>}
                    </button>
                  );
                })}
              </div>
              <div className="grid grid-cols-9 gap-2 mt-2">
                {scores.slice(9).map((score, idx) => {
                  const actualIdx = idx + 9;
                  const isCompleted = actualIdx <= currentHole;
                  const isCurrent = actualIdx === currentHole;
                  return (
                    <button
                      key={actualIdx}
                      onClick={() => setCurrentHole(actualIdx)}
                      className={`p-2 rounded text-center transition-colors ${
                        isCurrent
                          ? "bg-blue-600 text-white"
                          : isCompleted
                          ? "bg-green-100 text-green-800 hover:bg-green-200"
                          : "bg-gray-100 text-gray-400"
                      }`}
                    >
                      <div className="text-xs">{actualIdx + 1}</div>
                      {isCompleted && <div className="text-sm">{score.score}</div>}
                    </button>
                  );
                })}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default ResultsEntry;
