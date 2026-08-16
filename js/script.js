// ========================================
// ARCADEVERSE - MAIN JAVASCRIPT
// ========================================


// ========================================
// BACK TO TOP BUTTON
// ========================================

const topBtn = document.getElementById("topBtn");

if (topBtn) {

    window.addEventListener("scroll", function () {

        if (
            document.body.scrollTop > 300 ||
            document.documentElement.scrollTop > 300
        ) {
            topBtn.style.display = "block";
        } else {
            topBtn.style.display = "none";
        }

    });

    topBtn.addEventListener("click", function () {

        window.scrollTo({
            top: 0,
            behavior: "smooth"
        });

    });

}


// ========================================
// GAME SEARCH + CATEGORIES
// ========================================

const searchBar = document.getElementById("searchBar");

const gameCards = document.querySelectorAll("[data-game]");

const categoryButtons =
    document.querySelectorAll(".category-card");

const noResults =
    document.getElementById("noResults");


// ========================================
// FILTER GAMES FUNCTION
// ========================================

function filterGames(category = "All") {

    // Get search text
    const query = searchBar
        ? searchBar.value.trim().toLowerCase()
        : "";

    let visibleCount = 0;


    // Check every game card
    gameCards.forEach(function (card) {

        // Get all text inside the card
        const text = card.textContent.toLowerCase();

        // Get category
        const cardCategory =
            card.dataset.category || "";


        // Check search
        const matchesSearch =
            text.includes(query);


        // Check category
        const matchesCategory =
            category === "All" ||
            cardCategory === category;


        // Show / hide card
        if (matchesSearch && matchesCategory) {

            card.classList.remove("hidden");

            visibleCount++;

        } else {

            card.classList.add("hidden");

        }

    });


    // Show "No results" message
    if (noResults) {

        if (visibleCount === 0) {
            noResults.classList.add("show");
        } else {
            noResults.classList.remove("show");
        }

    }

}


// ========================================
// SEARCH BAR
// ========================================

if (searchBar) {

    searchBar.addEventListener("input", function () {

        filterGames();

    });

}


// ========================================
// CATEGORY BUTTONS
// ========================================

categoryButtons.forEach(function (button) {

    button.addEventListener("click", function () {

        // Get selected category
        const category =
            button.dataset.category;


        // Remove active from all buttons
        categoryButtons.forEach(function (btn) {

            btn.classList.remove("active");

        });


        // Add active to clicked button
        button.classList.add("active");


        // Filter games
        filterGames(category);


        // Scroll to games section
        const featuredSection =
            document.getElementById("featured");

        if (featuredSection) {

            featuredSection.scrollIntoView({
                behavior: "smooth"
            });

        }

    });

});


// ========================================
// INITIAL GAME DISPLAY
// ========================================

filterGames();