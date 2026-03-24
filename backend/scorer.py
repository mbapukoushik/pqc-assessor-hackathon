def calculate_risk_score(file_type, encryption):
    """
    Calculates a risk score from 0 to 100 based on file type and encryption.
    """
    if file_type == "pdf" and encryption == "none":
        return 10
    elif file_type == "database" and encryption == "RSA":
        return 95
    elif file_type == "image":
        return 20
    elif encryption == "AES":
        return 40
    elif encryption == "no_encryption":
        return 90
    elif encryption == "tls_old":
        return 85
    elif file_type == "public_data":
        return 15
    elif file_type == "sensitive_data" and encryption == "weak":
        return 88
    else:
        return 50
