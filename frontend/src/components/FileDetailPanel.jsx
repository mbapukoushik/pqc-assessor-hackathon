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

  return (
    <div className={`file-detail-panel ${isSecured ? 'secured-panel' : ''}`}>
      <div className="panel-header">
        <h3>File Analysis Details</h3>
        {isSecured && <span className="secured-badge">✓ Secured</span>}
      </div>

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
    </div>
  );
};

export default FileDetailPanel;
