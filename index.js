"use strict";

const btn = document.querySelector(".search");
const foodContainer = document.querySelector(".foodContainer");

btn.addEventListener("click", () => {
  let userInput = document.getElementById("foods").value;
  if (userInput.length == 0) {
    foodContainer.innerHTML = `<h3>Input field cannot be empty</h3>`;
  } else {
    const request = new XMLHttpRequest();
    request.open(
      "GET",
      `https://www.themealdb.com/api/json/v1/1/search.php?s=${userInput}`
    );
    request.send();

    request.addEventListener("load", function () {
      const data = JSON.parse(this.responseText);
      console.log(data.meals);

      if (!data.meals) {
        foodContainer.innerHTML = `<h3>No meals found for "${userInput}"</h3>`;
        return;
      }

      let myMeals = data.meals[0];

      let ingredients = [];
      let count = 1;
      for (let i in myMeals) {
        let ing = "";
        let measure = "";
        if (i.startsWith("strIngredient") && myMeals[i]) {
          ing = myMeals[i];
          measure = myMeals[`strMeasure${count}`]; 
          count += 1;
          ingredients.push(`${measure} ${ing}`);
        }
      }

      foodContainer.innerHTML = `
        <img src=${myMeals.strMealThumb} alt="Meal Image">
        <div class="details">
          <h2>${myMeals.strMeal}</h2>
          <h2>${myMeals.strArea}</h2>
        </div>
        <div id="ingredient"></div>
        <div id="recipeHide">
          <button id="hide-recipe">X</button>
          <pre id="instruction">
          <img src=${myMeals.strMealThumb} alt="Meal Image">
          ${myMeals.strInstructions}</pre>
        </div>
        <button id="show-recipe">View Recipe</button>
      `;

      let ingredientContent = document.getElementById("ingredient");
      let parent = document.createElement("ul");
      let recipeHide = document.getElementById("recipeHide");
      let hideBtn = document.getElementById("hide-recipe");
      let showRecipe = document.getElementById("show-recipe");

      ingredients.forEach((i) => {
        let child = document.createElement("li");
        child.innerText = i;
        parent.appendChild(child);
        ingredientContent.appendChild(parent);
      });

      hideBtn.addEventListener("click", () => {
        recipeHide.style.display = "none";
      });
      showRecipe.addEventListener("click", () => {
        recipeHide.style.display = "block";
        
      });
    });
  }
});

