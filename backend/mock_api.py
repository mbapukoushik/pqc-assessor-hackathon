from datetime import datetime
from fastapi import FastAPI, UploadFile, File, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import FileResponse
from fpdf import FPDF
from scorer import calculate_risk_score
from report import generate_summary

app = FastAPI(title="PQC Assessor Mock API")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

EXTENSION_TO_TYPE = {
    ".py":   "python",
    ".js":   "javascript",
    ".ts":   "typescript",
    ".jsx":  "javascript",
    ".tsx":  "typescript",
    ".java": "java",
    ".cpp":  "cpp",
    ".c":    "c",
    ".cs":   "csharp",
    ".exe":  "binary",
    ".dll":  "binary",
    ".pdf":  "pdf",
    ".json": "database",
    ".db":   "database",
    ".sql":  "database",
    ".png":  "image",
    ".jpg":  "image",
    ".zip":  "archive",
}

VULN_MAP = {
    "python":     ("RSA-2048 Key Exchange", "RSA",          ["RSA", "KeyExchange", "PKCS1"]),
    "javascript": ("ECDH Weak Curve",       "tls_old",      ["ECDH", "P-256", "TLS1.2"]),
    "typescript": ("ECDH Weak Curve",       "tls_old",      ["ECDH", "P-256", "TLS1.2"]),
    "java":       ("Deprecated MD5/SHA1",   "weak",         ["SHA1", "MD5", "HMAC"]),
    "cpp":        ("No Encryption",         "no_encryption",["OpenSSL", "AES", "CBC"]),
    "c":          ("No Encryption",         "no_encryption",["OpenSSL", "memcpy"]),
    "csharp":     ("AES-128 Static IV",     "AES",          ["AES", "CBC", "StaticIV"]),
    "pdf":        ("Plaintext Document",    "none",         ["PDF", "Plaintext", "NoSign"]),
    "database":   ("Unencrypted DB",        "no_encryption",["SQLite", "NoTLS", "PlainText"]),
    "image":      ("Metadata Exposure",     "none",         ["EXIF", "GPS", "Metadata"]),
    "archive":    ("Unencrypted Archive",   "no_encryption",["ZIP", "Deflate", "NoPass"]),
    "binary":     ("Unsigned Executable",   "no_encryption",["EXE", "MalwareRisk", "Unsigned"]),
}

DEFAULT_VULN = ("Unknown Vulnerability", "none", ["Unknown"])

def get_file_category(filename: str):
    ext = "." + filename.rsplit(".", 1)[-1].lower() if "." in filename else ""
    return EXTENSION_TO_TYPE.get(ext, "sensitive_data")

def build_file_entry(file_id: int, filename: str):
    file_type = get_file_category(filename)
    vuln_label, encryption, keywords = VULN_MAP.get(file_type, DEFAULT_VULN)
    score = calculate_risk_score(file_type, encryption)
    summary = generate_summary(score)
    return {
        "id":            file_id,
        "file":          filename,
        "type":          file_type,
        "vulnerability": vuln_label,
        "encryption":    encryption,
        "score":         score,
        "status":        "Vulnerable" if score >= 50 else "Secured", # CHANGED
        "keywords":      keywords,
        "risk_level":    summary["status"],
        "action":        summary["action"],
    }

def pick_timeline_phase(score: int) -> dict:
    if score >= 80: # CHANGED
        return {
            "current":       "RSA / ECC (Current)",
            "current_risk":  "CRITICAL", # CHANGED
            "phase":         "Transition Phase",
            "phase_risk":    "HIGH", # CHANGED
            "target":        "PQC (Future)",
            "target_status": "Safe",
            "active":        "current",
        }
    elif 50 <= score <= 79: # CHANGED
        return {
            "current":       "RSA / ECC (Current)",
            "current_risk":  "HIGH", # CHANGED
            "phase":         "Assessment Phase",
            "phase_risk":    "LOW", # CHANGED
            "target":        "PQC (Future)",
            "target_status": "Safe",
            "active":        "phase",
        }
    else:
        return {
            "current":       "RSA / ECC (Current)",
            "current_risk":  "LOW", # CHANGED
            "phase":         "Monitoring Phase",
            "phase_risk":    "Minimal",
            "target":        "PQC (Future)",
            "target_status": "Safe",
            "active":        "target",
        }

@app.post("/api/analyze")
async def analyze(file: UploadFile = File(...)):
    filename = file.filename or "unknown_file"
    primary = build_file_entry(1, filename)
    related_samples = [("auth_config.py", 2), ("database.js", 3), ("legacy_api.java", 4)]
    related = [build_file_entry(fid, fname) for fname, fid in related_samples]
    all_files = [primary] + related
    overall_score = max(f["score"] for f in all_files)
    overall_summary = generate_summary(overall_score)
    return {
        "filename":  filename,
        "score":     overall_score,
        "summary":   overall_summary,
        "files":     all_files,
        "timeline":  pick_timeline_phase(overall_score),
    }

@app.post("/api/report")
async def generate_report(file: UploadFile = File(...)):
    try:
        filename = file.filename or "unknown_file"
        
        primary = build_file_entry(1, filename)
        related_samples = [("auth_config.py", 2), ("database.js", 3), ("legacy_api.java", 4)]
        related = [build_file_entry(fid, fname) for fname, fid in related_samples]
        all_files = [primary] + related
        
        pdf = FPDF()
        pdf.add_page()
        pdf.set_font("Helvetica", style="B", size=16)
        
        pdf.cell(0, 10, "PQC Priority Report", align="C", new_x="LMARGIN", new_y="NEXT")
        pdf.set_font("Helvetica", style="", size=10)
        pdf.cell(0, 10, f"Date generated: {datetime.now().strftime('%Y-%m-%d %H:%M:%S')}", align="C", new_x="LMARGIN", new_y="NEXT")
        pdf.ln(10)
        
        pdf.set_font("Helvetica", style="B", size=11)
        pdf.cell(50, 10, "File", border=1)
        pdf.cell(60, 10, "Vulnerability", border=1)
        pdf.cell(20, 10, "Score", border=1)
        pdf.cell(40, 10, "Risk Level", border=1, new_x="LMARGIN", new_y="NEXT")
        
        pdf.set_font("Helvetica", style="", size=10)
        for f in all_files:
            pdf.cell(50, 10, f["file"], border=1)
            pdf.cell(60, 10, f["vulnerability"], border=1)
            pdf.cell(20, 10, str(f["score"]), border=1)
            pdf.cell(40, 10, f["risk_level"], border=1, new_x="LMARGIN", new_y="NEXT")
            
        pdf.ln(10)
        
        pdf.set_font("Helvetica", style="B", size=14)
        pdf.cell(0, 10, "Recommendations", new_x="LMARGIN", new_y="NEXT")
        pdf.set_font("Helvetica", style="", size=11)
        
        seen_enc = set()
        for f in all_files:
            enc = f.get("encryption", "")
            if enc and enc not in seen_enc:
                seen_enc.add(enc)
                e_lower = enc.lower()
                
                if e_lower in ("rsa-1024", "rsa"):
                    replacement = "CRYSTALS-Kyber-768"
                elif e_lower in ("ecc", "tls_old"):
                    replacement = "CRYSTALS-Dilithium-3"
                elif e_lower in ("weak", "md5"):
                    replacement = "SHA-3"
                elif e_lower == "no_encryption":
                    replacement = "AES-256 + Kyber"
                else:
                    replacement = "Review & Map to NIST Standard"
                    
                pdf.cell(0, 10, f"- {f['file']} ({enc}) -> Upgrade to {replacement}", new_x="LMARGIN", new_y="NEXT")
                
        import uuid
        report_path = f"pqc_report_{uuid.uuid4().hex}.pdf"
        pdf.output(report_path)
        
        return FileResponse(path=report_path, filename="pqc_report.pdf", media_type="application/pdf")

    except Exception as e:
        raise HTTPException(status_code=500, detail=f"PDF generation failed: {str(e)}")

@app.get("/")
async def root():
    return {"message": "PQC Assessor Mock API is running."}
