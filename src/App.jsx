import { useState } from 'react';
import LandingPage from './components/LandingPage';
import TangoGame from './components/TangoGame';

function App() {
  const [view, setView] = useState('landing'); // 'landing' | 'game'

  return (
    <div className="min-h-screen bg-cream">
      {view === 'landing' ? (
        <LandingPage onPlay={() => setView('game')} />
      ) : (
        <TangoGame onBack={() => setView('landing')} />
      )}
    </div>
  );
}

export default App;
