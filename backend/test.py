from scorer import calculate_risk_score
from report import generate_summary

def main():
    score = calculate_risk_score("database", "RSA")
    summary = generate_summary(score)
    print("Test Input: file_type='database', encryption='RSA'")
    print(f"Score Output: {score}")
    print(f"Summary Output: {summary}")

if __name__ == "__main__":
    main()
