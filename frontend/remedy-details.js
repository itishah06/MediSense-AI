
const remedies = {
    "cold-cough": {
        title: "Cold & Cough Care",
        intro: "General information about simple comfort measures that may help manage common cold and cough symptoms.",
        overview: "The common cold is usually caused by a viral infection and often improves on its own. Rest, fluids and simple comfort measures may help you feel better while recovering.",
        tips: [
            "Get adequate rest and allow your body time to recover.",
            "Drink enough fluids throughout the day.",
            "A warm lemon and honey drink may soothe a cough or sore throat.",
            "A clean humidifier may help with dry air and nasal discomfort.",
            "Saline nasal sprays may help relieve nasal congestion.",
            "Wash your hands regularly and cover your mouth when coughing or sneezing."
        ],
        precautions: [
            "Never give honey to children under 1 year of age.",
            "Avoid inhaling steam directly over a bowl of boiling water because of the risk of burns.",
            "Do not use antibiotics for a common cold unless prescribed for a diagnosed bacterial infection.",
            "Children may need age-specific advice before using cough or cold medicines.",
            "Home-care measures provide comfort but do not cure the underlying viral infection."
        ],
        warning: "Seek medical attention for difficulty breathing, chest pain, dehydration, persistent fever, worsening symptoms or a cough lasting more than 3 weeks. Seek urgent help for severe breathing difficulty.",
        guidance: "These measures are intended for general comfort during mild symptoms. Consult a healthcare professional if symptoms are severe, persistent or concerning.",
        sourceName: "CDC – Manage Common Cold",
        sourceUrl: "https://www.cdc.gov/common-cold/treatment/"
    },

    "digestive": {
        title: "Digestive Wellness",
        intro: "Explore general food, hydration and lifestyle habits that support digestive health.",
        overview: "Digestive health is influenced by eating habits, fluid intake, physical activity and individual food tolerance. Simple lifestyle habits may support digestion, but persistent digestive symptoms need professional assessment.",
        tips: [
            "Include a variety of fibre-rich foods such as fruits, vegetables, oats and whole grains.",
            "Drink enough water throughout the day.",
            "Eat meals at a comfortable pace and avoid rushing.",
            "Notice whether particular foods or drinks trigger discomfort.",
            "Limit foods that personally worsen symptoms, such as very fatty or spicy foods.",
            "Maintain regular physical activity as part of a healthy lifestyle."
        ],
        precautions: [
            "Increase dietary fibre gradually rather than making sudden large changes.",
            "Food triggers differ from person to person.",
            "Do not follow restrictive diets without appropriate professional guidance.",
            "Avoid assuming that persistent abdominal pain is ordinary indigestion.",
            "People with existing digestive conditions should follow their clinician's advice."
        ],
        warning: "Seek medical attention for severe or persistent abdominal pain, repeated vomiting, blood in vomit or stool, black stools, unexplained weight loss or difficulty swallowing. Sudden severe abdominal pain requires urgent assessment.",
        guidance: "These are general digestive wellness suggestions, not treatment for a digestive disorder. Consult a doctor or dietitian if symptoms persist or interfere with daily life.",
        sourceName: "NHS – Good Foods to Help Your Digestion",
        sourceUrl: "https://www.nhs.uk/live-well/eat-well/digestive-health/good-foods-to-help-your-digestion/"
    },

    "skin-care": {
        title: "Basic Skin Care",
        intro: "Learn about everyday skin hygiene and simple practices that support healthy skin.",
        overview: "Basic skin care includes keeping the skin clean, avoiding unnecessary irritation and protecting it from excessive sun exposure. Skin needs can differ depending on age, skin type and existing conditions.",
        tips: [
            "Clean your skin gently using products suitable for your skin type.",
            "Avoid excessive scrubbing or harsh products that cause irritation.",
            "Use a suitable moisturiser when your skin feels dry.",
            "Avoid sharing personal items such as towels and razors.",
            "Protect exposed skin from excessive sunlight.",
            "Keep hands clean and avoid picking or scratching irritated skin."
        ],
        precautions: [
            "Stop using a product if it causes significant irritation or an allergic reaction.",
            "Do not apply household chemicals or unverified substances to the skin.",
            "Avoid squeezing spots or picking at skin lesions.",
            "Use products according to their labels and seek professional advice if unsure.",
            "Do not assume that every rash or skin change can be managed at home."
        ],
        warning: "Seek medical advice for a spreading or persistent rash, signs of skin infection, a changing mole, unexplained skin lesions or symptoms that are worsening. Seek urgent help for a severe allergic reaction involving breathing difficulty or swelling of the tongue or throat.",
        guidance: "Skin-care needs vary. A dermatologist or qualified healthcare professional can assess persistent skin problems and recommend suitable care.",
        sourceName: "NHS – Skin Conditions",
        sourceUrl: "https://www.nhs.uk/conditions/"
    },

    "hydration": {
        title: "Hydration Tips",
        intro: "Understand the importance of fluids and everyday habits that help maintain hydration.",
        overview: "The body needs water and other fluids to function properly. Fluid requirements vary depending on age, activity, health conditions, climate and other individual factors.",
        tips: [
            "Drink fluids regularly throughout the day.",
            "Keep drinking water easily accessible.",
            "Include water-rich foods such as fruits and vegetables.",
            "Pay attention to thirst and changes in urine colour.",
            "Remember that hot weather and physical activity can increase fluid needs.",
            "Take small, frequent sips if you feel nauseated."
        ],
        precautions: [
            "Fluid requirements differ between individuals.",
            "People with kidney, heart or other conditions affecting fluid balance may have specific fluid restrictions.",
            "Do not force excessive amounts of water.",
            "Babies, young children and older adults may be more vulnerable to dehydration.",
            "Follow medical advice if you have been given a specific fluid plan."
        ],
        warning: "Seek medical attention for persistent dizziness, unusually dark urine, reduced urination or unusual tiredness. Confusion, fainting or severe weakness may indicate a serious problem and require urgent assessment.",
        guidance: "Hydration guidance should be adjusted to individual health needs. A healthcare professional can advise people who have conditions affecting fluid balance.",
        sourceName: "NHS – Water, Drinks and Hydration",
        sourceUrl: "https://www.nhs.uk/live-well/eat-well/food-guidelines-and-food-labels/water-drinks-nutrition/"
    },

    "wellness": {
        title: "Everyday Wellness",
        intro: "Discover everyday lifestyle habits that support physical and mental wellbeing.",
        overview: "Wellbeing involves several aspects of daily life, including nutrition, physical activity, sleep, mental health and social connection. Small, consistent habits can contribute to overall health.",
        tips: [
            "Eat a varied and balanced diet.",
            "Include regular physical activity that suits your abilities.",
            "Maintain a consistent sleep routine.",
            "Make time for relaxation and activities you enjoy.",
            "Stay connected with friends, family and supportive communities.",
            "Avoid tobacco and other harmful substances.",
            "Make time for routine health check-ups when appropriate."
        ],
        precautions: [
            "Choose activities that match your fitness level and physical abilities.",
            "Increase exercise gradually rather than making sudden intense changes.",
            "Allow adequate time for rest and recovery.",
            "Avoid comparing your health progress with other people.",
            "Seek professional support if physical or emotional difficulties persist."
        ],
        warning: "Seek professional support for persistent fatigue, unexplained physical changes, ongoing sleep difficulties or emotional distress. Get urgent help if you experience severe or sudden symptoms.",
        guidance: "Wellness habits support general health but do not replace preventive healthcare, medical assessment or treatment when needed.",
        sourceName: "WHO – Self-Care for Health and Well-Being",
        sourceUrl: "https://www.who.int/news-room/fact-sheets/detail/self-care-health-interventions/"
    }
};

document.addEventListener("DOMContentLoaded", () => {
    const params = new URLSearchParams(window.location.search);
    const remedyKey = (params.get("remedy") || "").toLowerCase();
    const remedy = remedies[remedyKey];

    const detailContainer = document.querySelector(
        ".remedy-detail-container"
    );

    if (!remedy) {
        document.getElementById("remedy-title").textContent =
            "Information Unavailable";

        document.getElementById("remedy-intro").textContent =
            "We could not find information for this topic. Please return to Home Remedies.";

        detailContainer.hidden = true;
        return;
    }

    document.title = `${remedy.title} | MediSense AI`;

    document.getElementById("remedy-title").textContent = remedy.title;
    document.getElementById("breadcrumb-remedy").textContent = remedy.title;
    document.getElementById("remedy-intro").textContent = remedy.intro;
    document.getElementById("remedy-overview").textContent = remedy.overview;
    document.getElementById("remedy-warning").textContent = remedy.warning;
    document.getElementById("remedy-guidance").textContent = remedy.guidance;

    function populateList(elementId, items) {
        const list = document.getElementById(elementId);

        items.forEach((item) => {
            const li = document.createElement("li");
            li.textContent = item;
            list.appendChild(li);
        });
    }

    populateList("remedy-tips", remedy.tips);
    populateList("remedy-precautions", remedy.precautions);

    // Add the educational source link
    const sourceContainer = document.getElementById("remedy-source");

    const sourceLink = document.createElement("a");
    sourceLink.href = remedy.sourceUrl;
    sourceLink.textContent = `Source: ${remedy.sourceName}`;
    sourceLink.target = "_blank";
    sourceLink.rel = "noopener noreferrer";

    sourceContainer.appendChild(sourceLink);
});
