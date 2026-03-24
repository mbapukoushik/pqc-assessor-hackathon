import React from 'react';

const getScoreColor = (score) => {
  if (score > 80) return '#f87171'; // soft red
  if (score >= 50) return '#fb923c'; // soft orange
  return '#4ade80'; // soft green
};

const PriorityTable = ({ files, onRowClick, selectedFileId }) => {
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
          {files.map((row) => (
            <tr 
              key={row.id} 
              onClick={() => onRowClick(row)}
              className={selectedFileId === row.id ? 'selected-row' : ''}
            >
              <td>{row.file}</td>
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
