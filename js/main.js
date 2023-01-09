let data = {};
let body = {};

const serverUrl = 'https://example.com/';

const timeElement = document.querySelector("#time");
const latitudeElement = document.querySelector("#latitude");
const longitudeElement = document.querySelector("#longitude");
const formElement = document.querySelector("form");
const logElement = document.querySelector("#log");

clockIn();

function clockIn() {
  getTime()
  .then((res) => {
    data.time = res;
    timeElement.innerText = data.time;
  })
  .catch((error) => {      
    timeElement.innerText = "Could not get time.";
    console.error(error.message);
  });
  
  getPosition()
  .then((res) => {
    data.latitude = res.coords.latitude;
    latitudeElement.innerText = data.latitude;
    data.longitude = res.coords.longitude;
    longitudeElement.innerText = data.longitude;
  })
  .catch((error) => {
    latitudeElement.innerText = "Could not get latitude.";
    longitudeElement.innerText = "Could not get longitude.";
    console.error(error.message);
  });
  
  formElement.addEventListener("submit", (e) => {
    const formData = new FormData(formElement);
    for (const [,value] of formData) {
      if(value === 'only-time') {
        // console.log(data.time);
        body.time = data.time;
        // console.log(body);
        postData(serverUrl, body);
      }
      if (value === 'gps-optional') {
        body = data;
        postData(serverUrl, body);
      } 
      if (value === 'gps-required') {
        if (data.latitude && data.longitude) {
          body = data;
          postData(serverUrl, body);
        } else {
          logElement.innerText = 'Cannot send the data. GPS data are required.';
        }
      }
    }
    e.preventDefault();
  });  
}

function getTime () {
  return new Promise((resolve, reject) => {
      let time = new Date().getTime();
      if (time) {
            resolve(time);
      } else {
          reject();
      }    
  });
}

const options = {
  timeout: 5000,  
};

function getPosition(options) {
  return new Promise((resolve, reject) => 
      navigator.geolocation.getCurrentPosition(resolve, reject, options)
  );
}

function postData(url, body) {
  fetch(url, {
    method: 'POST',
    headers: {
      'Accept': 'application/json',
      'Content-Type': 'application/json'
    },      
    body: JSON.stringify(body)
  })
  .then((res) => {
    logElement.innerText = `The response of the server is: ${res}`;
  })
  .catch((error) => {
    logElement.innerText = 'Could not fetch the server response.';
    console.error(error.message);
  });
}