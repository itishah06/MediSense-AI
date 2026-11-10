
// MediSense AI - Symptom Checker
// Frontend integration for the Flask API.

"use strict";

// --------------------------------------------------
// 1. API configuration and application state
// --------------------------------------------------

const API_BASE_URL = "https://medisense-ai-backend-ut09.onrender.com";

let availableSymptoms = [];
let selectedSymptoms = [];
let followupOptions = {};
let followupAnswers = {};

// Emergency safety-check state
let emergencySafetyChecks = [];
let emergencyAnswers = {};
let emergencyChecksLoaded = false;
let emergencyChecksLoadError = null;
let emergencySectionVisited = false;

// Emergency HTML elements
const emergencySafetySection =
    document.getElementById("emergency-safety-section");

const emergencyQuestionsContainer =
    document.getElementById("emergency-safety-questions");

const emergencyWarning =
    document.getElementById("emergency-warning");

// Existing HTML elements
const commonSymptomsContainer =
    document.getElementById("common-symptoms");

const selectedSymptomsContainer =
    document.getElementById("selected-symptoms");

const symptomSearch =
    document.getElementById("symptom-search");

const followupSection =
    document.getElementById("follow-up-section");

const followupQuestionsContainer =
    document.getElementById("follow-up-questions");

const analyzeButton =
    document.getElementById("analyze-button");
const ageInput = 
document.getElementById("age");
const sexInput =
    document.getElementById("gender");

const predictionResult =
    document.getElementById("prediction-result");

// Multi-select evidence fields
const MULTI_VALUE_EVIDENCE_IDS = new Set([
    "E_55",
    "E_57",
    "E_133",
    "E_152"
]);

// Numeric categorical evidence fields
const NUMERIC_EVIDENCE_IDS = new Set([
    "E_56",
    "E_132",
    "E_134",
    "E_136"
]);


// --------------------------------------------------
// 2. Small UI helpers
// --------------------------------------------------

function showMessage(container, message, className = "") {
    if (!container) return;

    container.textContent = message;

    if (className) {
        container.className = className;
    }
}

function setPredictionMessage(message, className = "") {
    if (!predictionResult) return;

    predictionResult.replaceChildren();

    const paragraph = document.createElement("p");
    paragraph.textContent = message;

    if (className) {
        paragraph.className = className;
    }

    predictionResult.appendChild(paragraph);
}

function clearPredictionResult() {
    if (predictionResult) {
        predictionResult.replaceChildren();
    }
}

function setAnalyzeButtonState(isLoading) {
    if (!analyzeButton) return;

    analyzeButton.disabled = isLoading;

    analyzeButton.textContent = isLoading
        ? "Analyzing..."
        : "Analyze Symptoms";
}


// --------------------------------------------------
// 3. Load symptom catalogue from Flask
// --------------------------------------------------

async function loadSymptoms() {

    if (!commonSymptomsContainer) return;

    try {

        showMessage(
            commonSymptomsContainer,
            "Loading supported symptoms..."
        );

        const response = await fetch(
            `${API_BASE_URL}/api/symptoms`
        );

        if (!response.ok) {
            throw new Error(
                `Symptoms API returned HTTP ${response.status}.`
            );
        }

        const data = await response.json();

        if (!Array.isArray(data.primary_symptoms)) {
            throw new Error(
                "The symptoms API returned an unexpected response."
            );
        }

        availableSymptoms = data.primary_symptoms;

        displayCommonSymptoms();

    } catch (error) {

        console.error("Error loading symptoms:", error);

        showMessage(
            commonSymptomsContainer,
            "Unable to load symptoms. Please make sure the Flask backend is running."
        );
    }
}


// --------------------------------------------------
// 4. Load follow-up question options from Flask
// --------------------------------------------------

async function loadFollowupOptions() {

    try {

        const response = await fetch(
            `${API_BASE_URL}/api/followup-options`
        );

        if (!response.ok) {
            throw new Error(
                `Follow-up API returned HTTP ${response.status}.`
            );
        }

        const data = await response.json();

        if (
            !data ||
            typeof data !== "object" ||
            Array.isArray(data)
        ) {
            throw new Error(
                "The follow-up API returned an unexpected response."
            );
        }

        followupOptions = data;

        renderFollowupQuestions();

    } catch (error) {

        console.error("Error loading follow-up options:", error);

        if (followupSection && selectedSymptoms.length > 0) {

            followupSection.hidden = false;

            showMessage(
                followupQuestionsContainer,
                "Additional questions could not be loaded. Please refresh the page and try again."
            );
        }
    }
}

// --------------------------------------------------
// 5. Load emergency safety checks from Flask
// --------------------------------------------------

async function loadEmergencySafetyChecks() {

    if (!emergencySafetySection || !emergencyQuestionsContainer) {
        emergencyChecksLoadError =
            "Emergency safety-check section is missing from the page.";

        console.error(emergencyChecksLoadError);
        return;
    }

    try {

        const response = await fetch(
            `${API_BASE_URL}/api/emergency-checks`
        );

        if (!response.ok) {
            throw new Error(
                `Emergency safety-check API returned HTTP ${response.status}.`
            );
        }

        const data = await response.json();

        if (
            !data ||
            !Array.isArray(data.emergency_safety_checks) ||
            data.emergency_safety_checks.length === 0
        ) {
            throw new Error(
                "Emergency safety-check API returned an unexpected response."
            );
        }

        // Validate the received questions
        const validChecks = data.emergency_safety_checks.every(check =>
            check &&
            typeof check.evidence_id === "string" &&
            typeof check.question === "string" &&
            check.data_type === "B"
        );

        if (!validChecks) {
            throw new Error(
                "Emergency safety-check data contains an invalid question."
            );
        }

        emergencySafetyChecks = data.emergency_safety_checks;

        emergencyChecksLoaded = true;
        emergencyChecksLoadError = null;

        renderEmergencySafetyChecks();

    } catch (error) {

        emergencyChecksLoadError =
            error.message || "Unable to load emergency safety checks.";

        emergencyChecksLoaded = false;

        console.error(
            "Error loading emergency safety checks:",
            error
        );
    }
}


// --------------------------------------------------
// 6. Render emergency safety questions
// --------------------------------------------------

function renderEmergencySafetyChecks() {

    if (!emergencyQuestionsContainer) return;

    emergencyQuestionsContainer.replaceChildren();

    emergencySafetyChecks.forEach((check, index) => {

        const wrapper = document.createElement("div");
        wrapper.className = "emergency-safety-question";

        // Question text
        const question = document.createElement("p");

        question.textContent =
            `${index + 1}. ${check.question}`;

        // Yes / No options
        const options = document.createElement("div");
        options.className = "emergency-answer-options";

        ["Yes", "No"].forEach(answer => {

            const label = document.createElement("label");

            const radio = document.createElement("input");

            radio.type = "radio";
            radio.name = `emergency-${check.evidence_id}`;
            radio.value = answer.toLowerCase();

            radio.checked =
                emergencyAnswers[check.evidence_id] === answer.toLowerCase();

            radio.addEventListener("change", () => {

                emergencyAnswers[check.evidence_id] =
                    answer.toLowerCase();

                updateEmergencyWarning();

                clearPredictionResult();
            });

            label.append(
                radio,
                document.createTextNode(` ${answer}`)
            );

            options.appendChild(label);

        });

        wrapper.append(question, options);

        emergencyQuestionsContainer.appendChild(wrapper);

    });
}


// --------------------------------------------------
// 7. Display emergency warning
// --------------------------------------------------

function updateEmergencyWarning() {

    if (!emergencyWarning) return false;

    const hasYesAnswer = Object.values(emergencyAnswers).some(
        answer => answer === "yes"
    );

    emergencyWarning.hidden = !hasYesAnswer;

    return hasYesAnswer;
}


// --------------------------------------------------
// 8. Validate emergency safety answers
// --------------------------------------------------

function validateEmergencySafetyAnswers() {

    // Ensure API questions loaded successfully
    if (!emergencyChecksLoaded) {

        return {
            valid: false,

            message: emergencyChecksLoadError
                ? `Safety questions could not be loaded: ${emergencyChecksLoadError}`
                : "Emergency safety questions are still loading. Please try again."
        };
    }

    // Check unanswered questions
    const unanswered = emergencySafetyChecks.filter(
        check => !emergencyAnswers[check.evidence_id]
    );

    if (unanswered.length > 0) {

        return {
            valid: false,

            message:
                `Please answer all ${emergencySafetyChecks.length} safety questions before continuing. ${unanswered.length} question(s) remain unanswered.`
        };
    }

    // Check whether any answer is Yes
    if (updateEmergencyWarning()) {

        return {
            valid: false,
            emergency: true,

            message:
                "Your answers indicate that you should seek immediate medical attention. Symptom prediction has been stopped."
        };
    }

    return {
        valid: true
    };
}


// --------------------------------------------------
// 9. Show emergency safety section
// --------------------------------------------------

function showEmergencySafetySection() {

    if (!emergencySafetySection) return;

    emergencySafetySection.hidden = false;

    emergencySafetySection.scrollIntoView({
        behavior: "smooth",
        block: "center"
    });
}

// --------------------------------------------------
// 10. Display symptom chips
// --------------------------------------------------

function displayCommonSymptoms() {

    if (!commonSymptomsContainer) return;

    commonSymptomsContainer.replaceChildren();

    if (availableSymptoms.length === 0) {

        showMessage(
            commonSymptomsContainer,
            "No supported symptoms are available."
        );

        return;
    }

    availableSymptoms.forEach((symptom) => {

        const button = document.createElement("button");

        button.type = "button";
        button.className = "symptom-chip";
        button.textContent = symptom.display_name;

        button.setAttribute(
            "aria-pressed",
            String(
                selectedSymptoms.some(
                    item => item.evidence_id === symptom.evidence_id
                )
            )
        );

        button.addEventListener("click", () => {
            addSymptom(symptom);
        });

        commonSymptomsContainer.appendChild(button);

    });
}


// --------------------------------------------------
// 11. Add and remove selected symptoms
// --------------------------------------------------

function addSymptom(symptom) {

    if (!symptom || !symptom.evidence_id) return;

    const alreadySelected = selectedSymptoms.some(
        item => item.evidence_id === symptom.evidence_id
    );

    if (alreadySelected) return;

    selectedSymptoms.push(symptom);

    displaySelectedSymptoms();
    displayCommonSymptoms();
    renderFollowupQuestions();
    clearPredictionResult();
}


function displaySelectedSymptoms() {

    if (!selectedSymptomsContainer) return;

    selectedSymptomsContainer.replaceChildren();

    if (selectedSymptoms.length === 0) {

        const emptyMessage = document.createElement("p");

        emptyMessage.className = "empty-selection";
        emptyMessage.textContent = "No symptoms selected yet.";

        selectedSymptomsContainer.appendChild(emptyMessage);

        return;
    }

    selectedSymptoms.forEach((symptom) => {

        const chip = document.createElement("button");

        chip.type = "button";
        chip.className = "selected-chip";

        chip.setAttribute(
            "aria-label",
            `Remove ${symptom.display_name}`
        );

        const name = document.createElement("span");
        name.textContent = symptom.display_name;

        const removeIcon = document.createElement("span");
        removeIcon.textContent = "×";
        removeIcon.setAttribute("aria-hidden", "true");

        chip.append(name, removeIcon);

        chip.addEventListener("click", () => {
            removeSymptom(symptom.evidence_id);
        });

        selectedSymptomsContainer.appendChild(chip);

    });
}


function removeSymptom(evidenceId) {

    selectedSymptoms = selectedSymptoms.filter(
        item => item.evidence_id !== evidenceId
    );

    // Remove answers for follow-up questions
    // that are no longer relevant.
    const stillRelevantIds = new Set(getRelevantFollowups());

    Object.keys(followupAnswers).forEach((id) => {

        if (!stillRelevantIds.has(id)) {
            delete followupAnswers[id];
        }

    });

    displaySelectedSymptoms();
    displayCommonSymptoms();
    renderFollowupQuestions();
    clearPredictionResult();
}


// --------------------------------------------------
// 12. Identify relevant follow-up questions
// --------------------------------------------------

function getRelevantFollowups() {

    const selectedIds = selectedSymptoms.map(
        symptom => symptom.evidence_id
    );

    const relevantIds = new Set();

    // Muscle pain
    if (selectedIds.includes("E_144")) {

        relevantIds.add("E_55");
        relevantIds.add("E_56");
        relevantIds.add("E_57");

    }

    // Skin lesions or rash
    if (selectedIds.includes("E_129")) {

        relevantIds.add("E_130");
        relevantIds.add("E_131");
        relevantIds.add("E_132");
        relevantIds.add("E_133");
        relevantIds.add("E_134");
        relevantIds.add("E_135");
        relevantIds.add("E_136");

    }

    // Swelling
    if (selectedIds.includes("E_151")) {

        relevantIds.add("E_152");

    }

    return [...relevantIds];
}


// --------------------------------------------------
// 13. Render follow-up questions
// --------------------------------------------------

function renderFollowupQuestions() {

    if (!followupSection || !followupQuestionsContainer) return;

    const relevantIds = getRelevantFollowups();

    followupQuestionsContainer.replaceChildren();

    if (relevantIds.length === 0) {

        followupSection.hidden = true;

        return;
    }

    followupSection.hidden = false;

    if (Object.keys(followupOptions).length === 0) {

        showMessage(
            followupQuestionsContainer,
            "Loading additional questions..."
        );

        return;
    }

    relevantIds.forEach((evidenceId) => {

        const details = followupOptions[evidenceId];

        if (!details || !Array.isArray(details.options)) {

            const warning = document.createElement("p");

            warning.textContent =
                `Options for ${evidenceId} are unavailable.`;

            followupQuestionsContainer.appendChild(warning);

            return;
        }

        const questionWrapper = document.createElement("div");

        questionWrapper.className = "followup-question";

        const label = document.createElement("label");

        label.textContent = details.question;
        label.htmlFor = `followup-${evidenceId}`;

        questionWrapper.appendChild(label);

        if (NUMERIC_EVIDENCE_IDS.has(evidenceId)) {

            renderNumericFollowup(
                questionWrapper,
                evidenceId,
                followupAnswers[evidenceId]
            );

        } else if (MULTI_VALUE_EVIDENCE_IDS.has(evidenceId)) {

            renderMultiSelectFollowup(
                questionWrapper,
                evidenceId,
                details.options
            );

        } else {

            renderSingleSelectFollowup(
                questionWrapper,
                evidenceId,
                details.options
            );

        }

        followupQuestionsContainer.appendChild(questionWrapper);

    });
}


// --------------------------------------------------
// 14. Numeric follow-up questions
// --------------------------------------------------

function renderNumericFollowup(container, evidenceId, currentValue) {

    const wrapper = document.createElement("div");

    wrapper.className = "numeric-followup";

    const valueLabel = document.createElement("p");

    valueLabel.className = "range-value";

    const range = document.createElement("input");

    range.type = "range";
    range.id = `followup-${evidenceId}`;
    range.min = "0";
    range.max = "10";
    range.step = "1";

    const hasAnswer =
        currentValue !== undefined &&
        currentValue !== null &&
        currentValue !== "";

    if (hasAnswer) {

        range.value = String(currentValue);

        valueLabel.textContent =
            `Selected value: ${currentValue}/10`;

    } else {

        range.value = "5";

        valueLabel.textContent =
            "Move the slider to answer";

    }

    range.addEventListener("input", () => {

        const value = Number(range.value);

        followupAnswers[evidenceId] = value;

        valueLabel.textContent =
            `Selected value: ${value}/10`;

    });

    const scale = document.createElement("div");

    scale.className = "range-scale";

    const low = document.createElement("span");
    low.textContent = "0 - None";

    const high = document.createElement("span");
    high.textContent = "10 - Maximum";

    scale.append(low, high);

    wrapper.append(range, valueLabel, scale);

    container.appendChild(wrapper);

}


// --------------------------------------------------
// 15. Searchable multi-select follow-up questions
// --------------------------------------------------

function renderMultiSelectFollowup(container, evidenceId, options) {

    const locationContainer = document.createElement("div");

    locationContainer.className = "searchable-multiselect";

    const searchInput = document.createElement("input");

    searchInput.type = "text";
    searchInput.placeholder = "Search and select locations...";
    searchInput.autocomplete = "off";
    searchInput.id = `followup-${evidenceId}`;

    const optionsContainer = document.createElement("div");

    optionsContainer.className = "multiselect-options";

    // V_123 represents nowhere.
    const usableOptions = options.filter(
        option => option.value !== "V_123"
    );

    function renderOptions(query = "") {

        optionsContainer.replaceChildren();

        const normalizedQuery = query.trim().toLowerCase();

        const matchingOptions = usableOptions.filter(option =>
            option.label.toLowerCase().includes(normalizedQuery)
        );

        if (matchingOptions.length === 0) {

            const empty = document.createElement("p");

            empty.textContent = "No matching options found.";

            optionsContainer.appendChild(empty);

            return;
        }

        matchingOptions.forEach((option) => {

            const optionLabel = document.createElement("label");

            optionLabel.className = "multiselect-option";

            const checkbox = document.createElement("input");

            checkbox.type = "checkbox";
            checkbox.value = option.value;

            const selectedValues =
                Array.isArray(followupAnswers[evidenceId])
                    ? followupAnswers[evidenceId]
                    : [];

            checkbox.checked =
                selectedValues.includes(option.value);

            const optionText = document.createElement("span");

            optionText.textContent = option.label;

            checkbox.addEventListener("change", () => {

                const currentValues =
                    Array.isArray(followupAnswers[evidenceId])
                        ? [...followupAnswers[evidenceId]]
                        : [];

                if (checkbox.checked) {

                    if (!currentValues.includes(option.value)) {
                        currentValues.push(option.value);
                    }

                } else {

                    const index = currentValues.indexOf(option.value);

                    if (index !== -1) {
                        currentValues.splice(index, 1);
                    }

                }

                if (currentValues.length > 0) {

                    followupAnswers[evidenceId] = currentValues;

                } else {

                    delete followupAnswers[evidenceId];

                }

            });

            optionLabel.append(checkbox, optionText);

            optionsContainer.appendChild(optionLabel);

        });
    }

    searchInput.addEventListener("input", () => {
        renderOptions(searchInput.value);
    });

    locationContainer.append(searchInput, optionsContainer);

    container.appendChild(locationContainer);

    renderOptions();

}


// --------------------------------------------------
// 16. Single-choice categorical follow-up questions
// --------------------------------------------------

function renderSingleSelectFollowup(container, evidenceId, options) {

    const select = document.createElement("select");

    select.id = `followup-${evidenceId}`;

    const placeholder = document.createElement("option");

    placeholder.value = "";
    placeholder.textContent = "Select an option";

    select.appendChild(placeholder);

    options
        .filter(option => option.value !== "V_123")
        .forEach((option) => {

            const optionElement = document.createElement("option");

            optionElement.value = option.value;
            optionElement.textContent = option.label;

            select.appendChild(optionElement);

        });

    if (followupAnswers[evidenceId] !== undefined) {
        select.value = followupAnswers[evidenceId];
    }

    select.addEventListener("change", () => {

        if (select.value === "") {

            delete followupAnswers[evidenceId];

        } else {

            followupAnswers[evidenceId] = select.value;

        }

    });

    container.appendChild(select);

}


// --------------------------------------------------
// 17. Search symptoms by display name
// --------------------------------------------------

function setupSymptomSearch() {

    if (!symptomSearch || !symptomSearch.parentElement) return;

    const searchResults = document.createElement("div");

    searchResults.className = "search-results";

    symptomSearch.parentElement.insertAdjacentElement(
        "afterend",
        searchResults
    );

    symptomSearch.addEventListener("input", () => {

        const query = symptomSearch.value.trim().toLowerCase();

        searchResults.replaceChildren();

        if (query.length === 0) return;

        const matchingSymptoms = availableSymptoms.filter(symptom =>
            symptom.display_name.toLowerCase().includes(query)
        );

        if (matchingSymptoms.length === 0) {

            showMessage(
                searchResults,
                "No matching supported symptoms found."
            );

            return;
        }

        matchingSymptoms.forEach((symptom) => {

            const result = document.createElement("button");

            result.type = "button";
            result.className = "search-result";
            result.textContent = symptom.display_name;

            result.addEventListener("click", () => {

                addSymptom(symptom);

                symptomSearch.value = "";

                searchResults.replaceChildren();

            });

            searchResults.appendChild(result);

        });

    });
}

// --------------------------------------------------
// 18. Prepare evidence for prediction
// --------------------------------------------------

function prepareEvidence() {

    const evidence = [];

    // Add selected primary symptoms
    selectedSymptoms.forEach(symptom => {

        evidence.push(symptom.evidence_id);

    });

    // Add answered follow-up questions
    Object.entries(followupAnswers).forEach(([evidenceId, answer]) => {

        if (
            answer === undefined ||
            answer === null ||
            answer === ""
        ) {
            return;
        }

        // Numeric evidence
        if (NUMERIC_EVIDENCE_IDS.has(evidenceId)) {

            evidence.push(`${evidenceId}_@_${answer}`);

        }

        // Multi-value evidence
        else if (MULTI_VALUE_EVIDENCE_IDS.has(evidenceId)) {

            if (Array.isArray(answer)) {

                answer.forEach(value => {
                    evidence.push(`${evidenceId}_@_${value}`);
                });

            }

        }

        // Single categorical evidence
        else {

            evidence.push(`${evidenceId}_@_${answer}`);

        }

    });

    return [...new Set(evidence)];

}


// --------------------------------------------------
// 19. Validate prediction inputs
// --------------------------------------------------

function validatePredictionInputs() {

    if (!ageInput || !sexInput) {

        return {
            valid: false,
            message: "Age and sex fields are unavailable."
        };

    }

    const age = Number(ageInput.value);

    if (
        ageInput.value.trim() === "" ||
        !Number.isFinite(age) ||
        age < 0 ||
        age > 120
    ) {

        return {
            valid: false,
            message: "Please enter a valid age between 0 and 120."
        };

    }

    const sex = sexInput.value;

    if (!["M", "F"].includes(sex)) {

        return {
            valid: false,
            message: "Please select your sex."
        };

    }

    if (selectedSymptoms.length === 0) {

        return {
            valid: false,
            message: "Please select at least one symptom."
        };

    }

    return {
        valid: true,
        age,
        sex
    };

}


// --------------------------------------------------
// 20. Analyze symptoms and predict condition
// --------------------------------------------------

async function analyzeSymptoms() {

    clearPredictionResult();

    // First validate basic inputs
    const validation = validatePredictionInputs();

    if (!validation.valid) {

        setPredictionMessage(validation.message, "error");

        return;

    }

    // First click: show safety questions
    if (!emergencySectionVisited) {

        if (!emergencyChecksLoaded) {

            setPredictionMessage(
                "Emergency safety questions are not ready. Please wait and try again.",
                "error"
            );

            return;

        }

        emergencySectionVisited = true;

        showEmergencySafetySection();

        setPredictionMessage(
            "Please answer all emergency safety questions before continuing.",
            "info"
        );

        return;

    }

    // Validate safety answers
    const safetyValidation = validateEmergencySafetyAnswers();

    if (!safetyValidation.valid) {

        setPredictionMessage(
            safetyValidation.message,
            "error"
        );

        if (safetyValidation.emergency) {

            updateEmergencyWarning();

        } else {

            showEmergencySafetySection();

        }

        return;

    }

    // Prepare evidence
    const evidence = prepareEvidence();

    if (evidence.length === 0) {

        setPredictionMessage(
            "No valid symptom evidence was provided.",
            "error"
        );

        return;

    }

    const requestData = {
        age: validation.age,
        sex: validation.sex,
        evidences: evidence
    };

    try {

        setAnalyzeButtonState(true);

        setPredictionMessage(
            "Analyzing your symptoms. Please wait...",
            "info"
        );

        const response = await fetch(
            `${API_BASE_URL}/api/predict`,
            {
                method: "POST",

                headers: {
                    "Content-Type": "application/json"
                },

                body: JSON.stringify(requestData)

            }
        );

        const data = await response.json();

        if (!response.ok) {

            throw new Error(
                data.error || "Unable to analyze symptoms."
            );

        }
// Save assessment data for the Health Assessment page
const assessmentData = {
    predictedCondition: data.predicted_condition,
    disclaimer: data.disclaimer ||
        "This is an educational prediction only, not a medical diagnosis.",

    age: validation.age,
    sex: validation.sex,

    symptoms: selectedSymptoms.map(
        symptom => symptom.display_name
    ),
duration: document.querySelector(
    'input[name="duration"]:checked'
)?.value || "Not specified",

severity: document.querySelector(
    'input[name="severity"]:checked'
)?.value || "Not specified",

    evidences: evidence
};

sessionStorage.setItem(
    "medisenseAssessment",
    JSON.stringify(assessmentData)
);
        // Display prediction
        
// Display prediction
if (predictionResult) {

    predictionResult.hidden = false;
    predictionResult.replaceChildren();

    const heading = document.createElement("h3");
    heading.textContent = "Predicted Condition";

    const condition = document.createElement("p");
    condition.textContent =
        data.predicted_condition || "No prediction available.";

    const disclaimer = document.createElement("p");
    disclaimer.textContent =
        data.disclaimer ||
        "This is an educational prediction only, not a medical diagnosis.";

    const status = document.createElement("p");
    status.textContent = "Analysis completed successfully.";
    status.className = "success";

    predictionResult.append(
        heading,
        condition,
        disclaimer,
        status
    );
}
// Open Health Assessment in the same tab
window.location.href = "health-assessment.html";

    } catch (error) {

        console.error("Prediction error:", error);

        setPredictionMessage(
            error.message || "Something went wrong. Please try again.",
            "error"
        );

    } finally {

        setAnalyzeButtonState(false);

    }

}


// --------------------------------------------------
// 21. Initialize symptom checker
// --------------------------------------------------

async function initializeSymptomChecker() {

    // Set up event listeners
    if (analyzeButton) {

        analyzeButton.addEventListener("click", analyzeSymptoms);

    }

    // Load initial data
    await Promise.all([
        loadSymptoms(),
        loadFollowupOptions(),
        loadEmergencySafetyChecks()
    ]);

    // Render initial UI
    displayCommonSymptoms();
    displaySelectedSymptoms();
    renderFollowupQuestions();

    // Set up symptom search
    setupSymptomSearch();

}


// --------------------------------------------------
// 22. Start the application
// --------------------------------------------------

document.addEventListener(
    "DOMContentLoaded",
    initializeSymptomChecker
);
