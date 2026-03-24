import React from 'react';

const PHASES = [
  { key: 'current',  label: (t) => t?.current  || 'RSA / ECC (Current)',  risk: (t) => t?.current_risk  || 'High Risk',   className: 'high-risk'   },
  { key: 'phase',    label: (t) => t?.phase    || 'Transition Phase',      risk: (t) => t?.phase_risk    || 'Medium Risk', className: 'medium-risk' },
  { key: 'target',   label: (t) => t?.target   || 'PQC (Future)',          risk: (t) => t?.target_status || 'Safe',        className: 'low-risk'    },
];

const DESCRIPTIONS = {
  current: "Vulnerable to Shor's algorithm. Will be breakable soon with CRQC.",
  phase:   "Migrating infrastructure. Temporary hybrid implementations.",
  target:  "Quantum-resistant algorithms (e.g., Kyber, Dilithium) deployed.",
};

const QuantumTimeline = ({ timeline }) => {
  const activeKey = timeline?.active || null;

  return (
    <div className="quantum-timeline">
      <h2>Quantum Risk Timeline</h2>
      <div className="timeline-container">
        {PHASES.map((phase, i) => {
          const isActive = activeKey === phase.key;
          return (
            <React.Fragment key={phase.key}>
              <div
                className={`timeline-item ${phase.className}`}
                style={isActive ? { opacity: 1 } : { opacity: 0.7 }}
              >
                <div
                  className="marker"
                  style={isActive ? { transform: 'scale(1.3)', boxShadow: '0 0 20px currentColor' } : {}}
                />
                <div className="content">
                  <h4>
                    {phase.label(timeline)}
                    {isActive && (
                      <span style={{
                        marginLeft: '8px',
                        fontSize: '0.7rem',
                        background: 'rgba(255,255,255,0.12)',
                        padding: '2px 8px',
                        borderRadius: '999px',
                        verticalAlign: 'middle',
                        fontWeight: 600,
                      }}>
                        YOU ARE HERE
                      </span>
                    )}
                  </h4>
                  <p className="risk-label">{phase.risk(timeline)}</p>
                  <p className="desc">{DESCRIPTIONS[phase.key]}</p>
                </div>
              </div>
              {i < PHASES.length - 1 && <div className="timeline-line" />}
            </React.Fragment>
          );
        })}
      </div>
    </div>
  );
};

export default QuantumTimeline;
