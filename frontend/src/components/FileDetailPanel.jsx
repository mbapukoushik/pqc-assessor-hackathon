import React, { useState, useEffect } from 'react';

const FileDetailPanel = ({ file, onFixFile }) => {
  const [loading, setLoading] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);

  useEffect(() => {
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
      <div className="file-detail-panel empty" style={{ borderLeft: '3px solid #1e2d47', color: '#64748b', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <p style={{ margin: 0, fontSize: '13px' }}>Select a file from the table to view details.</p>
      </div>
    );
  }

  const isSecured = file.status === "Secured";
  const showSndlWarning = file.score >= 65 && !isSecured;

  return (
    <div className="file-detail-panel" style={{ borderLeft: '3px solid #3b82f6', background: '#0d1424', borderRadius: '0 8px 8px 0' }}>
      <div className="panel-header" style={{ marginBottom: '1.5rem', display: 'flex', justifyContext: 'space-between', alignItems: 'center' }}>
        <h3 style={{ fontSize: '14px', color: '#e2e8f0', margin: 0, fontWeight: 600 }}>File Analysis Details</h3>
        {isSecured && <span style={{ fontSize: '12px', color: '#10b981', fontWeight: 600 }}>✓ Secured</span>}
      </div>

      {showSndlWarning && (
        <div style={{
          backgroundColor: 'rgba(255,59,59,0.08)',
          borderLeft: '4px solid #ff3b3b',
          padding: '1rem',
          marginBottom: '1.5rem',
          borderRadius: '4px'
        }}>
          <h4 style={{ 
            color: '#ff3b3b', 
            marginTop: 0, 
            marginBottom: '0.5rem', 
            display: 'flex', 
            alignItems: 'center',
            fontSize: '13px',
            fontWeight: 600
          }}>
            <span style={{
              display: 'inline-block',
              width: '8px',
              height: '8px',
              backgroundColor: '#ff3b3b',
              borderRadius: '50%',
              marginRight: '8px',
              boxShadow: '0 0 8px rgba(255,59,59,0.5)',
              animation: 'pulse 1.5s infinite'
            }}></span>
            ⚠️ SNDL Risk Detected
          </h4>
          <p style={{ color: '#94a3b8', fontSize: '13px', lineHeight: '1.6', margin: 0, fontWeight: 400 }}>
            This file's encryption may already be targeted by adversaries using "Store Now, Decrypt Later" tactics. 
            Data encrypted today with RSA or ECC can be harvested now and decrypted once quantum computers are available (est. 2031). 
            Immediate migration is recommended.
          </p>
        </div>
      )}

      {[
        { label: 'File Name', value: file.file },
        { label: 'Type', value: file.type },
        { label: 'Vulnerability', value: file.vulnerability },
        { label: 'Priority Score', value: <span style={{ fontWeight: 700, color: '#e2e8f0' }}>{file.score}</span> },
      ].map(item => (
        <div key={item.label} style={{ marginBottom: '12px' }}>
          <div style={{ color: '#64748b', textTransform: 'uppercase', fontSize: '11px', fontWeight: 600, marginBottom: '2px', letterSpacing: '0.05em' }}>
            {item.label}
          </div>
          <div style={{ color: '#e2e8f0', fontSize: '14px', fontWeight: 400 }}>
            {item.value}
          </div>
        </div>
      ))}
      
      <div style={{ marginBottom: '16px' }}>
        <div style={{ color: '#64748b', textTransform: 'uppercase', fontSize: '11px', fontWeight: 600, marginBottom: '4px', letterSpacing: '0.05em' }}>
          Keywords
        </div>
        <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap' }}>
          {file.keywords.map((kw) => (
            <span key={kw} style={{ background: '#1e2d47', color: '#e2e8f0', padding: '4px 8px', borderRadius: '4px', fontSize: '11px', fontWeight: 600 }}>
              {kw}
            </span>
          ))}
        </div>
      </div>

      <div className="remediation-section" style={{ marginTop: '2rem' }}>
        {!isSecured ? (
          <button 
            className="btn" 
            onClick={handleFix}
            disabled={loading}
          >
            {loading ? "Applying PQC Patch..." : "Fix Now"}
          </button>
        ) : (
          <div style={{ color: '#10b981', fontSize: '14px', fontWeight: 600, padding: '1rem', background: 'rgba(16,185,129,0.1)', borderRadius: '6px', textAlign: 'center' }}>
            System Secured with Hybrid PQC
          </div>
        )}
      </div>

      <style dangerouslySetInnerHTML={{__html: `
        @keyframes pulse {
          0% { transform: scale(0.95); opacity: 0.8; }
          50% { transform: scale(1.2); opacity: 1; box-shadow: 0 0 12px rgba(255,59,59,0.5); }
          100% { transform: scale(0.95); opacity: 0.8; }
        }
      `}} />
    </div>
  );
};

export default FileDetailPanel;
