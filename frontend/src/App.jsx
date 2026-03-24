import { useState } from 'react';
import UploadScreen from './components/UploadScreen';
import ScanScreen from './components/ScanScreen';
import ResultScreen from './components/ResultScreen';

function App() {
  const [stage, setStage] = useState('upload'); // 'upload' | 'scan' | 'result'
  const [uploadedFile, setUploadedFile] = useState(null);
  const [analysisResult, setAnalysisResult] = useState(null);

  const handleStartScan = (file) => {
    setUploadedFile(file);
    setStage('scan');
  };

  const handleScanComplete = (result) => {
    setAnalysisResult(result);
    setStage('result');
  };

  const handleRestart = () => {
    setUploadedFile(null);
    setAnalysisResult(null);
    setStage('upload');
  };

  return (
    <div className="app-container">
      <div className="app-header">
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <span style={{ color: '#ff3b3b', fontSize: '8px', lineHeight: 1 }}>●</span>
          <h1 style={{ color: '#ffffff', fontSize: '18px', fontWeight: 600, margin: 0, letterSpacing: '-0.01em' }}>Smart PQC Assessor</h1>
          <span style={{ color: '#64748b', fontSize: '12px', marginLeft: '12px', fontWeight: 400 }}>Post-Quantum Cryptography Readiness Platform</span>
        </div>
      </div>

      <main className="content-area">
        {stage === 'upload' && (
          <UploadScreen onStartScan={handleStartScan} />
        )}
        {stage === 'scan' && (
          <ScanScreen file={uploadedFile} onComplete={handleScanComplete} />
        )}
        {stage === 'result' && (
          <ResultScreen result={analysisResult} file={uploadedFile} onRestart={handleRestart} />
        )}
      </main>
    </div>
  );
}

export default App;
