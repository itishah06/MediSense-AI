
import json
import os
import numpy as np
from scipy.sparse import csr_matrix


# Project directories
BASE_DIR = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))

FEATURE_PATH = os.path.join(
    BASE_DIR, "data", "processed", "feature_names.json"
)

EVIDENCE_PATH = os.path.join(
    BASE_DIR, "data", "raw", "ddxplus", "release_evidences.json"
)


# Load feature vocabulary
with open(FEATURE_PATH, "r", encoding="utf-8") as file:
    FEATURE_NAMES = json.load(file)

FEATURE_TO_INDEX = {
    name: index for index, name in enumerate(FEATURE_NAMES)
}


# Load evidence metadata
with open(EVIDENCE_PATH, "r", encoding="utf-8") as file:
    EVIDENCE_METADATA = json.load(file)


def encode_patient(age, sex, evidences):

    # Validate age
    try:
        age = float(age)
    except (TypeError, ValueError):
        raise ValueError("Age must be numeric.")

    if not np.isfinite(age) or not 0 <= age <= 120:
        raise ValueError("Age must be between 0 and 120.")

    # Validate sex
    if not isinstance(sex, str) or sex.upper() not in ["M", "F"]:
        raise ValueError("Sex must be M or F.")

    sex = sex.upper()

    # Validate evidence list
    if not isinstance(evidences, list) or not evidences:
        raise ValueError("Evidences must be a non-empty list.")

    if not all(isinstance(item, str) for item in evidences):
        raise ValueError("Every evidence must be a string.")

    features = {
        "AGE": age,
        f"SEX_{sex}": 1.0
    }

    selected_values = {}

    for item in evidences:

        if "_@_" in item:
            evidence_id, selected_value = item.split("_@_", 1)
            has_value = True
        else:
            evidence_id = item
            selected_value = None
            has_value = False

        # Check whether evidence ID exists
        if evidence_id not in EVIDENCE_METADATA:
            raise ValueError(f"Unknown evidence ID: {evidence_id}")

        metadata = EVIDENCE_METADATA[evidence_id]
        evidence_type = metadata["data_type"]

        # Binary evidence
        if evidence_type == "B":
            if has_value:
                raise ValueError(
                    f"{evidence_id} is binary and must not have a selected value."
                )

            feature_name = evidence_id

        # Categorical and multi-choice evidence
        elif evidence_type in ["C", "M"]:

            if not has_value or selected_value == "":
                raise ValueError(
                    f"{evidence_id} requires a selected value."
                )

            allowed_values = {
                str(value)
                for value in metadata["possible-values"]
            }

            if selected_value not in allowed_values:
                raise ValueError(
                    f"Invalid value {selected_value} for {evidence_id}."
                )

            if evidence_type == "C":
                if evidence_id in selected_values:
                    raise ValueError(
                        f"Only one value is allowed for {evidence_id}."
                    )

                selected_values[evidence_id] = selected_value

            else:
                selected_values.setdefault(evidence_id, set())

                if selected_value in selected_values[evidence_id]:
                    raise ValueError(
                        f"Duplicate value for {evidence_id}: {selected_value}"
                    )

                selected_values[evidence_id].add(selected_value)

            feature_name = f"{evidence_id}__{selected_value}"

        else:
            raise ValueError(
                f"Unsupported evidence type: {evidence_type}"
            )

        # Check training vocabulary
        if feature_name not in FEATURE_TO_INDEX:
            raise ValueError(
                f"Feature not found in training vocabulary: {feature_name}"
            )

        # Prevent duplicate evidence features
        if feature_name in features:
            raise ValueError(f"Duplicate evidence: {feature_name}")

        features[feature_name] = 1.0

    # Convert features into sparse matrix
    columns = [
        FEATURE_TO_INDEX[name]
        for name in features
    ]

    values = list(features.values())

    X = csr_matrix(
        (
            np.array(values, dtype=np.float32),
            (
                np.zeros(len(columns), dtype=np.int32),
                np.array(columns, dtype=np.int32)
            )
        ),
        shape=(1, len(FEATURE_NAMES)),
        dtype=np.float32
    )

    return X
