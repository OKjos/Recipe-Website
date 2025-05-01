// Favorites array and view state
let favorites = JSON.parse(localStorage.getItem('favorites')) || [];
let showingFavorites = false;

// Toggle favorite status for a meal
function toggleFavorite(mealId) {
    const index = favorites.indexOf(mealId);
    if (index === -1) {
        favorites.push(mealId);
    } else {
        favorites.splice(index, 1);
        if (showingFavorites) {
            document.querySelector(`.meal-item[data-id="${mealId}"]`)?.remove();
            if (!favorites.length) {
                document.getElementById('meal').innerHTML = "You haven't favorited any meals yet.";
            }
        }
    }
    localStorage.setItem('favorites', JSON.stringify(favorites));
    updateFavoriteButton(mealId);
}

// Update favorite button appearance
function updateFavoriteButton(mealId) {
    const buttons = document.querySelectorAll(`.favorite-btn[data-id="${mealId}"]`);
    buttons.forEach(button => {
        const icon = button.querySelector('i');
        if (favorites.includes(mealId)) {
            icon.classList.replace('far', 'fas');
            button.title = 'Remove from favorites';
        } else {
            icon.classList.replace('fas', 'far');
            button.title = 'Add to favorites';
        }
    });
}

// Display favorite meals
function displayFavorites() {
    const mealList = document.getElementById('meal');
    if (!favorites.length) {
        mealList.innerHTML = "You haven't favorited any meals yet.";
        return;
    }

    mealList.innerHTML = '';
    
    favorites.forEach(mealId => {
        fetch(`https://www.themealdb.com/api/json/v1/1/lookup.php?i=${mealId}`)
            .then(response => response.json())
            .then(data => {
                const meal = data.meals[0];
                const mealElement = document.createElement('div');
                mealElement.className = 'meal-item';
                mealElement.dataset.id = meal.idMeal;
                mealElement.innerHTML = `
                    <div class="meal-img">
                        <img src="${meal.strMealThumb}" alt="food">
                    </div>
                    <div class="meal-name">
                        <h3>${meal.strMeal}</h3>
                        <a href="#" class="recipe-button">Get Recipe</a>
                        <button class="favorite-btn" data-id="${meal.idMeal}">
                            <i class="fas fa-heart"></i>
                        </button>
                    </div>
                `;
                mealList.appendChild(mealElement);
            });
    });
}

// Toggle between favorites view and all meals view
function toggleFavoritesView() {
    showingFavorites = !showingFavorites;
    const showFavoritesBtn = document.getElementById('show-favorites-btn');
    
    if (showingFavorites) {
        showFavoritesBtn.innerHTML = '<i class="fas fa-utensils"></i> View All Meals';
        showFavoritesBtn.classList.add('active');
        displayFavorites();
    } else {
        showFavoritesBtn.innerHTML = '<i class="fas fa-heart"></i> View Favorites';
        showFavoritesBtn.classList.remove('active');
        window.getMealList();
    }
}

// Check if meal is favorited
function isFavorite(mealId) {
    return favorites.includes(mealId);
}

// Delegated click handler for favorite buttons
document.addEventListener('click', function(e) {
    if (e.target.closest('.favorite-btn')) {
        e.preventDefault();
        const button = e.target.closest('.favorite-btn');
        toggleFavorite(button.dataset.id);
    }
});

// Favorites toggle button handler
document.getElementById('show-favorites-btn').addEventListener('click', toggleFavoritesView);