import { useState } from 'react';
import UploadScreen from './components/UploadScreen';
import ScanScreen from './components/ScanScreen';
import ResultScreen from './components/ResultScreen';

function App() {
  const [stage, setStage] = useState('upload'); // 'upload', 'scan', 'result'

  return (
    <div className="app-container">
      <header className="app-header">
        <h1>Smart PQC Assessor</h1>
        <p>Post-Quantum Cryptography Readiness</p>
      </header>
      
      <main className="content-area">
        {stage === 'upload' && <UploadScreen onStartScan={() => setStage('scan')} />}
        {stage === 'scan' && <ScanScreen onComplete={() => setStage('result')} />}
        {stage === 'result' && <ResultScreen onRestart={() => setStage('upload')} />}
      </main>
    </div>
  );
}

export default App;
