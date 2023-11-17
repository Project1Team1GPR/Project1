var activity = document.getElementById("activity");
// var userActivityInput = document.getElementById("userActivity");
var submitButtonEl = document.getElementById("submitButton");
var userActivitySelect = document.getElementById("activitySelect");
// var submitActivityButtonEl = document.getElementById("activitySubmitButton");
var submitRecipeButtonEl = document.getElementById("recipeSubmitButton");
var userWeightInput = document.getElementById("weight");
// var durationEl = document.getElementById("duration");
var resultEl = document.getElementById("result");
// var calories = 1000;
var recipeSelect = document.getElementById("recipeSelect");
var caloriesPerMinute = 1;
var userSelectedActivity = "";
var userInfoButtonEl = document.getElementById("userInfoButton");
var userNameEl = document.getElementById("userName");
var userWeightEl = document.getElementById("userWeight");
var userNameInput = "";
var userWeightInput = "";
var recipeResultsEl = document.getElementById("recipeResults");
var welcomeUserEl = document.getElementById("welcomeUser");
var userPersonalInfo = document.getElementById("personalInfo");


// step 1- user selects recipe, user gets # of calories needed to be burned - api spoon
// Step 2- user selects activity type from drop down list
// Step 3- user inputs weight
// step 2 and 3 data weight and activity -- use api cal lto api ninjas -- trying to get the number of cals burned / min based on user's weight and selected activity

// Update Project Flow
// 1. Collect User Info - profile should welcome user back or give option to update user info
// 2. Search for recipe
// 3. Select recipe
// 4. take total cals from selected recipe to help determine total duration of selected activity

// Things to make this better with time:
// Have all of the submitted info under one event listener.. the submit recipe button (if statments or else error message)

// Function to display the welcome message
function displayWelcomeMessage() {
  // Retrieve user information from localStorage
  const userInfo = JSON.parse(localStorage.getItem("userInfo"));

  // Check if userInfo exists
  if (userInfo && userInfo.length > 0) {
    const [userName] = userInfo; // Extracting the user's name

    // Update the HTML element to display the welcome message
    const welcomeMessage = document.getElementById("welcomeMessage");
    welcomeMessage.textContent = `Welcome, ${userName}!`; // Update with the user's name

  }
}


// Function to check if user's name and weight are entered
function isUserInfoEntered() {
  const userInfo = JSON.parse(localStorage.getItem("userInfo"));
  return userInfo && userInfo[0] && userInfo[1];
}

// Function to display an error message
function displayErrorMessage(message) {
  const errorDiv = document.createElement("div");
  errorDiv.textContent = message;
  errorDiv.style.color = "red";
  document.body.insertBefore(errorDiv, document.body.firstChild);
  setTimeout(() => errorDiv.remove(), 3000); // Remove the message after 3 seconds
}

// Modify the event listener for submitRecipeButtonEl
submitRecipeButtonEl.addEventListener("click", async function (event) {
  event.preventDefault();

  // Check if user info is entered
  if (!isUserInfoEntered()) {
    displayErrorMessage("Please input name and weight first");
    return; // Stop the function if no user info
  }

  // ... rest of the code for handling recipe submission ...
});

// Similar check can be applied to other event listeners where user info is required

// Call the function to display the welcome message when the page loads
// document.addEventListener('DOMContentLoaded', function() {
//   displayWelcomeMessage();
// });

window.addEventListener("load", displayWelcomeMessage);

function activityList() {
  var exerciseListUrl = `https://api.api-ninjas.com/v1/caloriesburnedactivities`;

  fetch(exerciseListUrl, {
    headers: {
      "X-Api-Key": "Wjicx6SkiBem7pplQibm7g==wVPkDcY9lX6RAcn0",
    },
  })
    .then(function (response) {
      return response.json();
    })
    .then(function (data) {
      console.log(data);
      // add a placeholder to activity list to the start
      // data.activities.unshift("--Pick an Activity--");
      data.activities.forEach(function (activity) {
        var option = document.createElement("option");
        option.value = activity;
        option.text = activity;
        userActivitySelect.appendChild(option);
      });
    });
}
activityList();

userInfoButtonEl.addEventListener("click", function (event) {
  event.preventDefault();
  console.log("Save Info");
  var userInfo = [
    (userNameInput = userNameEl.value),
    (userWeightInput = userWeightEl.value),
  ];

  // updated local storage
  localStorage.setItem("userInfo", JSON.stringify(userInfo));
});

userActivitySelect.addEventListener("change", function (event) {
  event.preventDefault();
  console.log(event.target.value);
  
  var userWeightFromStorage = localStorage.getItem("userInfo");

  if (userWeightFromStorage) {
    var userWeight = JSON.parse(userWeightFromStorage)[1];
   } else {
    // If the user weight is missing, show a message on the browser
    var weightErrorMessage = document.createElement("div");
    weightErrorMessage.textContent = "Please fill out your name and weight.";
    weightErrorMessage.style.color = "red";
    document.body.appendChild(weightErrorMessage);
    console.error("User weight is missing");

    var personalInfoInput =
      document.getElementById("userName").parentNode;
    personalInfoInput.insertBefore(weightErrorMessage, personalInfoInput.firstChild);

   }
console.log(userWeight);
  var caloriesBurnedUrl = `https://api.api-ninjas.com/v1/caloriesburned?activity=${event.target.value.substring(1)}&duration=60&weight=${userWeight}`;

  
  fetch(caloriesBurnedUrl, {
    headers: {
      "X-Api-Key": "Wjicx6SkiBem7pplQibm7g==wVPkDcY9lX6RAcn0",
    },
  })
    .then(function (response) {
      return response.json();
    })
    .then(function (data) {
      console.log(data);
      // calculate calories per minute
      caloriesPerMinute = data[0].calories_per_hour / 60;
      userSelectedActivity = userActivitySelect.value;
      console.log(userSelectedActivity);
    });
});

async function searchRecipesByQuery(query) {
  var apiKey = "63c92a06cbdb4547b9f28e0fcbc3c5c3";
  var url = `https://api.spoonacular.com/recipes/complexSearch?query=${query}&number=5&apiKey=63c92a06cbdb4547b9f28e0fcbc3c5c3`;

  const response = await fetch(url);
  let data = await response.json();

  for (let i = 0; i < data.results.length; i++) {
    let id = data.results[i].id;
    const nutritionData = await getCaloriesByRecipeId(id);
    console.log(nutritionData);
    data.results[i].calories = nutritionData.calories;
  }
  return data;
}

async function getCaloriesByRecipeId(id) {
  var nutritionUrl = `https://api.spoonacular.com/recipes/${id}/nutritionWidget.json`;
  const response2 = await fetch(nutritionUrl, {
    method: "GET",
    headers: {
      "x-api-key": "63c92a06cbdb4547b9f28e0fcbc3c5c3",
    },
  });
  const nutritionData = await response2.json();
  console.log(nutritionData);
  console.log(nutritionData.calories + "calories");

  return nutritionData;
}
function appendRecipeResults(recipeResultsEl, recipes) {
  recipes.forEach(function (recipe) {
    console.log(recipe);
    var recipeEl = document.createElement("div");
    recipeEl.innerHTML = `
    <div><b>${recipe.title}</b></div>
      <img src="${recipe.image}">
      <p>Total Calories: ${recipe.calories}</p>
      <p>It will take ${Math.round(
        recipe.calories / caloriesPerMinute
      )} minutes of ${userActivitySelect.value} to burn of this meal.</p>
      <button data-id="${recipe.id}">Ingredients</button>
      <div data-ingr="${recipe.id}" id="recipeIngredientList"></div>
      `;

    // DELETE
    // <p>Calories Burned per Minute for Selected Activity: ${caloriesPerMinute ? caloriesPerMinute.toFixed(2) : 'Select an activity'}</p>

    recipeResultsEl.appendChild(recipeEl);
    console.log(recipe);
  });
}

// convert ingredient amount to fractions
function displayIngredientsList(ingredients, recipeId, recipeUrl) {
  console.log(ingredients.ingredients);
  var ingredientListEl = $(`[data-ingr='${recipeId}']`); //jquery selector for div of listofingredients
  var ul = document.createElement("ul");
  if (ingredientListEl.children().length > 0) {
    //check if ul in div
    ingredientListEl.toggle(); //toggle show or hide
    return; //nothing more to do
  }
  ingredients.ingredients.forEach((ingredient) => {
    var li = document.createElement("li");
    li.textContent = `${ingredient.amount} ${ingredient.unit} ${ingredient.name}`;
    ul.appendChild(li);

    
  });
  var selectedRecipeUrl = `<a href=${recipeUrl} target=blank>Click here for full recipe</a>`
  var urlLi = document.createElement('li')
  urlLi.innerHTML = selectedRecipeUrl
  ingredientListEl.append(urlLi)
  ingredientListEl.append(ul);

}

// event listener for ingredients
// find a way to consolidate this function & getCaloriesByRecipeId!! CLEAN UP
$("#recipeResults").on("click", "button", async function (event) {
  event.preventDefault();
  var recipeId = $(event.target).data("id");
  console.log(recipeId);

  var ingredients = await getIngredientsById(recipeId);
  // console.log(ingredients.ingredients);
  var recipeUrl = await getHowToUrl(recipeId);
  displayIngredientsList(ingredients, recipeId, recipeUrl);
});

async function getIngredientsById(id) {
  var nutritionUrl = `https://api.spoonacular.com/recipes/${id}/nutritionWidget.json`;
  const response2 = await fetch(nutritionUrl, {
    method: "GET",
    headers: {
      "x-api-key": "63c92a06cbdb4547b9f28e0fcbc3c5c3",
    },
  });
  const nutritionData = await response2.json();

  return nutritionData;
}

async function getHowToUrl(id){
var howToMakeRecipeUrl = await fetch(`https://api.spoonacular.com/recipes/${id}/information?includeNutrition=false&apiKey=63c92a06cbdb4547b9f28e0fcbc3c5c3`);
var jsonhowToMakeRecipeUrl = await howToMakeRecipeUrl.json();
return(jsonhowToMakeRecipeUrl.sourceUrl);
}

// submit recipe button on click
submitRecipeButtonEl.addEventListener("click", async function (event) {
  event.preventDefault();
  // clear results so it doesn't keep duplicating them
  recipeResultsEl.innerHTML = "";
  console.log("Submitted Recipe");

  var recipeQuery = document.getElementById("recipeInput").value;

  // error messages if fields don't exist
  var errorMessage1 = document.getElementById("errorMessage1");
  var errorMessage2 = document.getElementById("errorMessage2");

  // check to see if error messages already exist
  if (!errorMessage1) {
    errorMessage1 = document.createElement("div");
    errorMessage1.id = "errorMessage1";
    errorMessage1.style.color = "red";
    errorMessage1.style.display = "none"; // Hide initially
    var activitySelectDiv =
      document.getElementById("activitySelect").parentNode;
    activitySelectDiv.insertBefore(errorMessage1, activitySelectDiv.firstChild);
  }

  if (!errorMessage2) {
    errorMessage2 = document.createElement("div");
    errorMessage2.id = "errorMessage2";
    errorMessage2.style.color = "red";
    errorMessage2.style.display = "none"; // Hide initially
    var recipeInputDiv = document.getElementById("recipeInput").parentNode;
    recipeInputDiv.insertBefore(errorMessage2, recipeInputDiv.firstChild);
  }

  // checkt to see if an activity has been selected
  if (userSelectedActivity.trim() === "") {
    errorMessage1.textContent = "Please select an activity to search.";
    // display the message
    errorMessage1.style.display = "block";
    // stop further execution
    return;
  }

  // check to see if the recipeQuery is not empty
  if (recipeQuery.trim() === "") {
    errorMessage2.textContent = "Please enter a recipe to search.";
    // display the message
    errorMessage2.style.display = "block";
    // stop further execution
    return;
  }

  searchRecipesByQuery(recipeQuery).then(function (recipes) {
    recipeResultsEl = document.getElementById("recipeResults");
    appendRecipeResults(recipeResultsEl, recipes.results);
    console.log(recipes);

    // hide the error message if it was displayed
    errorMessage1.style.display = "none";
    errorMessage2.style.display = "none";
  });
});





