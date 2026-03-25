from fastapi import FastAPI
from pydantic import BaseModel
from typing import List
from datetime import datetime
from scorer import analyze_code
from report import generate_summary

app = FastAPI()

# Standard JSON input per Ram / V2 specs
class UploadRequest(BaseModel):
    file_content: str
    budget: int
    filename: str = "unknown.py"  # Added strictly for fallback logging and extension checks

@app.get("/")
def home():
    return {"message": "Smart PQC Assessor API V2 is running"}

@app.post("/upload")
def upload_file(request: UploadRequest):
    """
    Accepts file content and budget, runs the real code scanner with AST,
    and returns an actionable summary with a budget recommendation.
    """
    try:
        # 1. Start by scanning the code
        scan_result = analyze_code(request.file_content, request.filename)
        
        # 2. Pass the results to the report generator
        summary = generate_summary(
            score=scan_result["score"],
            issues=scan_result["issues"],
            quantum_vulnerable=scan_result["quantum_vulnerable"]
        )
        
        # 3. Add budget-based recommendations
        recommendation = ""
        
        if request.budget < 1000:
            recommendation = "Low budget: Start with cheaper fixes like removing hardcoded secrets (using environment variables)."
        else:
            recommendation = "High budget: Recommend full migration. Replace RSA with PQC (Post-Quantum Cryptography) algorithms immediately."
            
        summary["recommendation"] = recommendation
        summary["scanned_at"] = datetime.now().strftime("%Y-%m-%d %H:%M:%S")
        
        return summary
        
    except Exception as e:
        # Safety requirement: No crashes allowed
        return {
            "status": "ERROR",
            "action": "Failed to process request safely.",
            "issues": [f"Unexpected error: {str(e)}"],
            "quantum_vulnerable": False,
            "recommendation": "Check API and input format."
        }