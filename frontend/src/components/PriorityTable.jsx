import React from 'react';

const getScoreStyles = (score) => {
  if (score >= 70) return { bg: 'rgba(255,59,59,0.15)', color: '#ff3b3b', border: '1px solid rgba(255,59,59,0.3)' }; // Critical red
  if (score >= 50) return { bg: 'rgba(245,158,11,0.15)', color: '#f59e0b', border: '1px solid rgba(245,158,11,0.3)' }; // High amber
  return { bg: 'rgba(16,185,129,0.15)', color: '#10b981', border: '1px solid rgba(16,185,129,0.3)' }; // Low green
};

const PriorityTable = ({ files, onRowClick, selectedFileId }) => {
  // Sort descending by score
  const sortedFiles = [...files].sort((a, b) => b.score - a.score);

  return (
    <div className="priority-table-container">
      <h2 style={{ fontSize: '14px', color: '#e2e8f0', marginBottom: '1rem', padding: '0', background: 'transparent', border: 'none' }}>Priority Risk Table</h2>
      <table className="priority-table">
        <thead>
          <tr>
            <th>File Name</th>
            <th>Vulnerability Type</th>
            <th>Status</th>
            <th>Priority Score</th>
          </tr>
        </thead>
        <tbody>
          {sortedFiles.map((row) => {
            const scoreStyles = getScoreStyles(row.score);
            return (
              <tr 
                key={row.id} 
                onClick={() => onRowClick(row)}
                className={selectedFileId === row.id ? 'selected-row' : ''}
              >
                <td style={{ fontFamily: "'JetBrains Mono', 'Courier New', monospace" }}>{row.file}</td>
                <td style={{ color: '#64748b' }}>{row.vulnerability}</td>
                <td style={{ color: row.status === 'Secured' ? '#10b981' : '#e2e8f0' }}>
                  {row.status}
                </td>
                <td>
                  <span 
                    style={{
                      backgroundColor: scoreStyles.bg,
                      color: scoreStyles.color,
                      border: scoreStyles.border,
                      display: 'inline-block',
                      borderRadius: '4px',
                      padding: '4px 8px',
                      fontWeight: 700,
                      fontSize: '12px'
                    }}
                  >
                    {row.score}
                  </span>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
};

export default PriorityTable;
