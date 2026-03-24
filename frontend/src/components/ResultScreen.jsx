function ResultScreen({ onRestart }) {
  return (
    <div className="card">
      <div className="success-icon">✨</div>
      <h2 className="result-title">Scan Complete!</h2>
      <p className="result-desc">
        Your codebase has been successfully analyzed. We've mapped out all cryptographic primitives and generated an actionable Post-Quantum Cryptography transition plan.
      </p>
      
      <div style={{ display: 'flex', gap: '1rem', width: '100%', marginTop: '1rem' }}>
        <button 
          className="btn" 
          style={{ background: 'transparent', border: '1px solid var(--border-color)' }}
          onClick={onRestart}
        >
          Scan Another
        </button>
        <button 
          className="btn" 
          onClick={() => alert("This would open the results dashboard!")}
          style={{ background: 'var(--accent)' }}
        >
          View Dashboard
        </button>
      </div>
    </div>
  );
}

export default ResultScreen;
