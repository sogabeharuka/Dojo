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
    async function getRecord(appId, query){
      const params = {
        app: appId,
        query: query
      };
      const resp = await kintone.api(kintone.api.url('/k/v1/records.json', true), 'GET', params);   
      console.log(resp);
      return resp;
    };

    async function createNewBody(appId, loginUserId, fieldcode, currentTime) {
      const query = `ログインID = "${loginUserId}"`
      const currentBody = await getRecord(appId, query);
      const newbody = JSON.parse(JSON.stringify(bodyTemplate));
      console.log(newbody);
      
      // 用意したappID, loginUserId Record情報をnewBodyに詰めてあげる
      // appID, loginUserId詰める作業
      newbody.app = appId;
      newbody.updateKey.value = loginUserId;
      
      // record情報を詰める作業
      // 用意したcurrentBodyを雛形(newbody)に入れる
      newbody.record.table.value[0].value.出勤時間.value = currentBody.records[0].table.value[0].value.出勤時間.value;
      newbody.record.table.value[0].value.日付.value = currentBody.records[0].table.value[0].value.日付.value;
      newbody.record.table.value[0].value.退勤時間.value = currentBody.records[0].table.value[0].value.退勤時間.value;
      // currentTimeをnewbodyの出勤時間に入れる
      newbody.record.table.value[0].value[fieldcode].value = currentTime;
      return newbody;
    }
    
    async function getStartTime() {
      const appId = kintone.mobile.app.getId();
      const loginUserId = kintone.getLoginUser().code;
      const fieldcode = '出勤時間';
      const [currentDate, currentTime] = getTime();
      const query = `日付 in ("${currentDate}") and ログインID = "${loginUserId}"`;
     
      // TODO: 日付(currentDate)と一致するレコードのテーブルを取得
      const records = await getRecord(appId, query);
      console.log(records)

      // TODO: 一致するテーブルが存在する時、出勤時間を更新する
      // TODO: 一致するテーブルが存在しない時、テーブルを追加し、出勤時間を書き込む
      
      if (records != null){
        const newbody = await createNewBody(appId, loginUserId, fieldcode, currentTime);  
      } else {
        const addRow = () => {
          const record = kintone.app.record.get().record;
          // まずはオブジェクトを作る
          const newTableRow = record.table.value[0];
          
          // オブジェクトをBodyにPUSHする
          newBody.table.value.push(newTableRow); 
          newTableRow.push({
            value: {
              '休憩時間': {
                value: '',
                type: 'TIME',
              },
              '出勤時間': {
                value: currentTime,
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
                value: '',
                type: 'TIME',
              },
            }
          });
          resetRowNo(record);
          kintone.app.record.set({record: record});
        };
      }
      await kintone.api(kintone.api.url('/k/v1/record.json', true), 'PUT', newbody);    
    };
    
    async function getEndTime(){
      const fieldcode = '退勤時間';
      const [date, currentTime] = getTime();
      const newbody = await createNewBody(appId, loginUserId, fieldcode, currentTime); 
      await kintone.api(kintone.api.url('/k/v1/record.json', true), 'PUT', newbody);      
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