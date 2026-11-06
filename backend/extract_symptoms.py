
import json
import csv
from pathlib import Path

BASE_DIR = Path(__file__).resolve().parent.parent

metadata_path = BASE_DIR / "data" / "raw" / "ddxplus" / "release_evidences.json"
output_path = BASE_DIR / "data" / "processed" / "evidence_catalog.csv"

with open(metadata_path, "r", encoding="utf-8") as file:
    evidence_data = json.load(file)

rows = []

for evidence_id, details in evidence_data.items():
    rows.append({
        "evidence_id": evidence_id,
        "question": details.get("question_en", ""),
        "data_type": details.get("data_type", ""),
        "is_antecedent": details.get("is_antecedent", False),
        "default_value": details.get("default_value", ""),
        "possible_values": json.dumps(
            details.get("possible-values", {})
        )
    })

rows.sort(key=lambda row: row["evidence_id"])

with open(output_path, "w", newline="", encoding="utf-8") as file:
    writer = csv.DictWriter(file, fieldnames=rows[0].keys())
    writer.writeheader()
    writer.writerows(rows)

print(f"Total evidence entries: {len(rows)}")
print(f"Catalogue saved to: {output_path}")
print("Evidence catalogue created successfully!")
