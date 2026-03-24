def generate_summary(score):

    if score >= 70: # CHANGED
        return {
            "status": "CRITICAL", # CHANGED
            "action": "Fix immediately",
            "reason": "Sensitive data with weak encryption or critical vulnerability"
        }

    elif score >= 50:
        return {
            "status": "HIGH", # CHANGED
            "action": "Review soon",
            "reason": "Moderate sensitivity or encryption risk"
        }

    else:
        return {
            "status": "LOW", # CHANGED
            "action": "No immediate action",
            "reason": "Low sensitivity and secure encryption"
        }