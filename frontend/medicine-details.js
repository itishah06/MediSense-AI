
const medicines = {
    paracetamol: {
        name: "Paracetamol",
        category: "Pain Relief",
        intro: "General educational information about paracetamol, a medicine commonly used for pain and fever.",
        overview: "Paracetamol is a pain-relieving and fever-reducing medicine. It is available in different forms, including tablets, capsules and liquid preparations.",
        uses: [
            "Relief of headaches and migraines",
            "Relief of toothache and muscle pain",
            "Relief of period pain",
            "Reducing fever and high temperature"
        ],
        howItWorks: "Paracetamol is thought to work mainly in the brain and central nervous system by reducing the signals involved in pain and regulating body temperature.",
        sideEffects: [
            "Side effects are uncommon when used appropriately.",
            "Some people may experience an allergic reaction.",
            "Taking too much can cause serious liver damage."
        ],
        precautions: [
            "Do not combine multiple medicines containing paracetamol.",
            "People with liver or kidney problems should seek professional advice.",
            "Taking more than the recommended amount can be dangerous, even if you feel well.",
            "Check with a pharmacist about possible medicine interactions."
        ],
        guidance: "Check the product leaflet and consult a doctor or pharmacist if you are unsure whether paracetamol is suitable for you.",
        sourceName: "NHS – Paracetamol for adults",
        sourceUrl: "https://www.nhs.uk/medicines/paracetamol-for-adults/"
    },

    ibuprofen: {
        name: "Ibuprofen",
        category: "Pain Relief",
        intro: "General educational information about ibuprofen and its anti-inflammatory properties.",
        overview: "Ibuprofen is a non-steroidal anti-inflammatory drug (NSAID). It is used to relieve pain, reduce inflammation and lower fever.",
        uses: [
            "Headaches and migraines",
            "Joint and muscle pain",
            "Toothache and period pain",
            "Pain and swelling following an injury",
            "Reducing fever"
        ],
        howItWorks: "Ibuprofen reduces the production of substances called prostaglandins, which contribute to pain, inflammation and fever.",
        sideEffects: [
            "Indigestion and stomach discomfort",
            "Nausea or vomiting",
            "Headache or dizziness",
            "Skin rash",
            "Rare but serious problems can include stomach bleeding, kidney problems and allergic reactions."
        ],
        precautions: [
            "People with stomach ulcers or kidney, liver or heart conditions should seek professional advice.",
            "People with previous reactions to aspirin or other NSAIDs should check before use.",
            "Pregnant people should avoid ibuprofen unless advised by a healthcare professional.",
            "Do not combine it with other NSAIDs, such as naproxen or aspirin, without professional advice.",
            "Check for interactions with blood thinners and other medicines."
        ],
        guidance: "Consult a doctor or pharmacist before using ibuprofen, especially if you have an existing medical condition or take other medicines.",
        sourceName: "NHS – Ibuprofen for adults",
        sourceUrl: "https://www.nhs.uk/medicines/ibuprofen-for-adults/"
    },

    aspirin: {
        name: "Aspirin",
        category: "Pain Relief",
        intro: "General educational information about aspirin, including its pain-relieving and blood-clot-preventing uses.",
        overview: "Aspirin is a non-steroidal anti-inflammatory drug (NSAID). Depending on the formulation and medical purpose, it may be used for pain relief or prescribed in low doses to help prevent blood clots.",
        uses: [
            "Relief of certain types of pain",
            "Reducing fever",
            "Reducing inflammation",
            "Low-dose aspirin may be prescribed to help prevent blood clots."
        ],
        howItWorks: "Aspirin reduces the production of prostaglandins involved in pain and inflammation. It also reduces platelet activity, which affects blood clot formation.",
        sideEffects: [
            "Indigestion and stomach discomfort",
            "Increased tendency to bleed or bruise",
            "Stomach ulcers or bleeding in some people",
            "Rare but serious allergic reactions."
        ],
        precautions: [
            "Do not give aspirin to children under 16 unless specifically prescribed by a specialist.",
            "People with stomach ulcers or bleeding disorders should seek professional advice.",
            "People with asthma or kidney, liver or heart conditions should check whether it is suitable.",
            "Aspirin can interact with blood thinners and other NSAIDs.",
            "Do not start or stop prescribed low-dose aspirin without consulting your doctor."
        ],
        guidance: "Aspirin has different uses and risks depending on its dose and purpose. Consult a doctor or pharmacist before using it.",
        sourceName: "NHS – Aspirin",
        sourceUrl: "https://www.nhs.uk/medicines/aspirin/"
    },

    cetirizine: {
        name: "Cetirizine",
        category: "Allergy Relief",
        intro: "General educational information about cetirizine, an antihistamine commonly used to relieve allergy symptoms.",
        overview: "Cetirizine is an antihistamine used to help relieve symptoms associated with allergic conditions. It is commonly described as a non-drowsy antihistamine, although it can still cause sleepiness in some people.",
        uses: [
            "Relief of hay fever symptoms",
            "Relief of itchy and watery eyes associated with allergies",
            "Management of hives and itchy skin",
            "Relief of symptoms associated with insect bites and stings",
            "Relief of certain other allergic reactions"
        ],
        howItWorks: "Cetirizine blocks the effects of histamine, a chemical released by the body during an allergic reaction. This helps reduce symptoms such as itching, sneezing and a runny nose.",
        sideEffects: [
            "Sleepiness or tiredness",
            "Headache",
            "Dry mouth",
            "Nausea",
            "Dizziness"
        ],
        precautions: [
            "It may cause sleepiness. Avoid driving or operating machinery if affected.",
            "People with kidney problems should seek professional advice before use.",
            "Consult a healthcare professional if pregnant or breastfeeding.",
            "Check with a pharmacist about possible interactions with other medicines.",
            "Do not combine different antihistamines unless advised by a healthcare professional."
        ],
        guidance: "Consult a doctor or pharmacist if you are unsure whether cetirizine is suitable for you, particularly if you have an existing medical condition or take other medicines.",
        sourceName: "NHS – About cetirizine",
        sourceUrl: "https://www.nhs.uk/medicines/cetirizine/about-cetirizine/"
    },

    loratadine: {
        name: "Loratadine",
        category: "Allergy Relief",
        intro: "General educational information about loratadine, an antihistamine used to relieve common allergy symptoms.",
        overview: "Loratadine is an antihistamine commonly used to relieve symptoms caused by allergies. It is generally considered a non-drowsy antihistamine, although some people may still experience sleepiness.",
        uses: [
            "Relief of hay fever symptoms",
            "Relief of itchy and watery eyes",
            "Management of hives and itchy skin",
            "Relief of symptoms associated with insect bites and stings",
            "Relief of certain other allergic reactions"
        ],
        howItWorks: "Loratadine blocks the effects of histamine, a chemical released during an allergic reaction. This helps reduce symptoms such as sneezing, itching and a runny nose.",
        sideEffects: [
            "Headache",
            "Sleepiness or tiredness in some people",
            "Dry mouth",
            "Occasional dizziness"
        ],
        precautions: [
            "Although generally considered non-drowsy, it can cause sleepiness in some people.",
            "Avoid driving or operating machinery if you feel sleepy.",
            "Consult a healthcare professional if pregnant or breastfeeding.",
            "People with liver problems should seek professional advice before use.",
            "Check with a pharmacist about possible interactions with other medicines.",
            "Do not combine different antihistamines unless advised by a healthcare professional."
        ],
        guidance: "Consult a doctor or pharmacist if you are unsure whether loratadine is suitable for you, particularly if you have an existing medical condition or take other medicines.",
        sourceName: "NHS – About loratadine",
        sourceUrl: "https://www.nhs.uk/medicines/loratadine/about-loratadine/"
    }
    ,
    ors: {
        name: "Oral Rehydration Salts (ORS)",
        category: "General Information",
        intro: "Educational information about oral rehydration salts and their role in preventing and managing dehydration.",
        overview: "Oral Rehydration Salts (ORS) are a mixture of glucose and electrolytes, including sodium and potassium. When dissolved in water as directed on the product, they help replace fluids and salts lost from the body.",
        uses: [
            "Helping prevent dehydration caused by diarrhoea",
            "Replacing fluids and electrolytes lost through vomiting",
            "Supporting fluid replacement during dehydration",
            "Helping maintain the body's fluid and electrolyte balance"
        ],
        howItWorks: "ORS contains glucose and electrolytes that help the intestines absorb water and sodium. This supports the replacement of fluids and salts lost by the body.",
        sideEffects: [
            "ORS is generally well tolerated when prepared and used correctly.",
            "Some people may experience nausea or vomiting.",
            "Stomach discomfort or bloating may occur in some cases."
        ],
        precautions: [
            "Prepare ORS using the exact water quantity stated on the product packaging.",
            "Do not add extra sugar or salt to the prepared solution.",
            "Seek professional advice if vomiting prevents you from keeping fluids down.",
            "People with kidney disease or other conditions affecting fluid and electrolyte balance should seek medical advice.",
            "Severe dehydration requires urgent medical assessment."
        ],
        guidance: "ORS supports fluid replacement but does not treat the underlying cause of diarrhoea or vomiting. Seek medical attention for severe dehydration, confusion, very little urine or worsening symptoms.",
        sourceName: "UCLH – Oral Rehydration Salts",
        sourceUrl: "https://www.uclh.nhs.uk/patients-and-visitors/patient-information-pages/oral-rehydration-salts"
    },

    antacids: {
        name: "Antacids",
        category: "General Information",
        intro: "General educational information about antacids, medicines commonly used for short-term relief from heartburn and indigestion.",
        overview: "Antacids are medicines that neutralise stomach acid. They are available in different formulations, including liquids and chewable tablets, and their ingredients can vary.",
        uses: [
            "Short-term relief from heartburn",
            "Relief from indigestion",
            "Relief from symptoms associated with acid reflux",
            "Relief from some symptoms of stomach irritation"
        ],
        howItWorks: "Antacids neutralise some of the acid present in the stomach, helping reduce the discomfort associated with heartburn and indigestion.",
        sideEffects: [
            "Diarrhoea or constipation",
            "Stomach cramps",
            "Feeling sick or vomiting",
            "Bloating or excess gas"
        ],
        precautions: [
            "Different antacid products contain different ingredients and may have different safety considerations.",
            "Antacids can affect how other medicines are absorbed.",
            "People with kidney, liver or heart conditions should seek professional advice.",
            "Consult a pharmacist before use during pregnancy or breastfeeding.",
            "Seek medical advice if symptoms occur frequently or persist.",
            "Do not rely on antacids to manage unexplained or severe abdominal or chest pain."
        ],
        guidance: "Antacids provide short-term symptom relief and do not necessarily treat the underlying cause. Consult a doctor or pharmacist if symptoms persist or you regularly need antacids.",
        sourceName: "NHS – Antacids",
        sourceUrl: "https://www.nhs.uk/medicines/antacids/"
    }

};

document.addEventListener("DOMContentLoaded", () => {
    const params = new URLSearchParams(window.location.search);
    const medicineKey = (params.get("medicine") || "").toLowerCase();
    const medicine = medicines[medicineKey];

    if (!medicine) {
        document.getElementById("medicine-name").textContent =
            "Medicine Information Unavailable";

        document.getElementById("medicine-intro").textContent =
            "We could not find information for this medicine. Please return to the Medicine Guide.";

        document.querySelector(".medicine-detail-content").hidden = true;
        return;
    }

    document.title = `${medicine.name} | MediSense AI`;

    document.getElementById("medicine-name").textContent = medicine.name;
    document.getElementById("breadcrumb-medicine").textContent = medicine.name;
    document.getElementById("medicine-category").textContent = medicine.category;
    document.getElementById("medicine-intro").textContent = medicine.intro;
    document.getElementById("medicine-overview").textContent = medicine.overview;
    document.getElementById("medicine-how-it-works").textContent = medicine.howItWorks;
    document.getElementById("medicine-guidance").textContent = medicine.guidance;

    function populateList(elementId, items) {
        const list = document.getElementById(elementId);

        items.forEach((item) => {
            const li = document.createElement("li");
            li.textContent = item;
            list.appendChild(li);
        });
    }

    populateList("medicine-uses", medicine.uses);
    populateList("medicine-side-effects", medicine.sideEffects);
    populateList("medicine-precautions", medicine.precautions);

    // Add the educational information source
    const source = document.createElement("p");
    source.className = "medicine-source";

    const sourceLink = document.createElement("a");
    sourceLink.href = medicine.sourceUrl;
    sourceLink.textContent = `Source: ${medicine.sourceName}`;
    sourceLink.target = "_blank";
    sourceLink.rel = "noopener noreferrer";

    source.appendChild(sourceLink);
    document.querySelector(".professional-guidance").appendChild(source);
});
