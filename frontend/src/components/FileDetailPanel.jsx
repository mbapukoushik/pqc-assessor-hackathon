import React, { useState, useEffect } from 'react';

const FileDetailPanel = ({ file, onFixFile }) => {
  const [loading, setLoading] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);

  useEffect(() => {
    // Reset internal states when selected file changes
    setLoading(false);
    setShowSuccess(false);
  }, [file?.id]);

  const handleFix = () => {
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      setShowSuccess(true);
      onFixFile(file.id);
    }, 2000);
  };

  if (!file) {
    return (
      <div className="file-detail-panel empty">
        <p>Select a file from the table to view details.</p>
      </div>
    );
  }

  const isSecured = file.status === "Secured";
  const showSndlWarning = file.score >= 65 && !isSecured; // CHANGED

  return (
    <div className={`file-detail-panel ${isSecured ? 'secured-panel' : ''}`}>
      <div className="panel-header">
        <h3>File Analysis Details</h3>
        {isSecured && <span className="secured-badge">✓ Secured</span>}
      </div>

      {showSndlWarning && (
        <div style={{
          backgroundColor: '#450a0a',
          borderLeft: '4px solid #ef4444',
          padding: '1rem',
          marginBottom: '1.5rem',
          borderRadius: '4px'
        }}>
          <h4 style={{ 
            color: '#fbbf24', 
            marginTop: 0, 
            marginBottom: '0.5rem', 
            display: 'flex', 
            alignItems: 'center',
            fontSize: '1rem'
          }}>
            <span style={{
              display: 'inline-block',
              width: '8px',
              height: '8px',
              backgroundColor: '#ef4444',
              borderRadius: '50%',
              marginRight: '8px',
              boxShadow: '0 0 8px #ef4444',
              animation: 'pulse 1.5s infinite'
            }}></span>
            ⚠️ SNDL Risk Detected
          </h4>
          <p style={{ color: '#ffffff', fontSize: '0.85rem', lineHeight: '1.5', margin: 0 }}>
            This file's encryption may already be targeted by adversaries using "Store Now, Decrypt Later" tactics. 
            Data encrypted today with RSA or ECC can be harvested now and decrypted once quantum computers are available (est. 2031). 
            Immediate migration is recommended.
          </p>
        </div>
      )}

      <div className="detail-item">
        <strong>File Name:</strong> <span>{file.file}</span>
      </div>
      <div className="detail-item">
        <strong>Type:</strong> <span>{file.type}</span>
      </div>
      <div className="detail-item">
        <strong>Vulnerability:</strong> <span>{file.vulnerability}</span>
      </div>
      <div className="detail-item">
        <strong>Priority Score:</strong> 
        <span className="static-score">{file.score}</span>
      </div>
      <div className="detail-item keywords">
        <strong>Keywords:</strong>
        <div className="keyword-tags">
          {file.keywords.map((kw) => (
            <span key={kw} className="keyword-tag">{kw}</span>
          ))}
        </div>
      </div>

      <div className="remediation-section">
        {!isSecured ? (
          <button 
            className="btn-fix" 
            onClick={handleFix}
            disabled={loading}
          >
            {loading ? "Applying PQC Patch..." : "Fix Now"}
          </button>
        ) : (
          <div className="success-message">
            System Secured with Hybrid PQC
          </div>
        )}
      </div>

      <style dangerouslySetInnerHTML={{__html: `
        @keyframes pulse {
          0% { transform: scale(0.95); opacity: 0.8; }
          50% { transform: scale(1.2); opacity: 1; box-shadow: 0 0 12px #ef4444; }
          100% { transform: scale(0.95); opacity: 0.8; }
        }
      `}} />
    </div>
  );
};

export default FileDetailPanel;
