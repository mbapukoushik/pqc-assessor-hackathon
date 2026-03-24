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
      <header className="app-header">
        <h1>Smart PQC Assessor</h1>
        <p>Post-Quantum Cryptography Readiness</p>
      </header>

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
