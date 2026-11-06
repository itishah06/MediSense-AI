
import json
import pandas as pd

# Load our symptom mapping
with open("data/processed/symptom_mapping.json", encoding="utf-8") as file:
    mapping = json.load(file)

# Load the original evidence catalogue
catalogue = pd.read_csv("data/processed/evidence_catalog.csv")
catalogue = catalogue.set_index("evidence_id")

items = mapping["primary_symptoms"] + mapping["follow_up_evidence"]

errors = []

for item in items:
    evidence_id = item["evidence_id"]
    expected_type = item["data_type"]

    if evidence_id not in catalogue.index:
        errors.append(f"{evidence_id}: Evidence ID does not exist")
        continue

    actual_type = catalogue.loc[evidence_id, "data_type"]

    if expected_type != actual_type:
        errors.append(
            f"{evidence_id}: Expected {expected_type}, found {actual_type}"
        )

print("Total mappings:", len(items))
print("Validation errors:", errors)

if not errors:
    print("VALIDATION PASSED!")
else:
    print("PLEASE FIX ERRORS")
