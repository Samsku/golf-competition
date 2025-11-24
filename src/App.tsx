import { useState } from "react";
import { Home } from "./components/Home";
import { ResultsEntry } from "./components/ResultsEntry";
import { Menu, Plus, Home as HomeIcon } from "lucide-react";
import { Toaster } from "sonner";
import { BrowserRouter } from "react-router-dom";

export default function App() {
  const [currentPage, setCurrentPage] = useState<"home" | "results">("home");

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-emerald-100">
      {/* Header */}
      <header className="bg-white shadow-md">
        <div className="max-w-7xl mx-auto px-4 py-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-gradient-to-br from-green-600 to-emerald-700 rounded-lg flex items-center justify-center">
                <svg
                  className="w-6 h-6 text-white"
                  viewBox="0 0 24 24"
                  fill="currentColor"
                >
                  <path d="M17.5 3c-1.3 0-2.5.5-3.5 1.3-.9-.8-2.2-1.3-3.5-1.3C7.9 3 6 4.9 6 7.5c0 1.4.6 2.7 1.5 3.6L12 15.5l4.5-4.4c.9-.9 1.5-2.2 1.5-3.6C18 4.9 16.1 3 14.5 3h3z" />
                  <circle cx="12" cy="18" r="1" />
                </svg>
              </div>
              <h1 className="text-green-800">Golf Tulospalvelu</h1>
            </div>
            <nav className="flex items-center gap-2">
              <button
                onClick={() => setCurrentPage("home")}
                className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-colors ${
                  currentPage === "home"
                    ? "bg-green-600 text-white"
                    : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                }`}
              >
                <HomeIcon className="w-4 h-4" />
                Etusivu
              </button>
              <button
                onClick={() => setCurrentPage("results")}
                className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-colors ${
                  currentPage === "results"
                    ? "bg-green-600 text-white"
                    : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                }`}
              >
                <Plus className="w-4 h-4" />
                Tulossyöttö
              </button>
            </nav>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 py-8 sm:px-6 lg:px-8">
        {currentPage === "home" ? <Home /> : <ResultsEntry />}
      </main>

      <Toaster position="top-right" richColors />
    </div>
  );
}
