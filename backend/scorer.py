"""
scorer.py — V2 Upgraded Risk Scorer

V1: file-extension based scoring (kept as fallback)
V2: Real AST + Regex content scanner that detects weak crypto usage
    and hardcoded secrets in uploaded source files.
"""

import ast
import re


# ─── V2: AST + Regex Content Scanner ─────────────────────────────────────────

# Patterns that indicate weak / quantum-vulnerable cryptography
_WEAK_IMPORT_PATTERNS = [
    r'\bimport\s+rsa\b',
    r'\bfrom\s+rsa\b',
    r'\bimport\s+Crypto\b',
    r'\bfrom\s+Crypto\.Cipher\s+import\s+AES\b',
    r'\bAES\.new\b',
    r'\bMD5\b',
    r'\bSHA1\b',
    r'\bDES\b',
    r'\bRC4\b',
    r'\bECDH\b',
    r'\bRSA\.generate\b',
    r'\bRSA\.import_key\b',
    r'\bpkcs1\b',
]

# Patterns that indicate hardcoded secrets
_SECRET_PATTERNS = [
    r'(?i)(password|passwd|pwd)\s*=\s*["\'][^"\']{4,}["\']',
    r'(?i)(api_key|apikey|api_secret)\s*=\s*["\'][^"\']{4,}["\']',
    r'(?i)(secret_key|secret)\s*=\s*["\'][^"\']{4,}["\']',
    r'(?i)(private_key|priv_key)\s*=\s*["\'][^"\']{4,}["\']',
    r'(?i)(token|access_token)\s*=\s*["\'][^"\']{8,}["\']',
]

# AST node names that indicate known-weak algorithms
_WEAK_AST_NAMES = {
    'RSA', 'AES', 'DES', 'MD5', 'SHA1', 'SHA', 'RC4', 'ECDH',
    'rsa', 'des', 'md5', 'sha1', 'rc4', 'ecdh'
}


def scan_file_content(content: str, filename: str = "") -> dict:
    """
    Real AST + Regex scanner for uploaded source code.

    Returns:
        {
            "weak_imports":   list of matched weak crypto patterns
            "hardcoded_creds": list of matched secret patterns
            "ast_findings":   list of weak algorithm names found via AST
            "risk_boost":     int, extra risk points to add to base score
        }
    Always safe — any parser error returns empty findings with zero boost.
    """
    findings = {
        "weak_imports":    [],
        "hardcoded_creds": [],
        "ast_findings":    [],
        "risk_boost":      0,
    }

    try:
        # ── Regex scan (works on any text file) ─────────────────────────────
        for pattern in _WEAK_IMPORT_PATTERNS:
            matches = re.findall(pattern, content)
            if matches:
                findings["weak_imports"].extend(matches)

        for pattern in _SECRET_PATTERNS:
            matches = re.findall(pattern, content)
            if matches:
                findings["hardcoded_creds"].extend([m if isinstance(m, str) else m[0] for m in matches])

        # ── AST scan (Python files only) ─────────────────────────────────────
        if filename.endswith(".py") or filename == "":
            try:
                tree = ast.parse(content)
                for node in ast.walk(tree):
                    # Check Import / ImportFrom statements
                    if isinstance(node, (ast.Import, ast.ImportFrom)):
                        mod = ""
                        if isinstance(node, ast.Import):
                            for alias in node.names:
                                mod = alias.name.split(".")[0]
                                if mod in _WEAK_AST_NAMES:
                                    findings["ast_findings"].append(f"import {mod}")
                        elif isinstance(node, ast.ImportFrom) and node.module:
                            mod = node.module.split(".")[0]
                            if mod in _WEAK_AST_NAMES:
                                findings["ast_findings"].append(f"from {node.module}")
                    # Check Attribute access: e.g. AES.new, RSA.generate
                    elif isinstance(node, ast.Attribute):
                        if isinstance(node.value, ast.Name) and node.value.id in _WEAK_AST_NAMES:
                            findings["ast_findings"].append(f"{node.value.id}.{node.attr}")
            except SyntaxError:
                # Not valid Python — regex findings above still count
                pass

        # ── Calculate risk boost ─────────────────────────────────────────────
        boost = 0
        boost += min(len(findings["weak_imports"]) * 10, 30)   # up to +30
        boost += min(len(findings["hardcoded_creds"]) * 15, 30) # up to +30
        boost += min(len(findings["ast_findings"]) * 8, 20)     # up to +20
        findings["risk_boost"] = boost

    except Exception as exc:
        # ── Ultimate safety net ──────────────────────────────────────────────
        print(f"[scorer] scan_file_content error ({exc}) — returning no findings")

    return findings


# ─── V1 + V2 Combined Risk Scorer ────────────────────────────────────────────

def calculate_risk_score(file_type: str, encryption: str, filename: str = "", content: str = "") -> int:
    """
    Calculates a risk score from 0 to 100.
    V1 base: encryption_risk * sensitivity_weight (file-extension logic)
    V2 boost: AST/regex content scan adds up to +30 points if content provided.
    Final score capped at 100.
    """
    try:
        # 1. Encryption risk (V1 logic — safe fallback)
        enc = encryption.lower()
        if enc in ("rsa-1024", "rsa"):
            enc_risk = 95
        elif enc in ("tls_old", "weak"):
            enc_risk = 90
        elif enc == "ecdh":
            enc_risk = 75
        elif enc == "no_encryption":
            enc_risk = 90
        elif enc == "aes":
            enc_risk = 30
        elif enc == "none":
            enc_risk = 20
        else:
            enc_risk = 60

        # 2. Sensitivity weight (V1 logic — safe fallback)
        ftype = file_type.lower()
        if ftype == "database":
            weight = 1.0
        elif ftype == "sensitive_data":
            weight = 0.95
        elif ftype in ("python", "javascript", "java", "binary"):
            weight = 0.8
        elif ftype == "pdf":
            weight = 0.5
        elif ftype in ("image", "public_data"):
            weight = 0.2
        else:
            weight = 0.6

        base_score = round(enc_risk * weight)

        # 3. V2: content scan boost (only if content provided)
        boost = 0
        if content:
            findings = scan_file_content(content, filename)
            boost = findings.get("risk_boost", 0)

        return min(base_score + boost, 100)

    except Exception as exc:
        # ── V1 fallback: simple extension lookup ─────────────────────────────
        print(f"[scorer] calculate_risk_score error ({exc}) — using minimal fallback")
        return 60  # conservative mid-range default


# ─── Risk Reasons (unchanged from V1) ────────────────────────────────────────

def get_risk_reasons(file_type: str, encryption: str, filename: str = "") -> list:
    """Return a list of human-readable risk reasons for a given file."""
    reasons = []
    enc = encryption.lower()
    ftype = file_type.lower()

    if enc in ("rsa", "rsa-1024"):
        reasons.append("RSA is vulnerable to Shor's Algorithm on quantum computers")
    if enc in ("tls_old", "weak"):
        reasons.append("TLS 1.0/1.1 uses deprecated cipher suites breakable by CRQC")
    if enc == "ecdh":
        reasons.append("ECDH discrete-log problem solved in polynomial time by quantum")
    if enc == "no_encryption":
        reasons.append("No encryption detected — data fully exposed")
    if ftype == "database":
        reasons.append("Database files contain high-value persistent data")
    if ftype in ("python", "javascript", "java"):
        reasons.append("Source code may embed hardcoded keys or weak crypto calls")
    if not reasons:
        reasons.append("Potential cryptographic vulnerability detected")
    return reasons


# ─── analyze_code() — Bridge for main.py (Ram/DC's V2 interface) ──────────────

def analyze_code(file_content: str, filename: str = "unknown.py") -> dict:
    """
    Top-level scanner function that main.py calls.
    Runs the AST + regex scan and returns a structured result compatible with
    Ram's generate_summary(score, issues, quantum_vulnerable) signature.

    Returns:
        {
            "score":              int (0-100),
            "issues":             list[str] (human-readable findings),
            "quantum_vulnerable": bool (True if any quantum-breakable crypto found),
        }
    Always safe — any error returns a conservative fallback result.
    """
    try:
        findings = scan_file_content(file_content, filename)

        # Build human-readable issue list
        issues = []
        for w in findings.get("weak_imports", []):
            issues.append(f"Weak crypto import detected: {w.strip()}")
        for c in findings.get("hardcoded_creds", []):
            issues.append(f"Hardcoded secret found: {c.strip()}")
        for a in findings.get("ast_findings", []):
            issues.append(f"Vulnerable algorithm usage: {a}")

        # Determine if quantum-breakable algorithms are present
        quantum_patterns = {"rsa", "ecdh", "md5", "sha1", "des", "rc4"}
        all_text = " ".join(issues).lower()
        quantum_vulnerable = any(p in all_text for p in quantum_patterns)

        # Score: start from a code-file baseline (60) then apply boost
        base = 60
        boost = findings.get("risk_boost", 0)
        score = min(base + boost, 100)

        # If nothing suspicious found, lower score indicates clean file
        if not issues:
            score = 20
            issues = ["No critical vulnerabilities detected in static scan."]

        return {
            "score":              score,
            "issues":             issues,
            "quantum_vulnerable": quantum_vulnerable,
        }

    except Exception as exc:
        print(f"[scorer] analyze_code error ({exc}) — returning safe fallback")
        return {
            "score":              60,
            "issues":             [f"Scanner error — defaulting to moderate risk: {exc}"],
            "quantum_vulnerable": False,
        }