import { useState, useEffect } from "react";
import { mockCourseHoles } from "../data/mockData";
import { ScorecardModal } from "./ScorecardModal";
import { Round } from "../types/golf";
import { TrendingUp, Award, Target } from "lucide-react";

export function Home() {
  const [selectedRound, setSelectedRound] = useState<Round | null>(null);
  const [players, setPlayers] = useState([]);
  const [scores, setScores] = useState([]);

  interface HoleScore {
    hole: number;
    par: number;
    score: number;
  }

  interface Round {
    id: string;
    playerId: string;
    player: string;
    venue: string;
    date: string;
    scores: HoleScore[];
    totalPoints: number;
    totalPar: number;
    tee: string;
    teeDescription: string;
    tasoitus: number;
  }

  useEffect(() => {
    fetch("http://localhost:3001/scores/scores")
      .then((res) => res.json())
      .then((data) => setScores(data))
      .catch((err) => console.error(err));
  }, []);

  console.log(scores);

  // console.log(players);

  useEffect(() => {
    fetch("http://localhost:3001/players/players")
      .then((res) => res.json())
      .then((data) => setPlayers(data))
      .catch((err) => console.error(err));
  }, []);

  return (
    <div className="space-y-8">
      {/* Recent Rounds */}
      <div className="bg-white rounded-xl shadow-md overflow-hidden">
        <div className="px-6 py-4 bg-gradient-to-r from-green-600 to-emerald-700">
          <h2 className="text-white">Viimeisimmät Kierrokset</h2>
        </div>
        <div className="p-6">
          <div className="space-y-4">
            {scores.map((round: Round, index) => {
              const scoreToPar = round.totalPoints - round.totalPar;
              const scoreColor =
                scoreToPar < 0
                  ? "text-green-600"
                  : scoreToPar > 0
                  ? "text-red-600"
                  : "text-gray-600";

              return (
                <div
                  key={index}
                  className="flex items-center justify-between p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
                >
                  <div className="flex-1">
                    <div className="flex items-center gap-3">
                      <span className="text-gray-500">Tulos {index + 1}</span>
                      <span className="text-gray-900">{round.player}</span>
                    </div>
                    <div className="flex items-center gap-4 mt-1 text-sm text-gray-600">
                      <span>{round.venue}</span>
                      <span>
                        {new Date(round.date).toLocaleDateString("fi-FI")}
                      </span>
                    </div>
                  </div>
                  <div
                    style={{
                      backgroundColor:
                        round.tee === "Keltainen"
                          ? "yellow"
                          : round.tee === "Punainen"
                          ? "red"
                          : round.tee === "Valkoinen"
                          ? "white"
                          : round.tee === "Sininen"
                          ? "blue"
                          : "",
                    }}
                    className="text-gray-600 text-sm text-right px-4 py-2 rounded-lg w-20 h-20 flex items-center justify-center"
                  >
                    <span>{round.tee}</span>
                  </div>
                  <div className="flex items-center gap-4">
                    <div className="text-right">
                      <div className="text-gray-900">{round.totalPoints}</div>
                      <div className={`text-sm ${scoreColor}`}>
                        {scoreToPar > 0 ? "+" : ""}
                        {scoreToPar}
                      </div>
                    </div>
                    <button
                      onClick={() => setSelectedRound(round)}
                      className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
                    >
                      Tulokset
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Course Stats */}
      <div className="bg-white rounded-xl shadow-md overflow-hidden">
        <div className="px-6 py-4 bg-gradient-to-r from-blue-600 to-indigo-700">
          <h2 className="text-white">Väylätiedot</h2>
        </div>
        <div className="p-6">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b-2 border-gray-200">
                  <th className="text-left py-3 px-4 text-gray-700">Väylä</th>
                  <th className="text-left py-3 px-4 text-gray-700">PAR</th>
                  <th className="text-left py-3 px-4 text-gray-700">
                    Pituus (m)
                  </th>
                  <th className="text-left py-3 px-4 text-gray-700">Väylä</th>
                  <th className="text-left py-3 px-4 text-gray-700">PAR</th>
                  <th className="text-left py-3 px-4 text-gray-700">
                    Pituus (m)
                  </th>
                </tr>
              </thead>
              <tbody>
                {mockCourseHoles.slice(0, 9).map((hole, index) => {
                  const backNine = mockCourseHoles[index + 9];
                  return (
                    <tr
                      key={hole.hole}
                      className="border-b border-gray-100 hover:bg-gray-50"
                    >
                      <td className="py-3 px-4 text-gray-900">{hole.hole}</td>
                      <td className="py-3 px-4 text-gray-900">{hole.par}</td>
                      <td className="py-3 px-4 text-gray-600">{hole.length}</td>
                      <td className="py-3 px-4 text-gray-900">
                        {backNine?.hole || "-"}
                      </td>
                      <td className="py-3 px-4 text-gray-900">
                        {backNine?.par || "-"}
                      </td>
                      <td className="py-3 px-4 text-gray-600">
                        {backNine?.length || "-"}
                      </td>
                    </tr>
                  );
                })}
                <tr className="border-t-2 border-gray-300">
                  <td className="py-3 px-4 text-gray-900">Yhteensä</td>
                  <td className="py-3 px-4 text-gray-900">
                    {mockCourseHoles
                      .slice(0, 9)
                      .reduce((sum, h) => sum + h.par, 0)}
                  </td>
                  <td className="py-3 px-4 text-gray-600">
                    {mockCourseHoles
                      .slice(0, 9)
                      .reduce((sum, h) => sum + h.length, 0)}
                  </td>
                  <td className="py-3 px-4 text-gray-900">Yhteensä</td>
                  <td className="py-3 px-4 text-gray-900">
                    {mockCourseHoles
                      .slice(9)
                      .reduce((sum, h) => sum + h.par, 0)}
                  </td>
                  <td className="py-3 px-4 text-gray-600">
                    {mockCourseHoles
                      .slice(9)
                      .reduce((sum, h) => sum + h.length, 0)}
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* Scorecard Modal */}
      {selectedRound && (
        <ScorecardModal
          round={selectedRound}
          onClose={() => setSelectedRound(null)}
        />
      )}
    </div>
  );
}
