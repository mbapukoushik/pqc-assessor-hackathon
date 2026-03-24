def calculate_risk_score(file_type, encryption, filename):

    score = 0

    # 🔐 Encryption risk
    if encryption == "RSA":
        score += 50
    elif encryption == "AES":
        score += 10

    # 📁 File type importance
    if file_type == "database":
        score += 40
    elif file_type == "document":
        score += 20
    elif file_type == "pdf":
        score += 5

    # 🧠 Keyword-based sensitivity
    sensitive_keywords = ["password", "salary", "customer", "confidential"]

    for word in sensitive_keywords:
        if word in filename.lower():
            score += 20

    # 🎯 Cap score at 100
    return min(score, 100)
def get_risk_reasons(file_type, encryption, filename):

    risks = []

    if encryption == "RSA":
        risks.append("Weak encryption (RSA)")

    if file_type == "database":
        risks.append("Sensitive data storage")

    if "password" in filename.lower():
        risks.append("Contains passwords")

    if "salary" in filename.lower():
        risks.append("Contains financial data")

    return risks