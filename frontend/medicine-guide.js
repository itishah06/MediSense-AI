document.addEventListener("DOMContentLoaded", () => {
    const searchInput = document.getElementById("medicine-search");
    const filterButtons = document.querySelectorAll(".filter-btn");
    const medicineCards = document.querySelectorAll(".medicine-card");

    let activeCategory = "all";

    function filterMedicines() {
        const searchText = searchInput.value.toLowerCase().trim();

        medicineCards.forEach((card) => {
            const medicineName =
                card.querySelector("h3").textContent.toLowerCase();

            const medicineCategory =
                card.dataset.category;

            const description =
                card.querySelector("p").textContent.toLowerCase();

            const matchesSearch =
                medicineName.includes(searchText) ||
                description.includes(searchText) ||
                medicineCategory.includes(searchText);

            const matchesCategory =
                activeCategory === "all" ||
                medicineCategory === activeCategory;

            card.style.display =
                matchesSearch && matchesCategory ? "block" : "none";
        });
        const visibleCards = Array.from(medicineCards).filter(
    (card) => card.style.display !== "none"
);

document.getElementById("no-medicines-message").hidden =
    visibleCards.length > 0;
    }

    // Search medicines
    searchInput.addEventListener("input", filterMedicines);

    // Filter by category
    filterButtons.forEach((button) => {
        button.addEventListener("click", () => {
            filterButtons.forEach((btn) => {
                btn.classList.remove("active");
            });

            button.classList.add("active");

            activeCategory = button.dataset.category;

            filterMedicines();
        });
    });
});