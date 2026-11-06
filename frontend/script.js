// Get all homepage service cards
const diseaseCard = document.getElementById("disease-prediction-card");
const medicineCard = document.getElementById("medicine-suggestions-card");
const remediesCard = document.getElementById("home-remedies-card");
const doctorsCard = document.getElementById("find-doctors-card");

// Make cards ready for future page navigation
function showComingSoon(featureName) {
    alert(featureName + " page is coming soon!");
}

diseaseCard.addEventListener("click", function () {
    showComingSoon("AI Disease Prediction");
});

medicineCard.addEventListener("click", function () {
    showComingSoon("Medicine Suggestions");
});

remediesCard.addEventListener("click", function () {
    showComingSoon("Home Remedies");
});

doctorsCard.addEventListener("click", function () {
    showComingSoon("Find Nearby Doctors");
});