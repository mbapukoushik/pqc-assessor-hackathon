import { useState, useRef } from 'react';

function UploadScreen({ onStartScan }) {
  const [file, setFile] = useState(null);
  const [isDragging, setIsDragging] = useState(false);
  const fileInputRef = useRef(null);

  const handleDragOver = (e) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (e) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setIsDragging(false);
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      setFile(e.dataTransfer.files[0]);
    }
  };

  const handleFileChange = (e) => {
    if (e.target.files && e.target.files.length > 0) {
      setFile(e.target.files[0]);
    }
  };

  const handleStartScan = () => {
    if (file) onStartScan(file);
  };

  const handleLoadSample = () => {
    const sampleFile = new File(["sample"], "patient_records_2024.py", { type: "text/plain" });
    onStartScan(sampleFile);
  };

  return (
    <div className="card" style={{ maxWidth: '480px', border: '1px solid #1e2d47' }}>
      <div
        className={`drop-zone ${isDragging ? 'active' : ''}`}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        onClick={() => fileInputRef.current.click()}
        style={{
          border: '2px dashed #1e2d47',
          background: isDragging ? 'rgba(59,130,246,0.05)' : '#0d1424',
          borderColor: isDragging ? '#3b82f6' : '#1e2d47',
          borderRadius: '8px',
          padding: '3rem 2rem',
          textAlign: 'center',
          cursor: 'pointer',
          transition: 'all 0.2s',
          marginBottom: '2rem'
        }}
      >
        <div style={{ marginBottom: '1rem' }}>
          <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="#3b82f6" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
            <path d="M22 19a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h5l2 3h9a2 2 0 0 1 2 2z"/>
          </svg>
        </div>
        <h3 style={{ color: '#e2e8f0', fontWeight: 600, fontSize: '16px', margin: 0 }}>Drag &amp; drop your codebase here</h3>
        <p style={{ color: '#64748b', fontSize: '12px', marginTop: '0.5rem', margin: '0.5rem 0 0 0' }}>
          Supports .py .js .java .db .pdf and more
        </p>

        <input
          type="file"
          ref={fileInputRef}
          onChange={handleFileChange}
          accept=".zip,.tar,.gz,.rar,.js,.jsx,.ts,.tsx,.py,.java,.cpp,.c,.cs"
          style={{ display: 'none' }}
        />

        {file && (
          <div style={{ marginTop: '1.5rem', color: '#10b981', fontSize: '13px', fontWeight: 600 }}>
            Selected: {file.name}
          </div>
        )}
      </div>

      <button
        className="btn"
        onClick={handleStartScan}
        disabled={!file}
        style={{ marginBottom: '1rem' }}
      >
        Start Scan
      </button>

      <button
        className="btn"
        onClick={handleLoadSample}
        style={{
          background: 'transparent',
          border: '1px solid #1e2d47',
          color: '#64748b',
          fontSize: '13px'
        }}
        onMouseOver={(e) => { e.target.style.background = '#111827'; e.target.style.color = '#e2e8f0'; }}
        onMouseOut={(e) => { e.target.style.background = 'transparent'; e.target.style.color = '#64748b'; }}
      >
        ⚡ Load Sample Dataset
      </button>
    </div>
  );
}

export default UploadScreen;
