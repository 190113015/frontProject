const API_KEY = "24effeb1feaf4bebb5d86641e9ee93fd";
const searchInput = document.getElementById("search");
const recipeGrid = document.getElementById("recipeGrid");
const recipeModal = document.getElementById("recipeModal");
const addToFavoritesButton = document.getElementById("addToFavorites");
let selectedRecipe = null;

searchInput.addEventListener("input", (e) => {
  const query = e.target.value;
  if (query.length > 2) {
    searchRecipes(query);
  } else {
    recipeGrid.innerHTML = "";
  }
});

async function searchRecipes(query) {
  const response = await fetch(
    `https://api.spoonacular.com/recipes/complexSearch?query=${query}&apiKey=${API_KEY}&number=9`
  );
  const data = await response.json();
  displayRecipes(data.results);
}

function displayRecipes(recipes) {
  recipeGrid.innerHTML = "";
  recipes.forEach((recipe) => {
    const recipeCard = document.createElement("div");
    recipeCard.classList.add("recipe-card");
    recipeCard.innerHTML = `
            <img src="https://spoonacular.com/recipeImages/${recipe.id}-312x231.jpg" alt="${recipe.title}">
            <h3>${recipe.title}</h3>
            <p>Prep Time: ${recipe.readyInMinutes} minutes</p>
        `;
    recipeCard.addEventListener("click", () => {
      showRecipeDetails(recipe.id);
    });
    recipeGrid.appendChild(recipeCard);
  });
}

async function showRecipeDetails(recipeId) {
  const response = await fetch(
    `https://api.spoonacular.com/recipes/${recipeId}/information?apiKey=${API_KEY}`
  );
  const data = await response.json();
  selectedRecipe = data;

  document.getElementById("recipeTitle").innerText = data.title;
  document.getElementById("recipeImage").src = data.image;
  const ingredientsList = document.getElementById("ingredientsList");
  ingredientsList.innerHTML = "";
  data.extendedIngredients.forEach((ingredient) => {
    const li = document.createElement("li");
    li.innerText = `${JSON.stringify(ingredient.name)}`;
    ingredientsList.appendChild(li);
  });

  const instructionsList = document.getElementById("instructionsList");
  instructionsList.innerHTML = "";
  data.analyzedInstructions[0].steps.forEach((step) => {
    const li = document.createElement("li");
    li.innerText = step.step;
    instructionsList.appendChild(li);
  });

  recipeModal.style.display = "block";
}

function closeModal() {
  recipeModal.style.display = "none";
}

addToFavoritesButton.addEventListener("click", () => {
  if (selectedRecipe) {
    addToFavorites(selectedRecipe);
  }
});

function addToFavorites(recipe) {
  let favorites = JSON.parse(localStorage.getItem("favorites")) || [];
  favorites.push(recipe);
  localStorage.setItem("favorites", JSON.stringify(favorites));
  alert("Recipe added to Favorites!");
}
