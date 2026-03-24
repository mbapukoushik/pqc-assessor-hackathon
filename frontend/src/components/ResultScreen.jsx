import { useState } from 'react';
import PriorityTable from './PriorityTable';
import FileDetailPanel from './FileDetailPanel';
import QuantumTimeline from './QuantumTimeline';

function ResultScreen({ result, file, onRestart }) {
  const [files, setFiles] = useState(result?.files || []);
  const [selectedFile, setSelectedFile] = useState(null);
  
  const [isGeneratingPdf, setIsGeneratingPdf] = useState(false);

  const score = result?.score ?? 50;
  const timeline = result?.timeline ?? null;

  // Deriving the 4 stats requested:
  const totalFiles = files.length;
  const highRiskCount = files.filter(f => f.score >= 70).length; // CHANGED
  const mediumRiskCount = files.filter(f => f.score >= 50 && f.score < 70).length; // CHANGED
  const lowRiskCount = files.filter(f => f.score < 50).length; // CHANGED

  const handleFixFile = (fileId) => {
    setFiles((prev) =>
      prev.map((f) => f.id === fileId ? { ...f, status: 'Secured' } : f)
    );
    setSelectedFile((prev) =>
      prev && prev.id === fileId ? { ...prev, status: 'Secured' } : prev
    );
  };

  const handleDownloadPdf = async () => {
    if (!file) return;
    
    setIsGeneratingPdf(true);
    try {
      const formData = new FormData();
      formData.append('file', file);
      
      const response = await fetch('http://localhost:8000/api/report', {
        method: 'POST',
        body: formData,
      });
      
      if (!response.ok) {
        throw new Error(`API error: ${response.status}`);
      }
      
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = 'pqc_priority_report.pdf';
      document.body.appendChild(link);
      link.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(link);
    } catch (error) {
      console.error('Error generating PDF:', error);
    } finally {
      setIsGeneratingPdf(false);
    }
  };

  return (
    <div className="dashboard-container">
      <div className="dashboard-header">
        <h1>PQC Assessment Report</h1>
      </div>

      <div className="dashboard-main">
        
        <div style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          background: 'var(--panel-bg)',
          border: '1px solid var(--border-color)',
          padding: '1rem 1.5rem',
          borderRadius: '12px',
          boxShadow: '0 4px 6px rgba(0,0,0,0.1)'
        }}>
          <div style={{ display: 'flex', gap: '2rem' }}>
            <div style={{ display: 'flex', flexDirection: 'column' }}>
              <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)', textTransform: 'uppercase' }}>Total Scanned</span>
              <span style={{ fontSize: '1.2rem', fontWeight: 700, color: '#ffffff' }}>{totalFiles}</span>
            </div>
            
            <div style={{ display: 'flex', flexDirection: 'column' }}>
              <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)', textTransform: 'uppercase' }}>🔴 Critical</span> {/* CHANGED */}
              <span style={{ fontSize: '1.2rem', fontWeight: 700, color: '#ef4444' }}>{highRiskCount}</span> {/* CHANGED */}
            </div>
            
            <div style={{ display: 'flex', flexDirection: 'column' }}>
              <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)', textTransform: 'uppercase' }}>🟡 High</span> {/* CHANGED */}
              <span style={{ fontSize: '1.2rem', fontWeight: 700, color: '#f59e0b' }}>{mediumRiskCount}</span> {/* CHANGED */}
            </div>
            
            <div style={{ display: 'flex', flexDirection: 'column' }}>
              <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)', textTransform: 'uppercase' }}>🟢 Low</span> {/* CHANGED */}
              <span style={{ fontSize: '1.2rem', fontWeight: 700, color: '#4ade80' }}>{lowRiskCount}</span> {/* CHANGED */}
            </div>
          </div>

          <button 
            onClick={handleDownloadPdf} 
            disabled={isGeneratingPdf || !file}
            style={{
              background: '#1e293b',
              color: '#f8fafc',
              border: '1px solid rgba(255, 255, 255, 0.1)',
              padding: '10px 18px',
              borderRadius: '8px',
              cursor: (isGeneratingPdf || !file) ? 'not-allowed' : 'pointer',
              fontWeight: 600,
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              transition: 'background 0.2s',
            }}
            onMouseOver={(e) => {
              if (!isGeneratingPdf && file) e.currentTarget.style.background = '#334155';
            }}
            onMouseOut={(e) => {
              e.currentTarget.style.background = '#1e293b';
            }}
          >
            {isGeneratingPdf ? '⏳ Generating...' : '⬇️ Export Report'}
          </button>
        </div>

        <div className="top-section">
          <PriorityTable
            files={files}
            onRowClick={setSelectedFile}
            selectedFileId={selectedFile?.id}
          />
          <FileDetailPanel
            file={selectedFile}
            onFixFile={handleFixFile}
          />
        </div>

        <QuantumTimeline timeline={timeline} />

        <div style={{ display: 'flex', gap: '1rem', marginTop: '0.5rem' }}>
          <button
            className="btn"
            style={{ background: 'transparent', border: '1px solid var(--border-color)' }}
            onClick={onRestart}
          >
            Scan Another File
          </button>
        </div>
      </div>
    </div>
  );
}

export default ResultScreen;
