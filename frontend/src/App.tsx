import React, { useState } from "react";
import { AuthProvider } from "./context/AuthContext";
import { ThemeProvider } from "./context/ThemeContext";
import { Navbar } from "./components/Navbar";
import { Sidebar } from "./components/Sidebar";
import { AuthModal } from "./components/AuthModal";

import { LandingPage } from "./pages/LandingPage";
import { DashboardPage } from "./pages/DashboardPage";
import { AnalyzePage } from "./pages/AnalyzePage";
import { AnalysisResultPage } from "./pages/AnalysisResultPage";
import { HistoryPage } from "./pages/HistoryPage";
import { SourcesPage } from "./pages/SourcesPage";
import { MethodologyPage } from "./pages/MethodologyPage";
import { SettingsPage } from "./pages/SettingsPage";

export const AppContent: React.FC = () => {
  const [currentPage, setCurrentPage] = useState<string>("landing");
  const [selectedContentId, setSelectedContentId] = useState<number | null>(null);
  const [authModalOpen, setAuthModalOpen] = useState<boolean>(false);

  const handleNavigate = (page: string, id?: number) => {
    if (id !== undefined) {
      setSelectedContentId(id);
    }
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleAnalysisComplete = (contentId: number) => {
    setSelectedContentId(contentId);
    setCurrentPage("analysis");
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const renderPage = () => {
    switch (currentPage) {
      case "landing":
        return <LandingPage onNavigate={handleNavigate} onOpenAuth={() => setAuthModalOpen(true)} />;
      case "dashboard":
        return <DashboardPage onNavigate={handleNavigate} />;
      case "analyze":
        return <AnalyzePage onAnalysisComplete={handleAnalysisComplete} />;
      case "analysis":
        return selectedContentId ? (
          <AnalysisResultPage contentId={selectedContentId} onNavigate={handleNavigate} />
        ) : (
          <DashboardPage onNavigate={handleNavigate} />
        );
      case "history":
        return <HistoryPage onNavigate={handleNavigate} />;
      case "sources":
        return <SourcesPage />;
      case "methodology":
        return <MethodologyPage />;
      case "settings":
        return <SettingsPage />;
      default:
        return <LandingPage onNavigate={handleNavigate} onOpenAuth={() => setAuthModalOpen(true)} />;
    }
  };

  const isLanding = currentPage === "landing";

  return (
    <div className="min-h-screen flex flex-col bg-slate-950 text-slate-100 dark:bg-[#090e1c] light:bg-slate-50 light:text-slate-900 transition-colors">
      
      {/* Top Navbar */}
      <Navbar
        currentPage={currentPage}
        onNavigate={handleNavigate}
        onOpenAuth={() => setAuthModalOpen(true)}
      />

      {/* Main Body Area */}
      <div className="flex-1 flex max-w-7xl w-full mx-auto">
        
        {/* Persistent Sidebar for Application Views */}
        {!isLanding && (
          <Sidebar currentPage={currentPage} onNavigate={handleNavigate} />
        )}

        {/* Content View Container */}
        <main className={`flex-1 p-4 sm:p-6 lg:p-8 overflow-y-auto ${isLanding ? "max-w-7xl mx-auto" : ""}`}>
          {renderPage()}
        </main>

      </div>

      {/* Auth Modal */}
      <AuthModal
        isOpen={authModalOpen}
        onClose={() => setAuthModalOpen(false)}
      />

    </div>
  );
};

export default function App() {
  return (
    <ThemeProvider>
      <AuthProvider>
        <AppContent />
      </AuthProvider>
    </ThemeProvider>
  );
}
