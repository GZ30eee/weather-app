const wrapper = document.querySelector(".wrapper"),
  inputPart = document.querySelector(".input-part"),
  infoTxt = inputPart.querySelector(".info-txt"),
  inputField = inputPart.querySelector("input"),
  locationBtn = inputPart.querySelector("button"),
  weatherPart = wrapper.querySelector(".weather-part"),
  wIcon = weatherPart.querySelector("img"),
  arrowBack = wrapper.querySelector("header i");

let api;

inputField.addEventListener("keyup", (e) => {
  if (e.key == "Enter" && inputField.value != "") {
    requestApi(inputField.value);
  }
});

locationBtn.addEventListener("click", () => {
  if (navigator.geolocation) {
    // if browser support geolocation api
    navigator.geolocation.getCurrentPosition(onSuccess, onError);
  } else {
    alert("Your browser not support geolocation api");
  }
});

function requestApi(city) {
  api = `https://api.weatherapi.com/v1/current.json?key=3ffd84975bd04c10b55190700241702&q=${city}`;
  fetchData();
}

function onSuccess(position) {
  const { latitude, longitude } = position.coords;
  api = `https://api.weatherapi.com/v1/current.json?key=3ffd84975bd04c10b55190700241702&q=${latitude},${longitude}`;
  fetchData();
}

function onError(error) {
  infoTxt.innerText = error.message;
  infoTxt.classList.add("error");
}

function fetchData() {
  infoTxt.innerText = "Getting weather details...";
  infoTxt.classList.add("pending");
  fetch(api)
    .then((res) => res.json())
    .then((result) => weatherDetails(result))
    .catch(() => {
      infoTxt.innerText = "Something went wrong";
      infoTxt.classList.replace("pending", "error");
    });
}

function weatherDetails(info) {
  if (info.error) {
    // if user entered city name isn't valid
    infoTxt.classList.replace("pending", "error");
    infoTxt.innerText = `${inputField.value} isn't a valid city name`;
  } else {
    //getting required properties value from the whole weather information
    const city = info.location.name;
    const country = info.location.country;
    const description = info.current.condition.text;
    const temp = info.current.temp_c;
    const feels_like = info.current.feelslike_c;
    const humidity = info.current.humidity;
    const wind_kph = info.current.wind_kph;
    const wind_dir = info.current.wind_dir;
    const vis_km = info.current.vis_km;
    const pressure_mb = info.current.pressure_mb;
    weatherPart.querySelector(
      ".wind span"
    ).innerText = `${wind_kph} kph ${wind_dir}`;
    const uv = info.current.uv;
    weatherPart.querySelector(".uv span").innerText = uv;
    weatherPart.querySelector(".vis span").innerText = vis_km;
    weatherPart.querySelector(".pressure_mb span").innerText = pressure_mb;

    // using custom weather icon according to the description
    if (description.includes("rain")) {
      wIcon.src = "icons/rain.svg";
    } else if (description.includes("storm")) {
      wIcon.src = "icons/storm.svg";
    } else if (description.includes("snow")) {
      wIcon.src = "icons/snow.svg";
    } else if (description.includes("haze")) {
      wIcon.src = "icons/haze.svg";
    } else if (description.includes("cloud")) {
      wIcon.src = "icons/cloud.svg";
    } else {
      wIcon.src = "icons/clear.svg";
    }

    //passing a particular weather info to a particular element
    weatherPart.querySelector(".temp .numb").innerText = Math.floor(temp);
    weatherPart.querySelector(".weather").innerText = description;
    weatherPart.querySelector(
      ".location span"
    ).innerText = `${city}, ${country}`;
    weatherPart.querySelector(".temp .numb-2").innerText =
      Math.floor(feels_like);
    weatherPart.querySelector(".humidity span").innerText = `${humidity}%`;
    infoTxt.classList.remove("pending", "error");
    infoTxt.innerText = "";
    inputField.value = "";
    wrapper.classList.add("active");
  }
}

arrowBack.addEventListener("click", () => {
  wrapper.classList.remove("active");
});
