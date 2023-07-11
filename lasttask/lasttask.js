'use strict';

const userNameElem = document.getElementById('userName');
const passwordElem = document.getElementById('password');
const dateElem = document.getElementById('date');
const loginButton = document.getElementById('button');

function getLoginInfo() {
    // const userName = userNameElem.value;
    // const password = passwordElem.value;

    // console.log(userName);
    // console.log(password);
    // console.log(loginInfo);

  const client = new KintoneRestAPIClient({
    baseUrl:"https://n5f6y7z619m9.cybozu.com",
    auth: {
      username: "tanaka",
      password: "tanaka000"
    },
  });
  client.record
    .getRecord({ app: "24"})
    .then((resp) => {
        console.log(resp.records);
    });
};
loginButton.addEventListener('click', getLoginInfo);

function getTime() {
  const today = new Date();
  const date = today.getFullYear()+'-'+(today.getMonth()+1)+'-'+today.getDate();
  const time = today.getHours() + ":" + today.getMinutes() + ":" + today.getSeconds();
  const dateTime = date+' '+time;
  return dateTime;
};

function refreshTime(){
  const dateTime =  getTime();
  dateElem.textContent = dateTime
};
setInterval(refreshTime , 1000);

// get button elem
const startTimeElem = document.getElementById('startTime_button');
const endTimeElem = document.getElementById('endTime_button');

// get current time
function getCurrentTime() {
  const dateTime = getTime();
  console.log(dateTime);
};

// run getCurrentTime when buttons clicked
startTimeElem.addEventListener('click', getCurrentTime);
endTimeElem.addEventListener('click', getCurrentTime);



