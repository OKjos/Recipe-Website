//DOM element selectors
const searchBtn = document.getElementById("search-button");
const mealList = document.getElementById("meal");
const mealDetailsContent = document.querySelector('.meal-details-content');
const recipeCloseBtn = document.getElementById('recipe-close-btn');
const searchType = document.getElementById('search-type');

// Event listeners for search button and recipe button
searchBtn.addEventListener('click', getMealList);
document.addEventListener('click', function(e) {
    if (e.target.classList.contains('recipe-button')) {
        getMealRecipe(e);
    }
});

recipeCloseBtn.addEventListener('click', () => {
    mealDetailsContent.parentElement.classList.remove('showRecipe');
});

// Main function to fetch and display meal list
function getMealList() {
    let searchInputTxt = document.getElementById('search-input').value.trim();
    const searchBy = searchType.value;

    // API URL constructor based on search type
    let apiUrl;
    if (searchBy === 'category') {
        apiUrl = `https://www.themealdb.com/api/json/v1/1/filter.php?c=${searchInputTxt}`;
    } else if (searchBy === 'ingredient') {
        apiUrl = `https://www.themealdb.com/api/json/v1/1/filter.php?i=${searchInputTxt}`;
    } else {
        apiUrl = `https://www.themealdb.com/api/json/v1/1/search.php?s=${searchInputTxt}`;
    }

    // API fetch and meal list rendering
    fetch(apiUrl)
    .then(response => response.json())
    .then(data => {
        let html = "";
        if(data.meals) {
            // Meal card HTML generator
            data.meals.forEach(meal => {
                html += `
                    <div class="meal-item" data-id="${meal.idMeal}">
                        <div class="meal-img">
                            <img src="${meal.strMealThumb}" alt="food">
                        </div>
                        <div class="meal-name">
                            <h3>${meal.strMeal}</h3>
                            <a href="#" class="recipe-button">Get Recipe</a>
                            <button class="favorite-btn" data-id="${meal.idMeal}" title="Add to favorites">
                                <i class="${isFavorite(meal.idMeal) ? 'fas' : 'far'} fa-heart"></i>
                            </button>
                        </div>
                    </div>
                `;
            });
            mealList.classList.remove('notFound');
        } else {
            // No results handler
            html = "Sorry no recipe found.";
            mealList.classList.add("notFound");
        }

        mealList.innerHTML = html;
    });
}

// Function to fetch detailed recipe
function getMealRecipe(e) { 
    e.preventDefault();
    if(e.target.classList.contains('recipe-button')) {
        let mealItem = e.target.closest('.meal-item');
        // API call for single meal details
        fetch(`https://www.themealdb.com/api/json/v1/1/lookup.php?i=${mealItem.dataset.id}`)
        .then(response => response.json())
        .then(data => mealRecipeModal(data.meals));
    }
}

// Function to display recipe modal
function mealRecipeModal(meal) {
    meal = meal[0];
    // Modal content 
    let html = `
        <h2 class = "recipe-title">${meal.strMeal}</h2>
        <p class = "recipe-category">${meal.strCategory}</p>
        <div class = "recipe-instruct">
            <h3>Instructions:</h3>
            <p>${meal.strInstructions}</p>
        </div>
        <div class = "recipe-meal-img">
            <img src = "${meal.strMealThumb}" alt = "">
        </div>
        <div class = "recipe-link">
            <a href = "${meal.strYoutube}" target = "_blank">Watch Video</a>
        </div>
    `;
    mealDetailsContent.innerHTML = html;
    mealDetailsContent.parentElement.classList.add('showRecipe');
}

// Dark mode initialization and handlers
document.addEventListener('DOMContentLoaded', function() {
    const darkModeToggle = document.getElementById('darkModeToggle');
    const toggleText = document.querySelector('.toggle-text');

    const savedTheme = localStorage.getItem('theme');
    if (savedTheme === 'dark') {
        enableDarkMode();
    }

    // Dark mode toggle handler
    darkModeToggle.addEventListener('click', function() {
        if (document.body.getAttribute('data-theme') === 'dark') {
            disableDarkMode();
        } else {
            enableDarkMode();
        }
    });


    // Dark mode enabler function
    function enableDarkMode() {
        document.body.setAttribute('data-theme', 'dark');
        toggleText.textContent = 'Light Mode';
        localStorage.setItem('theme', 'dark');
    }
    
    // Dark mode disabler function
    function disableDarkMode() {
        document.body.removeAttribute('data-theme');
        toggleText.textContent = 'Dark Mode'; 
        localStorage.removeItem('theme'); 
    }
    
});



