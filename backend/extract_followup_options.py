
import json
import os

BASE_DIR = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))

SOURCE_PATH = os.path.join(
    BASE_DIR, "data", "raw", "ddxplus", "release_evidences.json"
)

OUTPUT_PATH = os.path.join(
    BASE_DIR, "data", "processed", "followup_options.json"
)

with open(SOURCE_PATH, "r", encoding="utf-8") as file:
    evidence_data = json.load(file)

evidence_ids = [
    "E_55",
    "E_56",
    "E_57",
    "E_130",
    "E_136",
    "E_152"
]

followup_options = {}

for evidence_id in evidence_ids:
    evidence = evidence_data[evidence_id]

    values = evidence.get("value_meaning", {})

    followup_options[evidence_id] = {
        "question": evidence["question_en"],
        "data_type": evidence["data_type"],
        "default_value": evidence["default_value"],
        "options": [
            {
                "value": value,
                "label": values.get(value, {}).get("en", value)
            }
            for value in evidence["possible-values"]
        ]
    }

os.makedirs(os.path.dirname(OUTPUT_PATH), exist_ok=True)

with open(OUTPUT_PATH, "w", encoding="utf-8") as file:
    json.dump(followup_options, file, indent=4, ensure_ascii=False)

print("Follow-up options generated successfully!")

for evidence_id, details in followup_options.items():
    print(evidence_id, "-", len(details["options"]), "options")
