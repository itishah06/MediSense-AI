const API_BASE_URL = "http://127.0.0.1:5000";
document.addEventListener("DOMContentLoaded", function () {

    // Retrieve saved assessment data
    const savedData = sessionStorage.getItem("medisenseAssessment");

    if (!savedData) {
        alert("No assessment data found. Please check your symptoms first.");
        window.location.href = "symptom-checker.html";
        return;
    }

    const assessmentData = JSON.parse(savedData);

    console.log("Retrieved assessment data:", assessmentData);


    // 1. Display selected symptoms
    const symptomTags = document.getElementById("symptom-tags");

    if (symptomTags) {
        symptomTags.replaceChildren();

        assessmentData.symptoms.forEach(function (symptom) {
            const tag = document.createElement("span");
            tag.className = "symptom-tag";
            tag.textContent = symptom;
            symptomTags.appendChild(tag);
        });
    }


    // 2. Display symptom duration
    const durationElement = document.getElementById("symptom-duration");

    if (durationElement) {
        const durationLabels = {
            less_than_day: "Less than a day",
            "1_3_days": "1–3 days",
            "4_7_days": "4–7 days",
            more_than_week: "More than a week"
        };

        durationElement.textContent =
            durationLabels[assessmentData.duration] ||
            assessmentData.duration;
    }


    // 3. Display symptom severity
    const severityElement = document.getElementById("symptom-severity");

    if (severityElement) {
        const severityLabels = {
            mild: "Mild",
            moderate: "Moderate",
            severe: "Severe"
        };

        severityElement.textContent =
            severityLabels[assessmentData.severity] ||
            assessmentData.severity;
    }


    // 4. Display actual ML prediction
    const conditionElement = document.getElementById("predicted-condition");

    if (conditionElement) {
        conditionElement.textContent =
            assessmentData.predictedCondition || "No prediction available.";
    }


    // 5. Display prediction disclaimer
    const disclaimerElement = document.getElementById("prediction-disclaimer");

    if (disclaimerElement) {
        disclaimerElement.textContent =
            assessmentData.disclaimer ||
            "This is an educational prediction only, not a medical diagnosis.";
    }
    
// 6. Fetch and display condition information
async function loadConditionInformation(conditionName) {
    const container = document.getElementById("conditions-container");

    if (!container || !conditionName) return;

    try {
        const response = await fetch(
            `${API_BASE_URL}/api/condition-info/${encodeURIComponent(conditionName)}`
        );

        const data = await response.json();

        if (!response.ok) {
            throw new Error(data.error || "Unable to load condition information.");
        }

        container.replaceChildren();

        // Helper to create a condition card
        function createCard(title, content) {
            const card = document.createElement("div");
            card.className = "condition-card";

            const heading = document.createElement("h3");
            heading.textContent = title;
            card.appendChild(heading);

            if (Array.isArray(content)) {
                const list = document.createElement("ul");

                content.forEach(function (item) {
                    const li = document.createElement("li");
                    li.textContent = item;
                    list.appendChild(li);
                });

                card.appendChild(list);
            } else {
                const paragraph = document.createElement("p");
                paragraph.textContent = content || "Information not available.";
                card.appendChild(paragraph);
            }

            return card;
        }

        // Display overview
        container.appendChild(
            createCard("About the Condition", data.overview)
        );

        // Display common symptoms
        container.appendChild(
            createCard("Common Symptoms", data.common_symptoms)
        );

        // Display general guidance
        container.appendChild(
            createCard("General Guidance", data.general_guidance)
        );

        // Display urgent warning signs, if available
        if (data.urgent_warning_signs?.length) {
            container.appendChild(
                createCard("Urgent Warning Signs", data.urgent_warning_signs)
            );
        }

        // Display information source
        if (data.source_name && data.source_url) {
            const source = document.createElement("p");
            source.className = "condition-source";

            const link = document.createElement("a");
            link.href = data.source_url;
            link.textContent = data.source_name;
            link.target = "_blank";
            link.rel = "noopener noreferrer";

            source.textContent = "Information source: ";
            source.appendChild(link);
            container.appendChild(source);
        }

   
} catch (error) {
    console.error("Condition information error:", error);

    container.replaceChildren();

    // General information fallback
    function createFallbackCard(title, description) {
        const card = document.createElement("div");
        card.className = "condition-card";

        const heading = document.createElement("h3");
        heading.textContent = title;

        const paragraph = document.createElement("p");
        paragraph.textContent = description;

        card.append(heading, paragraph);
        return card;
    }

    container.appendChild(
        createFallbackCard(
            "Condition Information Unavailable",
            "Detailed information about this predicted condition is not available yet. This does not mean that the condition is confirmed."
        )
    );

    container.appendChild(
        createFallbackCard(
            "General Health Guidance",
            "Monitor your symptoms and note any changes. Stay hydrated, get adequate rest, and consult a qualified healthcare professional for appropriate assessment."
        )
    );

    container.appendChild(
        createFallbackCard(
            "When to Seek Urgent Care",
            "Seek emergency medical help for severe difficulty breathing, chest pain, confusion, or other severe or rapidly worsening symptoms."
        )
    );
}

}

// Call the function using the actual ML prediction
loadConditionInformation(assessmentData.predictedCondition);

// Find a Doctor button
const findDoctorButton = document.getElementById("find-doctor-button");

if (findDoctorButton) {
    findDoctorButton.addEventListener("click", function () {
        window.location.href = "find-doctors.html";
    });
}
});
