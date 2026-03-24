from fastapi import FastAPI
from pydantic import BaseModel
from typing import List
from datetime import datetime

from scorer import calculate_risk_score, get_risk_reasons
from report import generate_summary

app = FastAPI()

# Single file structure
class FileData(BaseModel):
    filename: str
    file_type: str
    encryption: str

# Multiple files structure
class FileList(BaseModel):
    files: List[FileData]

# Home route
@app.get("/")
def home():
    return {"message": "Smart PQC Assessor API is running"}

# Upload multiple files
@app.post("/upload")
def upload_files(data: FileList):

    results = []

    for file in data.files:

        # Calculate score
        score = calculate_risk_score(
            file.file_type,
            file.encryption,
            file.filename
        )

        # Generate summary
        report = generate_summary(score)

        # Get risk reasons
        risks = get_risk_reasons(
            file.file_type,
            file.encryption,
            file.filename
        )

        # Store result
        results.append({
            "filename": file.filename,
            "score": score,
            "report": report,
            "top_risks": risks
        })

    # Sort results by highest risk score
    results = sorted(results, key=lambda x: x["score"], reverse=True)

    return {
        "scanned_at": datetime.now().strftime("%Y-%m-%d %H:%M:%S"),
        "total_files": len(results),
        "results": results
    }