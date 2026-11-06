
import json
import os
import joblib

from flask import Flask, jsonify, request
from flask_cors import CORS

from feature_encoder import encode_patient


# Initialize Flask
app = Flask(__name__)
CORS(app)


# Define project paths
BASE_DIR = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))

MODEL_PATH = os.path.join(
    BASE_DIR, "models", "linear_svc_model.pkl"
)

SYMPTOM_MAPPING_PATH = os.path.join(
    BASE_DIR, "data", "processed", "symptom_mapping.json"
)

FOLLOWUP_OPTIONS_PATH = os.path.join(
    BASE_DIR, "data", "processed", "followup_options.json"
)

EMERGENCY_CHECKS_PATH = os.path.join(
    BASE_DIR, "data", "processed", "emergency_safety_checks.json"
)
CONDITION_INFO_PATH = os.path.join(
    BASE_DIR, "data", "condition_information", "conditions.json"
)

# Load the trained model once when the backend starts
model = joblib.load(MODEL_PATH)


@app.route("/", methods=["GET"])
def home():
    return jsonify({
        "message": "Welcome to MediSense AI Backend!",
        "status": "Running"
    })


@app.route("/api/health", methods=["GET"])
def health():
    return jsonify({
        "status": "healthy",
        "project": "MediSense AI"
    })


# Fetch the symptom catalogue for the frontend
@app.route("/api/symptoms", methods=["GET"])
def get_symptoms():
    try:
        with open(SYMPTOM_MAPPING_PATH, "r", encoding="utf-8") as file:
            mapping = json.load(file)

        return jsonify(mapping), 200

    except FileNotFoundError:
        app.logger.exception("Symptom mapping file not found")
        return jsonify({
            "error": "Symptom mapping file not found."
        }), 500

    except json.JSONDecodeError:
        app.logger.exception("Invalid symptom mapping JSON")
        return jsonify({
            "error": "Symptom mapping file contains invalid JSON."
        }), 500

    except Exception:
        app.logger.exception("Could not load symptom mapping")
        return jsonify({
            "error": "Could not load symptom catalogue."
        }), 500


# Fetch dynamic follow-up questions and their valid options
@app.route("/api/followup-options", methods=["GET"])
def get_followup_options():
    try:
        with open(
            FOLLOWUP_OPTIONS_PATH, "r", encoding="utf-8"
        ) as file:
            options = json.load(file)

        return jsonify(options), 200

    except FileNotFoundError:
        app.logger.exception("Follow-up options file not found")
        return jsonify({
            "error": "Follow-up options file not found."
        }), 404

    except json.JSONDecodeError:
        app.logger.exception("Invalid follow-up options JSON")
        return jsonify({
            "error": "Follow-up options file contains invalid JSON."
        }), 500

    except Exception:
        app.logger.exception("Could not load follow-up options")
        return jsonify({
            "error": "Could not load follow-up options."
        }), 500


# Fetch emergency safety-check questions
@app.route("/api/emergency-checks", methods=["GET"])
def get_emergency_checks():
    try:
        with open(
            EMERGENCY_CHECKS_PATH, "r", encoding="utf-8"
        ) as file:
            checks = json.load(file)

        return jsonify(checks), 200

    except FileNotFoundError:
        app.logger.exception("Emergency safety-check file not found")
        return jsonify({
            "error": "Emergency safety-check file not found."
        }), 404

    except json.JSONDecodeError:
        app.logger.exception("Invalid emergency safety-check JSON")
        return jsonify({
            "error": "Emergency safety-check file contains invalid JSON."
        }), 500

    except Exception:
        app.logger.exception("Could not load emergency safety checks")
        return jsonify({
            "error": "Could not load emergency safety checks."
        }), 500

# Fetch educational information for a predicted condition
@app.route("/api/condition-info/<path:condition_name>", methods=["GET"])
def get_condition_info(condition_name):
    try:
        with open(
            CONDITION_INFO_PATH, "r", encoding="utf-8"
        ) as file:
            conditions = json.load(file)

        if not isinstance(conditions, dict):
            return jsonify({
                "error": "Condition information file has an invalid structure."
            }), 500

        # Match condition names without case sensitivity
        matched_condition = next(
            (
                name for name in conditions
                if name.casefold() == condition_name.strip().casefold()
            ),
            None
        )

        if matched_condition is None:
            return jsonify({
                "error": "Information for this condition is not available yet."
            }), 404

        return jsonify(conditions[matched_condition]), 200

    except FileNotFoundError:
        app.logger.exception("Condition information file not found")
        return jsonify({
            "error": "Condition information file not found."
        }), 500

    except json.JSONDecodeError:
        app.logger.exception("Invalid condition information JSON")
        return jsonify({
            "error": "Condition information file contains invalid JSON."
        }), 500

    except Exception:
        app.logger.exception("Could not load condition information")
        return jsonify({
            "error": "Could not load condition information."
        }), 500


# Predict condition based on patient information and evidences
@app.route("/api/predict", methods=["POST"])
def predict():
    try:
        data = request.get_json(silent=True)

        if not isinstance(data, dict):
            return jsonify({
                "error": "Request body must be valid JSON."
            }), 400

        age = data.get("age")
        sex = data.get("sex")
        evidences = data.get("evidences")

        if age is None or isinstance(age, bool):
            return jsonify({
                "error": "Age is required and must be numeric."
            }), 400

        try:
            age = float(age)
        except (TypeError, ValueError):
            return jsonify({
                "error": "Age must be numeric."
            }), 400

        if not 0 <= age <= 120:
            return jsonify({
                "error": "Age must be between 0 and 120."
            }), 400

        if not isinstance(sex, str) or sex.upper() not in ["M", "F"]:
            return jsonify({
                "error": "Sex must be M or F."
            }), 400

        if not isinstance(evidences, list) or not evidences:
            return jsonify({
                "error": "Evidences must be a non-empty list."
            }), 400

        if not all(isinstance(item, str) for item in evidences):
            return jsonify({
                "error": "Every evidence must be a string."
            }), 400

        # Encode input using the same vocabulary used during training
        X = encode_patient(age, sex, evidences)

        # Generate prediction
        prediction = model.predict(X)[0]

        return jsonify({
            "predicted_condition": str(prediction),
            "disclaimer": (
                "Educational prototype using synthetic training data. "
                "This output is not a medical diagnosis. Consult a "
                "qualified healthcare professional for medical advice."
            )
        }), 200

    except ValueError as error:
        return jsonify({
            "error": str(error)
        }), 400

    except Exception:
        app.logger.exception("Prediction failed")
        return jsonify({
            "error": "An internal prediction error occurred."
        }), 500


if __name__ == "__main__":
    app.run(debug=True, port=5000)
