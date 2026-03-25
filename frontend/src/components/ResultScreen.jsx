import { useState } from 'react';
import PriorityTable from './PriorityTable';
import FileDetailPanel from './FileDetailPanel';
import QuantumTimeline from './QuantumTimeline';

function ResultScreen({ result, file, onRestart }) {
  const [files, setFiles] = useState(result?.files || []);
  const [selectedFile, setSelectedFile] = useState(null);
  
  const [isGeneratingPdf, setIsGeneratingPdf] = useState(false);

  // V2: Quantum Optimizer States
  const [budget, setBudget] = useState(5);
  const [isOptimizing, setIsOptimizing] = useState(false);
  const [optimizedFiles, setOptimizedFiles] = useState(null);
  const [riskMitigated, setRiskMitigated] = useState(0);

  const timeline = result?.timeline ?? null;

  // Deriving the 4 stats requested:
  const totalFiles = files.length;
  const highRiskCount = files.filter(f => f.score >= 70).length;
  const mediumRiskCount = files.filter(f => f.score >= 50 && f.score < 70).length;
  const lowRiskCount = files.filter(f => f.score < 50).length;

  const handleFixFile = (fileId) => {
    setFiles((prev) =>
      prev.map((f) => f.id === fileId ? { ...f, status: 'Secured' } : f)
    );
    setSelectedFile((prev) =>
      prev && prev.id === fileId ? { ...prev, status: 'Secured' } : prev
    );
    
    // Update optimizedFiles if they are displayed
    if (optimizedFiles) {
      setOptimizedFiles((prev) => 
        prev.map((f) => f.id === fileId ? { ...f, status: 'Secured' } : f)
      );
    }
  };

  const handleRunOptimizer = () => {
    setIsOptimizing(true);
    // Simulate backend QAOA solving for the mathematically perfect set of targets
    setTimeout(() => {
      // Sort by highest security risk
      const sorted = [...files].sort((a, b) => b.score - a.score);
      const selected = sorted.slice(0, budget);
      
      const mitigated = selected.reduce((sum, f) => sum + f.score, 0);
      
      setOptimizedFiles(selected);
      setRiskMitigated(mitigated);
      setIsOptimizing(false);
    }, 1500);
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
    <div className="dashboard-container" style={{ margin: '0 auto' }}>
      <div className="dashboard-main" style={{ padding: '0', background: 'transparent', border: 'none' }}>
        
        {/* New Summary Bar with Stats + Export Report Button */}
        <div style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          background: '#0d1424',
          border: '1px solid #1e2d47',
          padding: '1.5rem',
          borderRadius: '8px',
          marginBottom: '1.5rem'
        }}>
          <div style={{ display: 'flex', gap: '3rem' }}>
            <div style={{ display: 'flex', flexDirection: 'column', borderTop: '2px solid #3b82f6', paddingTop: '8px', minWidth: '90px' }}>
              <span style={{ fontSize: '12px', color: '#64748b', textTransform: 'uppercase', fontWeight: 600, letterSpacing: '0.05em' }}>Total Scanned</span>
              <span style={{ fontSize: '32px', fontWeight: 700, color: '#e2e8f0', marginTop: '4px' }}>{totalFiles}</span>
            </div>
            
            <div style={{ display: 'flex', flexDirection: 'column', borderTop: '2px solid #ff3b3b', paddingTop: '8px', minWidth: '90px' }}>
              <span style={{ fontSize: '12px', color: '#64748b', textTransform: 'uppercase', fontWeight: 600, letterSpacing: '0.05em' }}>Critical</span>
              <span style={{ fontSize: '32px', fontWeight: 700, color: '#ff3b3b', marginTop: '4px' }}>{highRiskCount}</span>
            </div>
            
            <div style={{ display: 'flex', flexDirection: 'column', borderTop: '2px solid #f59e0b', paddingTop: '8px', minWidth: '90px' }}>
              <span style={{ fontSize: '12px', color: '#64748b', textTransform: 'uppercase', fontWeight: 600, letterSpacing: '0.05em' }}>High</span>
              <span style={{ fontSize: '32px', fontWeight: 700, color: '#f59e0b', marginTop: '4px' }}>{mediumRiskCount}</span>
            </div>
            
            <div style={{ display: 'flex', flexDirection: 'column', borderTop: '2px solid #10b981', paddingTop: '8px', minWidth: '90px' }}>
              <span style={{ fontSize: '12px', color: '#64748b', textTransform: 'uppercase', fontWeight: 600, letterSpacing: '0.05em' }}>Low</span>
              <span style={{ fontSize: '32px', fontWeight: 700, color: '#10b981', marginTop: '4px' }}>{lowRiskCount}</span>
            </div>
          </div>

          <button 
            className="export-btn"
            onClick={handleDownloadPdf} 
            disabled={isGeneratingPdf || !file}
          >
            {isGeneratingPdf ? '⏳ Generating...' : '⬇️ Export Report'}
          </button>
        </div>

        {/* V2: Quantum QAOA Optimizer Controls */}
        <div style={{
          background: '#1e2d47',
          padding: '1.5rem',
          borderRadius: '8px',
          marginBottom: '1.5rem',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          border: '1px solid #3b82f6',
          boxShadow: '0 4px 15px rgba(59, 130, 246, 0.15)'
        }}>
          <div>
            <h3 style={{ margin: '0 0 10px 0', color: '#f8fafc', fontWeight: 'bold' }}>V2: Quantum QAOA Optimizer</h3>
            <div style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
              <label style={{ color: '#cbd5e1', fontSize: '14px', fontWeight: 600 }}>IT Migration Budget (Max Files):</label>
              <input 
                type="range" 
                min="1" 
                max={files.length || 10} 
                value={budget} 
                onChange={(e) => setBudget(Number(e.target.value))} 
                style={{ cursor: 'pointer', accentColor: '#8b5cf6' }}
              />
              <span style={{ color: '#e2e8f0', fontWeight: 'bold', fontSize: '18px' }}>{budget}</span>
            </div>
          </div>
          
          <div style={{ display: 'flex', alignItems: 'center', gap: '20px' }}>
            {optimizedFiles && (
              <div style={{ textAlign: 'right' }}>
                <div style={{ fontSize: '12px', color: '#cbd5e1', textTransform: 'uppercase', fontWeight: 600 }}>Total Risk Mitigated</div>
                <div style={{ fontSize: '24px', fontWeight: 'bold', color: '#4ade80' }}>+{riskMitigated}</div>
              </div>
            )}
            <button 
              onClick={handleRunOptimizer}
              disabled={isOptimizing}
              style={{
                background: 'linear-gradient(135deg, #8b5cf6, #3b82f6)',
                color: '#fff',
                border: 'none',
                padding: '14px 28px',
                borderRadius: '8px',
                fontWeight: 'bold',
                fontSize: '15px',
                cursor: isOptimizing ? 'not-allowed' : 'pointer',
                opacity: isOptimizing ? 0.7 : 1,
                boxShadow: '0 4px 12px rgba(139, 92, 246, 0.4)',
                transition: 'all 0.2s ease-in-out'
              }}
            >
              {isOptimizing ? 'Running QAOA...' : 'Run Quantum Optimizer'}
            </button>
          </div>
        </div>

        {/* Priority Table + File Detail Panel */}
        <div className="top-section" style={{ display: 'flex', gap: '1.5rem', marginBottom: '1.5rem' }}>
          <div style={{ flex: 2 }}>
            <PriorityTable
              files={optimizedFiles ? optimizedFiles : files}
              onRowClick={setSelectedFile}
              selectedFileId={selectedFile?.id}
            />
          </div>
          <div style={{ flex: 1 }}>
            <FileDetailPanel
              file={selectedFile}
              onFixFile={handleFixFile}
            />
          </div>
        </div>

        {/* Quantum Timeline */}
        <div style={{ background: '#0d1424', border: '1px solid #1e2d47', borderRadius: '8px', padding: '1.5rem', marginBottom: '1.5rem' }}>
          <QuantumTimeline timeline={timeline} />
        </div>

        {/* Actions */}
        <div style={{ display: 'flex', gap: '1rem', marginTop: '1.5rem' }}>
          <button
            className="btn"
            style={{ background: 'transparent', border: '1px solid #1e2d47', color: '#e2e8f0', width: 'auto' }}
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
