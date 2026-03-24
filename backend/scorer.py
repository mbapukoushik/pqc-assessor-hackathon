def calculate_risk_score(file_type, encryption):
    if file_type == "pdf" and encryption == "none":
        return 10
    elif file_type == "database" and encryption == "RSA":
        return 95
    elif file_type == "image":
        return 20
    elif encryption == "AES":
        return 40
    else:
        return 50
