import React, { useState, useEffect } from 'react';
import { loadContentPack } from './content/loader';
import { Header } from './components/common/Header';
import { BottomNav } from './components/common/BottomNav';
import { HomeScreen } from './screens/HomeScreen';
import { StagesScreen } from './screens/StagesScreen';
import { QuizScreen } from './screens/QuizScreen';
import { CarnetScreen } from './screens/CarnetScreen';
import { FinalScreen } from './screens/FinalScreen';
import { QrScreen } from './screens/QrScreen';
import { ValidatorScreen } from './screens/ValidatorScreen';
import { UserSession } from './domain/types';
import { createNewSession, answerQuestion } from './domain/session';
import {
  loadActiveSession,
  saveActiveSession,
  clearActiveSession
} from './storage/sessionStore';

export const App: React.FC = () => {
  const pack = loadContentPack();
  const [session, setSession] = useState<UserSession | null>(null);
  const [route, setRoute] = useState<string>(window.location.hash || '#home');

  useEffect(() => {
    loadActiveSession().then((saved) => {
      if (saved) setSession(saved);
    });

    const handleHashChange = () => {
      setRoute(window.location.hash || '#home');
    };
    window.addEventListener('hashchange', handleHashChange);
    return () => window.removeEventListener('hashchange', handleHashChange);
  }, []);

  const navigateTo = (newRoute: string) => {
    window.location.hash = newRoute;
    setRoute(newRoute);
  };

  const handleStartSession = async () => {
    const newSess = createNewSession(pack);
    await saveActiveSession(newSess);
    setSession(newSess);
    navigateTo('#stages');
  };

  const handleResetSession = async () => {
    await clearActiveSession();
    setSession(null);
    navigateTo('#home');
  };

  const handleAnswerQuestion = async (
    stageId: string,
    questionId: string,
    optionId: string
  ) => {
    if (!session) return;
    const { updatedSession } = answerQuestion(
      session,
      pack,
      stageId,
      questionId,
      optionId
    );
    await saveActiveSession(updatedSession);
    setSession(updatedSession);
  };

  const handleValidateFinal = async (keywords: Record<string, string>) => {
    if (!session) return;
    const updated: UserSession = {
      ...session,
      finalKeywordsSubmitted: keywords,
      isFinalValidated: true,
      finalCompletedAt: Date.now()
    };
    await saveActiveSession(updated);
    setSession(updated);
  };

  // Routeur par hash
  const renderCurrentScreen = () => {
    if (route === '#validateur') {
      return <ValidatorScreen />;
    }
    if (route === '#stages' && session) {
      return (
        <StagesScreen
          pack={pack}
          session={session}
          onSelectStage={(sId) => navigateTo(`#quiz/${sId}`)}
          onNavigate={navigateTo}
        />
      );
    }
    if (route.startsWith('#quiz/') && session) {
      const stageId = route.replace('#quiz/', '');
      return (
        <QuizScreen
          stageId={stageId}
          pack={pack}
          session={session}
          onAnswer={handleAnswerQuestion}
          onNavigate={navigateTo}
        />
      );
    }
    if (route === '#carnet' && session) {
      return (
        <CarnetScreen
          pack={pack}
          session={session}
          onNavigate={navigateTo}
        />
      );
    }
    if (route === '#final' && session) {
      return (
        <FinalScreen
          pack={pack}
          session={session}
          onValidateFinal={handleValidateFinal}
          onNavigate={navigateTo}
        />
      );
    }
    if (route === '#qr' && session) {
      return (
        <QrScreen
          pack={pack}
          session={session}
          onNavigate={navigateTo}
        />
      );
    }

    return (
      <HomeScreen
        pack={pack}
        session={session}
        onStartSession={handleStartSession}
        onResetSession={handleResetSession}
        onNavigate={navigateTo}
      />
    );
  };

  return (
    <div className="app-container">
      <Header
        currentRoute={route}
        onNavigate={navigateTo}
        hasActiveSession={Boolean(session)}
      />
      <main className="app-main" id="main-content">
        {renderCurrentScreen()}
      </main>
      <footer className="app-footer">
        <p>Visite patrimoniale de Saint-Junien • Conforme aux sources historiques</p>
        <p style={{ marginTop: 4, fontSize: '0.8rem' }}>
          Mode autonome hors ligne • Sauvegarde IndexedDB locale
        </p>
      </footer>
      <BottomNav
        currentRoute={route}
        onNavigate={navigateTo}
        hasActiveSession={Boolean(session)}
      />
    </div>
  );
};
