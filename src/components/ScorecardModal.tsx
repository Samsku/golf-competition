import { Round } from "../types/golf";
import { X } from "lucide-react";

interface ScorecardModalProps {
  round: Round;
  onClose: () => void;
}

export function ScorecardModal({ round, onClose }: ScorecardModalProps) {
  console.log(round);
  if (!round) {
    console.log("Error");
  }
  const frontNine = round.points.slice(0, 9);
  const backNine = round.points.slice(9);
  const frontNineTotal = frontNine.reduce((sum, s) => sum + s.score, 0);
  const backNineTotal = backNine.reduce((sum, s) => sum + s.score, 0);
  const frontNinePar = frontNine.reduce((sum, s) => sum + s.par, 0);
  const backNinePar = backNine.reduce((sum, s) => sum + s.par, 0);

  console.log("Front 9:", frontNine);
  console.log("Back 9:", backNine);
  console.log("Front 9 Total:", frontNineTotal);
  console.log("Back 9 Total:", backNineTotal);
  console.log("Front 9 Par:", frontNinePar);
  console.log("Back 9 Par:", backNinePar);

  const totalScore = frontNineTotal + backNineTotal;
  const totalPar = frontNinePar + backNinePar;

  const getScoreColor = (score: number, par: number) => {
    const diff = score - par;
    if (diff < 0) return "bg-green-100 text-green-800";
    if (diff > 0) return "bg-red-100 text-red-800";
    return "bg-gray-100 text-gray-800";
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
        <div className="sticky top-0 bg-gradient-to-r from-green-600 to-emerald-700 px-6 py-4 flex items-center justify-between">
          <div>
            <h2 className="text-white">{round.playerName}</h2>
            <p className="text-green-100 text-sm">
              {round.venue} - {new Date(round.date).toLocaleDateString("fi-FI")}
            </p>
          </div>
          <button
            onClick={onClose}
            className="text-white hover:bg-white hover:bg-opacity-20 rounded-lg p-2 transition-colors"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        <div className="p-6 space-y-6">
          {/* Summary */}
          <div className="grid grid-cols-3 gap-4">
            <div className="bg-blue-50 rounded-lg p-4 text-center">
              <div className="text-sm text-gray-600 mb-1">Kokonaistulos</div>
              <div className="text-gray-900">{totalScore}</div>
            </div>
            <div className="bg-green-50 rounded-lg p-4 text-center">
              <div className="text-sm text-gray-600 mb-1">Kokonais PAR</div>
              <div className="text-gray-900">{round.totalPar}</div>
            </div>
            <div className="bg-purple-50 rounded-lg p-4 text-center">
              <div className="text-sm text-gray-600 mb-1">Tulos pariin</div>
              <div className="text-gray-900">
                {totalScore - totalPar > 0 ? "+" : ""}
                {totalScore - totalPar}
              </div>
            </div>
          </div>

          {/* Front Nine */}
          <div>
            <h3 className="text-gray-900 mb-3">1-9 väylät</h3>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b-2 border-gray-200">
                    <th className="text-left py-2 px-3 text-sm text-gray-700">
                      Väylä
                    </th>
                    {frontNine.map((hole) => (
                      <th
                        key={hole.hole}
                        className="text-center py-2 px-3 text-sm text-gray-700"
                      >
                        {hole.hole}
                      </th>
                    ))}
                    <th className="text-center py-2 px-3 text-sm text-gray-700">
                      Out
                    </th>
                  </tr>
                </thead>
                <tbody>
                  <tr className="border-b border-gray-100">
                    <td className="py-2 px-3 text-sm text-gray-700">PAR</td>
                    {frontNine.map((hole) => (
                      <td
                        key={hole.hole}
                        className="text-center py-2 px-3 text-sm text-gray-900"
                      >
                        {hole.par}
                      </td>
                    ))}
                    <td className="text-center py-2 px-3 text-sm text-gray-900">
                      {frontNinePar}
                    </td>
                  </tr>
                  <tr>
                    <td className="py-2 px-3 text-sm text-gray-700">Tulos</td>
                    {frontNine.map((hole) => (
                      <td key={hole.hole} className="text-center py-2 px-3">
                        <span
                          className={`inline-block px-2 py-1 rounded text-sm ${getScoreColor(
                            hole.score,
                            hole.par
                          )}`}
                        >
                          {hole.score}
                        </span>
                      </td>
                    ))}
                    <td className="text-center py-2 px-3 text-sm text-gray-900">
                      {frontNineTotal}
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>

          {/* Back Nine */}
          <div>
            <h3 className="text-gray-900 mb-3">10-18 väylät</h3>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b-2 border-gray-200">
                    <th className="text-left py-2 px-3 text-sm text-gray-700">
                      Väylä
                    </th>
                    {backNine.map((hole) => (
                      <th
                        key={hole.hole}
                        className="text-center py-2 px-3 text-sm text-gray-700"
                      >
                        {hole.hole}
                      </th>
                    ))}
                    <th className="text-center py-2 px-3 text-sm text-gray-700">
                      In
                    </th>
                  </tr>
                </thead>
                <tbody>
                  <tr className="border-b border-gray-100">
                    <td className="py-2 px-3 text-sm text-gray-700">PAR</td>
                    {backNine.map((hole) => (
                      <td
                        key={hole.hole}
                        className="text-center py-2 px-3 text-sm text-gray-900"
                      >
                        {hole.par}
                      </td>
                    ))}
                    <td className="text-center py-2 px-3 text-sm text-gray-900">
                      {backNinePar}
                    </td>
                  </tr>
                  <tr>
                    <td className="py-2 px-3 text-sm text-gray-700">Tulos</td>
                    {backNine.map((hole) => (
                      <td key={hole.hole} className="text-center py-2 px-3">
                        <span
                          className={`inline-block px-2 py-1 rounded text-sm ${getScoreColor(
                            hole.score,
                            hole.par
                          )}`}
                        >
                          {hole.score}
                        </span>
                      </td>
                    ))}
                    <td className="text-center py-2 px-3 text-sm text-gray-900">
                      {backNineTotal}
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>

          {/* Total */}
          <div className="border-t-2 border-gray-300 pt-4">
            <div className="grid grid-cols-3 gap-4">
              <div className="text-center">
                <div className="text-sm text-gray-600 mb-1">Kokonais PAR</div>
                <div className="text-gray-900">{round.totalPar}</div>
              </div>
              <div className="text-center">
                <div className="text-sm text-gray-600 mb-1">Kokonaistulos</div>
                <div className="text-gray-900">{totalScore}</div>
              </div>
              <div className="text-center">
                <div className="text-sm text-gray-600 mb-1">Pariin</div>
                <div className="text-gray-900">
                  {totalScore - totalPar > 0 ? "+" : ""}
                  {totalScore - totalPar}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
