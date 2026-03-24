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
    <div className="card">
      <div
        className={`drop-zone ${isDragging ? 'active' : ''}`}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        onClick={() => fileInputRef.current.click()}
      >
        <div className="drop-icon">📁</div>
        <h3>Drag &amp; Drop your codebase here</h3>
        <p className="app-header" style={{ margin: '1rem 0 0 0', fontSize: '0.9rem' }}>
          or click to browse files
        </p>

        <input
          type="file"
          className="file-input"
          ref={fileInputRef}
          onChange={handleFileChange}
          accept=".zip,.tar,.gz,.rar,.js,.jsx,.ts,.tsx,.py,.java,.cpp,.c,.cs"
        />

        {file && (
          <div className="file-name">
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
          border: '1px solid var(--primary)',
          color: 'var(--text-main)',
        }}
      >
        ⚡ Load Sample Dataset
      </button>
    </div>
  );
}

export default UploadScreen;
