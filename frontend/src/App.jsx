import React, { useState } from 'react';
import PriorityTable from './components/PriorityTable';
import FileDetailPanel from './components/FileDetailPanel';
import QuantumTimeline from './components/QuantumTimeline';
import './App.css';

const initialMockData = [
  {
    id: 1,
    file: "customer_db.sql",
    vulnerability: "RSA",
    score: 92,
    type: "Database",
    keywords: ["customer", "password"],
    status: "Vulnerable"
  },
  {
    id: 2,
    file: "report.pdf",
    vulnerability: "TLS 1.0",
    score: 35,
    type: "PDF",
    keywords: ["public"],
    status: "Vulnerable"
  }
];

function App() {
  const [files, setFiles] = useState(initialMockData);
  const [selectedFileId, setSelectedFileId] = useState(null);

  const selectedFile = files.find(f => f.id === selectedFileId);

  const handleRowClick = (file) => {
    setSelectedFileId(file.id);
  };

  const handleFixFile = (id) => {
    setFiles(prev => prev.map(f => f.id === id ? { ...f, status: "Secured" } : f));
  };

  return (
    <div className="dashboard-container">
      <header className="dashboard-header">
        <h1>Smart PQC Assessor Dashboard</h1>
      </header>
      
      <main className="dashboard-main">
        <div className="top-section">
          <div className="table-wrapper">
            <PriorityTable 
              files={files}
              onRowClick={handleRowClick} 
              selectedFileId={selectedFileId} 
            />
          </div>
          <div className="panel-wrapper">
            <FileDetailPanel 
              file={selectedFile} 
              onFixFile={handleFixFile} 
            />
          </div>
        </div>

        <section className="bottom-section">
          <QuantumTimeline />
        </section>
      </main>
    </div>
  );
}

export default App;
