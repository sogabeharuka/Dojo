'use strict';

const userNameElem = document.getElementById('userName');
const passwordElem = document.getElementById('password');
const dateElem = document.getElementById('date');
const loginButton = document.getElementById('button');

function loginInfo() {
    const userName = userNameElem.value;
    const password = passwordElem.value;
    console.log(userName);
    console.log(password);
};
loginButton.addEventListener('click', loginInfo);

function refreshTime(){
    const today = new Date();
    const date = today.getFullYear()+'-'+(today.getMonth()+1)+'-'+today.getDate();
    const time = today.getHours() + ":" + today.getMinutes() + ":" + today.getSeconds();
    const dateTime = date+' '+time;
    
    console.log(dateTime)
    dateElem.textContent = dateTime
};
setInterval(refreshTime , 1000);