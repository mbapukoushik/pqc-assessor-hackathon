import React from 'react';

const QuantumTimeline = () => {
  return (
    <div className="quantum-timeline">
      <h2>Quantum Risk Timeline</h2>
      <div className="timeline-container">
        
        <div className="timeline-item high-risk">
          <div className="marker"></div>
          <div className="content">
            <h4>RSA / ECC (Current)</h4>
            <p className="risk-label">High Risk</p>
            <p className="desc">Vulnerable to Shor's algorithm. Will be breakable soon with CRQC.</p>
          </div>
        </div>

        <div className="timeline-line"></div>

        <div className="timeline-item medium-risk">
          <div className="marker"></div>
          <div className="content">
            <h4>Transition Phase</h4>
            <p className="risk-label">Medium Risk</p>
            <p className="desc">Migrating infrastructure. Temporary hybrid implementations.</p>
          </div>
        </div>

        <div className="timeline-line"></div>

        <div className="timeline-item low-risk">
          <div className="marker"></div>
          <div className="content">
            <h4>PQC (Future)</h4>
            <p className="risk-label">Safe</p>
            <p className="desc">Quantum-resistant algorithms (e.g., Kyber, Dilithium) deployed.</p>
          </div>
        </div>

      </div>
    </div>
  );
};

export default QuantumTimeline;
