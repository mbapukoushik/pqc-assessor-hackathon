import json
from scorer import calculate_risk_score
from report import generate_summary

def main():
    # Load mock_data.json
    with open("mock_data.json", "r") as file:
        data = json.load(file)
    
    print("--- Risk Assessment Results ---\n")
    
    # Loop through each item
    for item in data:
        file_type = item["file_type"]
        encryption = item["encryption"]
        
        # Calculate score
        score = calculate_risk_score(file_type, encryption)
        
        # Generate summary
        summary = generate_summary(score)
        
        # Print results clearly
        print(f"File: {file_type} | Encryption: {encryption}")
        print(f" -> Score: {score}")
        print(f" -> Status: {summary['status']} | Action: {summary['action']}\n")

if __name__ == "__main__":
    main()
