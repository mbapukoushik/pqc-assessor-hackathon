def generate_summary(score):

    if score > 80:
        return {
            "status": "HIGH RISK",
            "action": "Fix immediately",
            "reason": "Sensitive data with weak encryption"
        }

    elif score > 40:
        return {
            "status": "MEDIUM RISK",
            "action": "Review soon",
            "reason": "Moderate sensitivity or encryption risk"
        }

    else:
        return {
            "status": "LOW RISK",
            "action": "No immediate action",
            "reason": "Low sensitivity and secure encryption"
        }