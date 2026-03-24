import { useState, useEffect } from 'react';

const MESSAGES = [
  "Initializing scanner...",
  "Analyzing Encryption Protocols...",
  "Scanning Cryptographic Primitives...",
  "Calculating Priority Scores...",
  "Mapping Quantum Vulnerabilities...",
  "Preparing Final Results..."
];

function ScanScreen({ onComplete }) {
  const [progress, setProgress] = useState(0);
  const [messageIndex, setMessageIndex] = useState(0);

  useEffect(() => {
    const totalDuration = 5000; // 5 seconds scan duration
    const intervalTime = 50; 
    const steps = totalDuration / intervalTime;
    let currentStep = 0;

    const timer = setInterval(() => {
      currentStep++;
      const currentProgress = Math.min(Math.round((currentStep / steps) * 100), 100);
      setProgress(currentProgress);

      // Update message based on progress percentage
      const newMsgIndex = Math.min(
        Math.floor((currentProgress / 100) * MESSAGES.length),
        MESSAGES.length - 1
      );
      setMessageIndex(newMsgIndex);

      if (currentProgress >= 100) {
        clearInterval(timer);
        setTimeout(() => {
          onComplete();
        }, 800); // Wait a bit at 100% before transitioning
      }
    }, intervalTime);

    return () => clearInterval(timer);
  }, [onComplete]);

  return (
    <div className="card">
      <div className="loader-container">
        <div 
          className="circular-progress" 
          style={{ '--progress': `${progress * 3.6}deg` }}
        >
          <span className="progress-value">{progress}%</span>
        </div>
      </div>
      <div className="scan-message">
        {MESSAGES[messageIndex]}
      </div>
    </div>
  );
}

export default ScanScreen;
