import React from 'react';

const getScoreColor = (score) => {
  if (score >= 70) return '#ef4444'; // CHANGED: critical red
  if (score >= 50) return '#f59e0b'; // CHANGED: high amber
  return '#4ade80'; // CHANGED: low green
};

const PriorityTable = ({ files, onRowClick, selectedFileId }) => {
  // Sort descending by score
  const sortedFiles = [...files].sort((a, b) => b.score - a.score);

  return (
    <div className="priority-table-container">
      <h2>Priority Risk Table</h2>
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
          {sortedFiles.map((row) => (
            <tr 
              key={row.id} 
              onClick={() => onRowClick(row)}
              className={selectedFileId === row.id ? 'selected-row' : ''}
              style={{
                borderLeft: row.score >= 70 ? '3px solid #ef4444' : 'none' // CHANGED
              }}
            >
              <td style={{ borderLeft: row.score >= 70 ? '3px solid #ef4444' : '1px solid transparent' }}> {/* CHANGED */}
                {row.file}
              </td>
              <td>{row.vulnerability}</td>
              <td className={row.status === 'Secured' ? 'status-secured' : 'status-vulnerable'}>
                {row.status}
              </td>
              <td>
                <span 
                  className="score-badge"
                  style={{ backgroundColor: getScoreColor(row.score) }}
                >
                  {row.score}
                </span>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default PriorityTable;
