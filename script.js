var activity = document.getElementById("activity");
var userActivityInput = document.getElementById("userActivity");
var submitButtonEl = document.getElementById("submitButton");
var userActivitySelect = document.getElementById("activitySelect");
var submitActivityButtonEl = document.getElementById("activitySubmitButton");
var userWeightInput = document.getElementById("weight");
// var durationEl = document.getElementById("duration");
var resultEl = document.getElementById("result");
var calories = 1000;

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

// step 1- user selects recipe, user gets # of calories needed to be burned - api spoon
// Step 2- user selects activity type from drop down list
// Step 3- user inputs weight
// step 2 and 3 data weight and activity -- use api cal lto api ninjas -- trying to get the number of cals burned / min based on user's weight and selected activity

//MONDAY PLAN: RECIPE API SET UP + DISPLAY 
//SET VALUE PRE-POPULATED SHORT
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

submitButtonEl.addEventListener("click", function (event) {
  event.preventDefault();
  console.log("Clicked");
  // userActivityInput.value;
  var userInput = userActivityInput.value;
  searchActivityData(userInput);
});

submitActivityButtonEl.addEventListener("click", function (event) {
  event.preventDefault();
  console.log("Submit Activity");
  allInputs();
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
