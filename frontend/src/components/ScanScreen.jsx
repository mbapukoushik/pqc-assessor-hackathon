import React, { useState, useEffect, useRef } from 'react';

const MESSAGES = [
  "Initializing quantum threat model...",
  "Scanning cryptographic primitives...",
  "Cross-referencing NIST vulnerability database...",
  "Calculating quantum break timeline...",
  "Generating priority migration report..."
];

const API_URL = 'http://localhost:8000/api/analyze';

function ScanScreen({ file, onComplete }) {
  const [progress, setProgress] = useState(0);
  const [messageIndex, setMessageIndex] = useState(0);
  const [apiError, setApiError] = useState(null);
  const [isFinalizing, setIsFinalizing] = useState(false);
  
  // Use a ref to store the API result so the timer closure can read the latest value
  const apiResultRef = useRef(null);

  useEffect(() => {
    const totalDuration = 5000; // 5 seconds scan animation
    const intervalTime = 50;
    const steps = totalDuration / intervalTime;
    let currentStep = 0;

    // Fire the API call immediately in the background
    const fetchResult = async () => {
      try {
        const formData = new FormData();
        formData.append('file', file);
        const res = await fetch(API_URL, { method: 'POST', body: formData });
        if (!res.ok) throw new Error(`API error: ${res.status}`);
        apiResultRef.current = await res.json();
      } catch (err) {
        setApiError(err.message);
      }
    };

    fetchResult();

    // Fallback timer: if 10 seconds pass without a result, generate mock data locally
    const fallbackTimer = setTimeout(() => {
      if (!apiResultRef.current) {
        apiResultRef.current = {
          "filename": "demo_file.py",
          "score": 85,
          "summary": {"status": "CRITICAL", "action": "Fix immediately"},
          "files": [
            {"id":1,"file":"demo_file.py","type":"python","vulnerability":"RSA-2048 Key Exchange","score":85,"status":"Vulnerable","keywords":["RSA","KeyExchange"],"risk_level":"CRITICAL","action":"Fix immediately"},
            {"id":2,"file":"auth_config.py","type":"python","vulnerability":"RSA-2048 Key Exchange","score":75,"status":"Vulnerable","keywords":["RSA","PKCS1"],"risk_level":"CRITICAL","action":"Fix immediately"},
            {"id":3,"file":"database.js","type":"javascript","vulnerability":"ECDH Weak Curve","score":60,"status":"Vulnerable","keywords":["ECDH","TLS1.2"],"risk_level":"HIGH","action":"Review soon"},
            {"id":4,"file":"legacy_api.java","type":"java","vulnerability":"Deprecated MD5/SHA1","score":88,"status":"Vulnerable","keywords":["SHA1","MD5"],"risk_level":"CRITICAL","action":"Fix immediately"}
          ],
          "timeline": {"current":"RSA / ECC (Current)","current_risk":"CRITICAL","phase":"Transition Phase","phase_risk":"HIGH","target":"PQC (Future)","target_status":"Safe","active":"current"}
        };
      }
    }, 10000);

    const checkResultAndComplete = () => {
      if (apiResultRef.current) {
        onComplete(apiResultRef.current);
      } else {
        setIsFinalizing(true);
        setTimeout(checkResultAndComplete, 200); // Check again every 200ms
      }
    };

    const timer = setInterval(() => {
      currentStep++;
      const currentProgress = Math.min(Math.round((currentStep / steps) * 100), 100);
      setProgress(currentProgress);

      const newMsgIndex = Math.min(
        Math.floor((currentProgress / 100) * MESSAGES.length),
        MESSAGES.length - 1
      );
      setMessageIndex(newMsgIndex);

      if (currentProgress >= 100) {
        clearInterval(timer);
        setTimeout(checkResultAndComplete, 800);
      }
    }, intervalTime);

    // Cleanup timers
    return () => {
      clearInterval(timer);
      clearTimeout(fallbackTimer);
    };
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

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
        {isFinalizing ? "Finalizing results..." : MESSAGES[messageIndex]}
      </div>
      {apiError && !isFinalizing && (
        <p style={{ color: '#fb923c', fontSize: '0.8rem', marginTop: '0.5rem' }}>
          ⚠ API unreachable – waiting or using demo data
        </p>
      )}
    </div>
  );
}

export default ScanScreen;
