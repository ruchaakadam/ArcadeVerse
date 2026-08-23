// =========================================
// ARCADEVERSE HOMEPAGE
// Search • Filters • Mobile Menu • Top Button
// =========================================

const searchBar = document.getElementById("searchBar");
const clearSearch = document.getElementById("clearSearch");
const filterButtons = document.querySelectorAll(".filter-btn");
const categoryCards = document.querySelectorAll(".category-card");
const gameCards = document.querySelectorAll(".game-card");
const noResults = document.getElementById("noResults");
const resetFilters = document.getElementById("resetFilters");
const visibleCount = document.getElementById("visibleCount");
const heroGameCount = document.getElementById("heroGameCount");
const statGames = document.getElementById("statGames");
const topBtn = document.getElementById("topBtn");
const menuToggle = document.getElementById("menuToggle");
const navLinks = document.getElementById("navLinks");

let activeCategory = "all";

const totalGames = gameCards.length;
heroGameCount.textContent = totalGames;
statGames.textContent = totalGames;
visibleCount.textContent = totalGames;

function filterGames() {
    const query = searchBar.value.trim().toLowerCase();
    let shown = 0;

    gameCards.forEach(card => {
        const name = card.dataset.name.toLowerCase();
        const categories = card.dataset.category.toLowerCase().split(" ");
        const matchesSearch = !query || name.includes(query);
        const matchesCategory = activeCategory === "all" || categories.includes(activeCategory);
        const shouldShow = matchesSearch && matchesCategory;

        card.style.display = shouldShow ? "block" : "none";
        if (shouldShow) shown++;
    });

    visibleCount.textContent = shown;
    noResults.hidden = shown !== 0;
    clearSearch.style.display = searchBar.value ? "block" : "none";
}

function setCategory(category) {
    activeCategory = category;

    filterButtons.forEach(button => {
        button.classList.toggle("active", button.dataset.category === category);
    });

    filterGames();
}

searchBar.addEventListener("input", filterGames);

clearSearch.addEventListener("click", () => {
    searchBar.value = "";
    filterGames();
    searchBar.focus();
});

filterButtons.forEach(button => {
    button.addEventListener("click", () => setCategory(button.dataset.category));
});

categoryCards.forEach(card => {
    card.addEventListener("click", () => {
        setCategory(card.dataset.categoryJump);
        document.getElementById("games").scrollIntoView({ behavior: "smooth" });
    });
});

resetFilters.addEventListener("click", () => {
    searchBar.value = "";
    setCategory("all");
});

menuToggle.addEventListener("click", () => {
    navLinks.classList.toggle("open");
});

navLinks.querySelectorAll("a").forEach(link => {
    link.addEventListener("click", () => navLinks.classList.remove("open"));
});

window.addEventListener("scroll", () => {
    topBtn.style.display = window.scrollY > 500 ? "block" : "none";
});

topBtn.addEventListener("click", () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
});
