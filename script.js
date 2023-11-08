var activity = document.getElementById("activity");
var userActivityInput = document.getElementById("userActivity");
var submitButtonEl = document.getElementById("submitButton");


function searchActivity() {
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
          activity.appendChild(activityEl)

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

searchActivity();

submitButtonEl.addEventListener("click", function(event){
    event.preventDefault();
    console.log("Clicked");
    // userActivityInput.value;
    console.log(userActivityInput.value);

})

