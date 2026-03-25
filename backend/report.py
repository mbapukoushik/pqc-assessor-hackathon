def generate_summary(score: int, issues: list, quantum_vulnerable: bool) -> dict:
    """
    Generates a structured report based on the scoring logic.
    """
    # Determine the status based on score threshold
    if score >= 70 or quantum_vulnerable:
        status = "HIGH"
    elif score >= 40:
        status = "MEDIUM"
    else:
        status = "LOW"
        
    # Determine basic action required
    if status == "HIGH":
        action = "Immediate action required: Replace vulnerable algorithms and remove hardcoded secrets."
    elif status == "MEDIUM":
        action = "Review code: Plan to upgrade algorithms in the near future."
    else:
        action = "No critical action required. Continue monitoring."

    return {
        "status": status,
        "action": action,
        "issues": issues,
        "quantum_vulnerable": quantum_vulnerable
    }