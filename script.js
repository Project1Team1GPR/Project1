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
var caloriesPerMinute = 1 
var userSelectedActivity = "";

// step 1- user selects recipe, user gets # of calories needed to be burned - api spoon
// Step 2- user selects activity type from drop down list
// Step 3- user inputs weight
// step 2 and 3 data weight and activity -- use api cal lto api ninjas -- trying to get the number of cals burned / min based on user's weight and selected activity

// Update Project Flow
// 1. Collect User Info - profile should welcome user back or give option to update user info
// 2. Search for recipe
// 3. Select recipe
// 4. take total cals from selected recipe to help determine total duration of selected activity



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
      data.activities.unshift("--Pick an Activity--");
      data.activities.forEach(function (activity) {
        var option = document.createElement("option");
        option.value = activity;
        option.text = activity;
        userActivitySelect.appendChild(option);
      });
    });
}
activityList();

userActivitySelect.addEventListener("change", function(event){
  event.preventDefault();
  console.log(event.target.value);

  var caloriesBurnedUrl = `https://api.api-ninjas.com/v1/caloriesburned?activity=${event.target.value.substring(1)}&duration=60&weight=200`;

  // var userWeight = userWeightInput.value;
  
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
      <p>It will take ${Math.round(recipe.calories / caloriesPerMinute)} minutes of ${userActivitySelect.value} to burn of this meal</p>
      <button data-id="${recipe.id}">Ingrediens</button>
      <div data-ingr="${recipe.id}" id="recipeIngredientList"></div>
      `;

      // DELETE
      // <p>Calories Burned per Minute for Selected Activity: ${caloriesPerMinute ? caloriesPerMinute.toFixed(2) : 'Select an activity'}</p>

      

    recipeResultsEl.appendChild(recipeEl);
    console.log(recipe);
  });
}

// convert ingredient amount to fractions
function displayIngredientsList(ingredients, recipeId) {
  console.log(ingredients.ingredients);
  var ingredientListEl = $(`[data-ingr='${recipeId}']`);
  var ul = document.createElement("ul");
  ingredients.ingredients.forEach((ingredient) => {
    var li = document.createElement("li");
    li.textContent = `${ingredient.amount} ${ingredient.unit} ${ingredient.name}`;
    ul.appendChild(li);
  });
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
  displayIngredientsList(ingredients, recipeId);
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

// submit recipe button on click
submitRecipeButtonEl.addEventListener("click", async function (event) {
  event.preventDefault();
  console.log("Submitted Recipe");

  var recipeQuery = document.getElementById("recipeInput").value;

  searchRecipesByQuery(recipeQuery).then(function (recipes) {
    recipeResultsEl = document.getElementById("recipeResults");
    appendRecipeResults(recipeResultsEl, recipes.results);
    console.log(recipes);
  });
});

  


// DELETE BELOW
// attempting to get calories displayed on screen
// async function getCaloriesByRecipeId(id) {
//   var nutritionUrl = `https://api.spoonacular.com/recipes/${id}/nutritionWidget.json?apiKey=63c92a06cbdb4547b9f28e0fcbc3c5c3`;

//   try {
//     const response = await fetch(nutritionUrl);
//     const data = await response.json();
//     return data.calories;
//   } catch (error) {
//     console.error("error fetching nutrition information:", error);
//     return "no data";
//   }
// }


// const activitySelect = document.getElementById("activitySelect");
// const caloriesDisplay = document.getElementById("caloriesDisplay");

// Function to fetch and display calories burned per hour for the selected activity
// function displayCaloriesBurned(event) {
//   const selectedActivity = userActivitySelect.value;

//   if (selectedActivity) {
//     const url = `https://api.api-ninjas.com/v1/caloriesburned?activity=${selectedActivity}&duration=60&weight=200`; // Assuming a default weight of 200 lbs

//     fetch(url, {
//       headers: {
//         "X-Api-Key": "Wjicx6SkiBem7pplQibm7g==wVPkDcY9lX6RAcn0",
//       },
//     })
//       .then((response) => response.json())
//       .then((data) => {
//         const caloriesPerHour = data[0]?.calories_per_hour || 0;
//         caloriesDisplay.textContent = `Calories Burned per Hour: ${caloriesPerHour}`;
//       })
//       .catch((error) => {
//         console.error("Error fetching calories burned per hour:", error);
//         caloriesDisplay.textContent = "Failed to fetch data";
//       });
//   } else {
//     caloriesDisplay.textContent = "Please select an activity";
//   }
// }

// Event listener for activity selection
// userActivitySelect.addEventListener("change", displayCaloriesBurned);

// var selectedActivity = userActivitySelect.value;
// var userWeight = userWeightInput.value;

// function allInputs() {
//   console.log("allInputs Works");
//   // get recipe cals from api call

//   // api call to get cals burned per min for the selected activity

//   var url = `https://api.api-ninjas.com/v1/caloriesburned?activity=${activity}&duration=60&weight=${userWeight}`;
//   // var selectedActivity = userActivitySelect.value;
//   // var userWeight = userWeightInput.value;
  
//   fetch(url, {
//     headers: {
//       "X-Api-Key": "Wjicx6SkiBem7pplQibm7g==wVPkDcY9lX6RAcn0",
//     },
//   })
//     .then(function (response) {
//       return response.json();
//     })
//     .then(function (data) {
//       console.log(data);

//       if (!data.length) {
//         console.log("No results found");
//         resultEl.textContent = "No Results Found";
//       } else {
//         resultEl.textContent = "";

//         for (let i = 0; i < data.length; i++) {
//           var activityName = data[i].activities;
//           var activityEl = document.createElement("h3");
//           activityEl.textContent = `Activity: ${activityName}`;
//           resultEl.appendChild(activityEl);

//           var caloriesBurned = data[i].calories_per_hour;
//           var calorieEl = document.createElement("p");
//           calorieEl.textContent = `Calories Burned: ${caloriesBurned}`;
//           resultEl.appendChild(calorieEl);
//         }
//       }

//       //   .catch(function (error) {
//       //     console.error('error:', error);
//       //     activityEl.textContent = 'cannot retrieve data';

//       // })
//     });

//   // then users weight
// }

// allInputs(calories, selectedActivity, userWeight);

// function calcActivityDuration(calsBurnedPerMin, calories = 1000) {
//   return calories / calsBurnedPerMin;
// }

// function searchActivityData(userInput) {
//   var url = `https://api.api-ninjas.com/v1/caloriesburned?activity=ski&duration=60&weight=200`;
//   fetch(url, {
//     headers: {
//       "X-Api-Key": "Wjicx6SkiBem7pplQibm7g==wVPkDcY9lX6RAcn0",
//     },
//   })
//     .then(function (response) {
//       return response.json();
//     })
//     .then(function (data) {
//       console.log(data);
//       activity.textContent = data;

//       if (!data.length) {
//         console.log("No results found");
//         activity.textContent = "No Results Found";
//       } else {
//         activity.textContent = "";
//         for (let i = 0; i < data.length; i++) {
//           var activityName = data[i].name;
//           var activityEl = document.createElement("h3");
//           activityEl.textContent = `Activity: ${activityName}`;
//           activity.appendChild(activityEl);

//           var caloriesBurned = data[i].total_calories;
//           var calorieEl = document.createElement("p");
//           calorieEl.textContent = `Calories Burned: ${caloriesBurned}`;
//           activity.appendChild(calorieEl);

//           var activityDuration = data[i].duration_minutes;
//           var durationEl = document.createElement("p");
//           durationEl.textContent = `Activity Duration: ${activityDuration} min`;
//           activity.appendChild(durationEl);
//         }
//       }
//     });
// }

// submit activity button on click
// submitActivityButtonEl.addEventListener("click", function (event) {
//   event.preventDefault();
//   console.log("Submit Activity");
//   allInputs();
// });
