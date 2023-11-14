var activity = document.getElementById("activity");
var userActivityInput = document.getElementById("userActivity");
var submitButtonEl = document.getElementById("submitButton");
var userActivitySelect = document.getElementById("activitySelect");
var submitActivityButtonEl = document.getElementById("activitySubmitButton");
var submitRecipeButtonEl = document.getElementById("recipeSubmitButton");
var userWeightInput = document.getElementById("weight");
// var durationEl = document.getElementById("duration");
var resultEl = document.getElementById("result");
var calories = 1000;
var recipeSelect = document.getElementById("recipeSelect");

// step 1- user selects recipe, user gets # of calories needed to be burned - api spoon
// Step 2- user selects activity type from drop down list
// Step 3- user inputs weight
// step 2 and 3 data weight and activity -- use api cal lto api ninjas -- trying to get the number of cals burned / min based on user's weight and selected activity

//MONDAY PLAN: RECIPE API SET UP + DISPLAY
//SET VALUE PRE-POPULATED SHORT

function activityList() {
  var listUrl = `https://api.api-ninjas.com/v1/caloriesburnedactivities`;

  fetch(listUrl, {
    headers: {
      "X-Api-Key": "Wjicx6SkiBem7pplQibm7g==wVPkDcY9lX6RAcn0",
    },
  })
    .then(function (response) {
      return response.json();
    })
    .then(function (data) {
      console.log(data);
      data.activities.forEach(function (activity) {
        var option = document.createElement("option");
        option.value = activity;
        option.text = activity;
        userActivitySelect.appendChild(option);
      });
    });
}

activityList();

var recipeIdTest = "716429"; //need to find correct ID

async function searchRecipesByQuery(query) {
  var apiKey = "63c92a06cbdb4547b9f28e0fcbc3c5c3";
  var url = `https://api.spoonacular.com/recipes/complexSearch?query=${query}&apiKey=63c92a06cbdb4547b9f28e0fcbc3c5c3`;

  const response = await fetch(url);
  let data = await response.json();

  for (let i = 0; i < data.results.length; i++) {
    let id = data.results[i].id;
    const data2 = await getCaloriesByRecipeId(id);
    console.log(data2);
    data.results[i].calories = data2.calories;
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
  const data2 = await response2.json();

  console.log(data2.calories + "calories");

  return data2;
}

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

var selectedActivity = userActivitySelect.value;
var userWeight = userWeightInput.value;

function allInputs() {
  console.log("allInputs Works");
  // get recipe cals from api call

  // api call to get cals burned per min for the selected activity

  var url = `https://api.api-ninjas.com/v1/caloriesburned?activity=${activity}&duration=60&weight=${userWeight}`;
  fetch(url, {
    headers: {
      "X-Api-Key": "Wjicx6SkiBem7pplQibm7g==wVPkDcY9lX6RAcn0",
    },
  })
    .then(function (response) {
      return response.json();
    })
    .then(function (data) {
      console.log(data);

      if (!data.length) {
        console.log("No results found");
        resultEl.textContent = "No Results Found";
      } else {
        resultEl.textContent = "";

        for (let i = 0; i < data.length; i++) {
          var activityName = data[i].activities;
          var activityEl = document.createElement("h3");
          activityEl.textContent = `Activity: ${activityName}`;
          resultEl.appendChild(activityEl);

          var caloriesBurned = data[i].calories_per_hour;
          var calorieEl = document.createElement("p");
          calorieEl.textContent = `Calories Burned: ${caloriesBurned}`;
          resultEl.appendChild(calorieEl);
        }
      }

      //   .catch(function (error) {
      //     console.error('error:', error);
      //     activityEl.textContent = 'cannot retrieve data';

      // })
    });

  // then users weight
}

allInputs(calories, selectedActivity, userWeight);

function calcActivityDuration(calsBurnedPerMin, calories = 1000) {
  return calories / calsBurnedPerMin;
}

function searchActivityData(userInput) {
  var url = `https://api.api-ninjas.com/v1/caloriesburned?activity=ski&duration=60&weight=200`;
  fetch(url, {
    headers: {
      "X-Api-Key": "Wjicx6SkiBem7pplQibm7g==wVPkDcY9lX6RAcn0",
    },
  })
    .then(function (response) {
      return response.json();
    })
    .then(function (data) {
      console.log(data);
      activity.textContent = data;

      if (!data.length) {
        console.log("No results found");
        activity.textContent = "No Results Found";
      } else {
        activity.textContent = "";
        for (let i = 0; i < data.length; i++) {
          var activityName = data[i].name;
          var activityEl = document.createElement("h3");
          activityEl.textContent = `Activity: ${activityName}`;
          activity.appendChild(activityEl);

          var caloriesBurned = data[i].total_calories;
          var calorieEl = document.createElement("p");
          calorieEl.textContent = `Calories Burned: ${caloriesBurned}`;
          activity.appendChild(calorieEl);

          var activityDuration = data[i].duration_minutes;
          var durationEl = document.createElement("p");
          durationEl.textContent = `Activity Duration: ${activityDuration} min`;
          activity.appendChild(durationEl);
        }
      }
    });
}

// submit button on click
// submitButtonEl.addEventListener("click", function (event) {
//   event.preventDefault();
//   console.log("Clicked");
//   // userActivityInput.value;
//   var userInput = userActivityInput.value;
//   searchActivityData(userInput);
// });

// submit activity button on click
submitActivityButtonEl.addEventListener("click", function (event) {
  event.preventDefault();
  console.log("Submit Activity");
  allInputs();
});

function appendRecipeResults(recipeResultsEl, recipes) {
  recipes.forEach(function (recipe) {
    var recipeEl = document.createElement("div");
    recipeEl.innerHTML = `
      <div><b>${recipe.title}</b></div>
      <img src="${recipe.image}">
      <p>Total Calories: ${recipe.calories}</p>
    `;
    recipeResultsEl.appendChild(recipeEl);
    console.log(recipe);
  });
}

// submit recipe button on click
submitRecipeButtonEl.addEventListener("click", function (event) {
  event.preventDefault();
  console.log("Submitted Recipe");

  var recipeQuery = document.getElementById("recipeInput").value;

  searchRecipesByQuery(recipeQuery).then(function (recipes) {
    recipeResultsEl = document.getElementById("recipeResults");
    appendRecipeResults(recipeResultsEl, recipes.results);
    console.log(recipes);
  });
});

// var selectedActivity = document.getElementById('activitySelect').val;
// var duration = durationInput.value.trim();
// var weight = weightInput.value.trim();
// searchActivityData(selectedActivity, duration, weight);

// var activityEl = document.getElementById("activity");
// var userActivityInput = document.getElementById("userActivity");
// var durationInput = document.getElementById("duration");
// var weightInput = document.getElementById("weight");
// var submitButtonEl = document.getElementById("submitButton");
// function searchActivity(activity, duration, weight) { // api call and search for activity
//     var apiKey =
//     var url =
// activityEl.innerHTML = <p>Loading...</p>; //loading indicator
// //fetch data
// fetch(url, {
//     headers: {
//         "X-Api-Key": apiKey,
//     },
// })
// .then(function (response) {
//     if (!response.ok) {
//         throw new Error ('network error');
//     }
//     return response.json();
// })
// .then(function (data) {
//     displayResults(data);
// })
// .catch(function (error) {
//     console.error('Error:', error);
//     activityEl.textContent = "an error occurred while fetching data.";
// })
// }
// //display results of api call
// function displayResults(data) {
//     //clear prev content
//     activityEl.innerHTML = '';
//     //check for rsults
//     if (!data || data.length ===0) {
//         activityEl.textContent = "no results found";
//         return;
//     }
// }
// //loop through data
// data.forEach((result) => {
//     var activityName = result.activity;
//     var calBurned = result.calories;
//     var duration = result.duration;
//     var activityNameEl = document.createElement("h3");
//     activityNameEl.textContent = `activity: ${activityName}`;
//     activityEl.appendChild(activityNameEl);
//     var calBurnedEl = document.createElement("p");
//     calBurnedEl.textContent = `calories burned: ${calBurned}`
//     activityEl.appendChild(calBurnedEl);
// })
// //add event listenr for submit button
// //get values from input fields
// //validate input
// //call searchActivity function with user input
