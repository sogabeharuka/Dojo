(() => {
  'use strict';

  const bodyTemplate = {
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
              退勤時間: {
                value: ''
              },          
            }
          }
        ]
      }
    }
  };

  
  const getTime = () => {
    const today = new Date();
    const dateFormat = dateFns.format(today, 'YYYY-MM-DD');
    const currentTimeFormat = dateFns.format(today, 'HH:mm');
    return [dateFormat, currentTimeFormat];
  };
  
  kintone.events.on('mobile.app.record.index.show',(event) => {
    const APP_ID = kintone.mobile.app.getId();
    const LOGIN_USER_ID = kintone.getLoginUser().code;
    
    const dateElem = document.getElementById('date')
    const timeElem = document.getElementById('currentTime')
    
    const refreshTime = () => {
      const [date, currentTime] =  getTime();
      dateElem.textContent = date;
      timeElem.textContent = currentTime;
    };
    setInterval(refreshTime , 1000);
    
    const startTimeElem = document.getElementById('startTime_button');
    const endTimeElem = document.getElementById('endTime_button');
    
    const getRecord = async(appId, query) => {
      const params = {
        app: appId,
        query: query
      };
      const resp = await kintone.api(kintone.api.url('/k/v1/records.json', true), 'GET', params);   
      return resp;
    };
    
    const createNewBody = async(APP_ID, LOGIN_USER_ID) => {
      const query = `ログインID = "${LOGIN_USER_ID}"`
      const currentBody = await getRecord(APP_ID, query);
      
      const newBody = {
        ...bodyTemplate,
        app:APP_ID,
        updateKey: {
          ...bodyTemplate.updateKey,
          value: LOGIN_USER_ID
        },
        record: {
          table:currentBody.records[0].table  
          }
        };
      
      return newBody;
    };

    const updateNewBody = async(LOGIN_USER_ID, APP_ID, newBody, fieldcode, currentDate, currentTime) => {
      const MIN_BREAKTIME = '60';
      const query = `日付 in ("${currentDate}") and ログインID = "${LOGIN_USER_ID}"`;
      const records = await getRecord(APP_ID, query);

      if(records.records.length != 0){
        const newBodyRecords = newBody.record.table.value;
        for(const element of newBodyRecords){
          if(element.value.日付.value === currentDate){
            element.value[fieldcode].value = currentTime;
          }
        }
      } else{
        const newTableRow = {
              value: {
                '休憩時間': {
                  value: MIN_BREAKTIME,
                  type: 'TIME',
                },
                '出勤時間': {
                  value: fieldcode === '出勤時間' ? currentTime : '',
                  type: 'TIME',
                },
                '勤務時間': {
                  value: '',
                  type: 'CALC',
                },
                '日付': {
                  value: currentDate,
                  type: 'DATE',
                },
                '退勤時間': {
                  value: fieldcode === '退勤時間' ? currentTime : '',
                  type: 'TIME',
                },
              }
            };
            newBody.record.table.value.push(newTableRow);
      }
      return newBody;
    }

    const getStartTime = async() => {
      const fieldcode = '出勤時間';
      const [currentDate, currentTime] = getTime();
    
      const newBody = await createNewBody(APP_ID, LOGIN_USER_ID);
      const updatedNewBody = await updateNewBody(LOGIN_USER_ID, APP_ID, newBody, fieldcode, currentDate, currentTime);
      await kintone.api(kintone.api.url('/k/v1/record.json', true), 'PUT', updatedNewBody);    
    };
    
    const getEndTime = async() => {
      const fieldcode = '退勤時間';
      const [currentDate, currentTime] = getTime();

      const newBody = await createNewBody(APP_ID, LOGIN_USER_ID); 
      const updatedNewBody = await updateNewBody(LOGIN_USER_ID, APP_ID, newBody, fieldcode, currentDate, currentTime);
      await kintone.api(kintone.api.url('/k/v1/record.json', true), 'PUT', updatedNewBody);      
    };
  
    startTimeElem.addEventListener('click', getStartTime);
    endTimeElem.addEventListener('click', getEndTime);

    return event;
  });
})();