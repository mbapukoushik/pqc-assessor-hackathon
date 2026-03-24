def calculate_risk_score(file_type: str, encryption: str) -> int:
    """
    Calculates a risk score from 0 to 100 based on exact rubric:
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

    # 3. Final score
    score = round(enc_risk * weight)
    return min(score, 100)