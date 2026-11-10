
document.addEventListener("DOMContentLoaded", () => {
    const searchInput = document.getElementById("remedy-search");
    const remedyCards = document.querySelectorAll(".remedy-card");
    const noResultsMessage = document.getElementById("no-remedies-message");

    function filterRemedies() {
        const searchText = searchInput.value.toLowerCase().trim();

        remedyCards.forEach((card) => {
            const remedyName =
                card.querySelector("h3").textContent.toLowerCase();

            const description =
                card.querySelector("p").textContent.toLowerCase();

            const keywords =
                card.dataset.category.toLowerCase();

            const matchesSearch =
                remedyName.includes(searchText) ||
                description.includes(searchText) ||
                keywords.includes(searchText);

            card.style.display = matchesSearch ? "flex" : "none";
        });

        const visibleCards = Array.from(remedyCards).filter(
            (card) => card.style.display !== "none"
        );

        noResultsMessage.hidden = visibleCards.length > 0;
    }

    searchInput.addEventListener("input", filterRemedies);
});
