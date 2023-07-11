(() => {
  'use strict';

  const bodyForStart = {
    app: '',
    updateKey: {
      field: "ログインID",
      value: ''
    },
    record: {
      table: {
        value:[
          {
            id: '',
            value: {
              出勤時間: {
                value: ''
              },
              日付: {
                value: ''
              },          
            }
          }
        ]
      }
    }
  };
  const bodyForEnd = {
    app: '',
    updateKey: {
      field: "ログインID",
      value: ''
    },
    record: {
      table: {
        value:[
          {
            id: '',
            value: {
              退勤時間: {
                value: ''
              }, 
            }
          }
        ]
      }
    }
  };
  
  function getTime() {
    // const today = new Date();
    // const date = today.getFullYear()+'-'+(today.getMonth()+1)+'-'+today.getDate();
    // const time = today.getHours() + ":" + today.getMinutes() + ":" + today.getSeconds();
    // const nowTime = today.getHours()+ ":" + today.getMinutes();
    // const dateTime = date+' '+time;
    const today = new Date();
    const date = today.getFullYear()+'-'+(today.getMonth()+1)+'-'+today.getDate();
    const currentTime = today.getHours()+ ":" + today.getMinutes();
    return [date, currentTime];
  };
  
  kintone.events.on('mobile.app.record.index.show',(event) =>{
    console.log(event);
    const dateElem = document.getElementById('date');
    console.log('hello');
    function refreshTime(){
      const dateTime =  getTime();
      dateElem.textContent = dateTime
    };
    setInterval(refreshTime , 1000);

    // get button elem
    const startTimeElem = document.getElementById('startTime_button');
    const endTimeElem = document.getElementById('endTime_button');

    //get current time
    // function getCurrentTime() {
    //   const dateTime = getTime();
    //   console.log(dateTime);
    // };
   function createBody(fieldcode){
     const bodyTemplate = fieldcode==="出勤時間"?bodyForStart:bodyForEnd; 
     const body = JSON.parse(JSON.stringify(bodyTemplate));  
     body.app = 24;
     body.id = kintone.mobile.app.record.getId();
     return body;
    }
    
    async function getStartTime() {
      const fieldcode = '出勤時間';
      const [date, currentTime] = getTime();
      
      const body = createBody(fieldcode);
      body.record.table.value[0].id = 275;
      body.record.table.value[0].value.出勤時間.value = currentTime;
      body.record.table.value[0].value.日付.value = date;
      body.updateKey.value = kintone.getLoginUser().code;
      
      console.log(body);
      await kintone.api(kintone.api.url('/k/v1/record.json', true), 'PUT', body);    
    };
    
    async function getEndTime(){
      const [date, currentTime] = getTime();
      const fieldcode = '退勤時間';
      
      const body = createBody(fieldcode);
      body.record.table.value[0].id = 275;
      body.record.table.value[0].value.退勤時間.value = currentTime;
      body.updateKey.value = kintone.getLoginUser().code;
      await kintone.api(kintone.api.url('/k/v1/record.json', true), 'PUT', body);    

    };
  
    // run getCurrentTime when buttons clicked
    startTimeElem.addEventListener('click', getStartTime);
    endTimeElem.addEventListener('click', getEndTime);


    return event;
  });
  
})();
// const rootElement = document.getElementById('attendance_management');
// const element = kintone.mobile.app.getHeaderSpaceElement();
// rootElement.appendChild(divElement);
// element.style.height = '300px';