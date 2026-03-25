import ast
import re

def calculate_risk_score(file_type: str, encryption: str) -> int:
    """
    V1 Fallback Logic: Calculates a risk score from 0 to 100 based on exact rubric:
    Final score = round(encryption_risk * sensitivity_weight). Cap at 100.
    """
    # 1. Encryption risk
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

    # 2. Sensitivity weight
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

    score = round(enc_risk * weight)
    return min(score, 100)

def analyze_code(file_content: str, filename: str = "unknown.txt") -> dict:
    """
    Analyzes Python code for insecure cryptography libraries and hardcoded secrets.
    """
    score = 0
    issues = []
    quantum_vulnerable = False

    try:
        # Step 1: Parse the file content into an Abstract Syntax Tree (AST)
        tree = ast.parse(file_content)

        # Step 2: Walk through all the nodes in the AST to find imports and secrets
        for node in ast.walk(tree):
            # Detect standard imports (e.g., import rsa)
            if isinstance(node, ast.Import):
                for alias in node.names:
                    if alias.name == "rsa":
                        score += 40
                        issues.append("Detected usage of RSA (Quantum Vulnerable)")
                        quantum_vulnerable = True
                    elif "AES" in alias.name:
                        score += 20
                        issues.append("Detected usage of AES")

            # Detect from ... import ... (e.g., from Crypto.Cipher import AES)
            elif isinstance(node, ast.ImportFrom):
                if node.module == "Crypto.Cipher":
                    for alias in node.names:
                        if alias.name == "AES":
                            score += 20
                            issues.append("Detected usage of AES from Crypto.Cipher")
                elif node.module == "rsa":
                    score += 40
                    issues.append("Detected usage of RSA (Quantum Vulnerable) via from-import")
                    quantum_vulnerable = True
                    
            # Detect hardcoded standard secrets assigned to variables
            elif isinstance(node, ast.Assign):
                for target in node.targets:
                    if isinstance(target, ast.Name):
                        var_name = target.id.lower()
                        # Check if the variable name implies a secret
                        if var_name in ["password", "api_key", "secret"]:
                            score += 50
                            issues.append(f"Hardcoded secret detected in variable: {target.id}")

        # Step 3: Check via Regex as a secondary measure for hardcoded strings
        secret_patterns = [
            r"password\s*=\s*['\"].*['\"]",
            r"API_KEY\s*=\s*['\"].*['\"]",
            r"secret\s*=\s*['\"].*['\"]"
        ]
        
        for p in secret_patterns:
            if re.search(p, file_content, re.IGNORECASE):
                if not any("Hardcoded secret" in issue for issue in issues):
                    score += 50
                    issues.append("Hardcoded secret detected via regex pattern")
                    break

        if not issues:
            score += 10
            
    except Exception as e:
        # LARGE TRY/EXCEPT BLOCK: Fallback safety if AST fails to parse
        # Use V1 round logic by inferring file type from filename
        file_type = "python" if filename.endswith(".py") else "text"
        fallback_score = calculate_risk_score(file_type, "none")
        return {
            "score": fallback_score,
            "issues": [f"Fallback triggered - AST parser broke on {filename}, defaulting to V1 logic."],
            "quantum_vulnerable": False
        }

    return {
        "score": score,
        "issues": issues,
        "quantum_vulnerable": quantum_vulnerable
    }