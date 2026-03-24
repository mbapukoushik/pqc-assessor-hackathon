def generate_summary(score):
    if score >= 80:
        return {"status": "HIGH RISK", "action": "Fix immediately"}
    elif score >= 50:
        return {"status": "MEDIUM RISK", "action": "Review soon"}
    else:
        return {"status": "LOW RISK", "action": "Safe"}
