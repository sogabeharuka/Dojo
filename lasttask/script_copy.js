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
    
    // TODO: getTimeで日付フォーマット変更
    const getTime = () => {
      const today = new Date();
      const date = today.getFullYear()+'-'+(today.getMonth()+1)+'-'+today.getDate();
      const dateFormat = dateFns.format(date, 'YYYY-MM-DD');
      const currentTime = today.getHours()+ ":" + today.getMinutes();
      return [dateFormat, currentTime];
    };
    
    kintone.events.on('mobile.app.record.index.show',(event) => {
      console.log(event);
      const dateElem = document.getElementById('date')
      function refreshTime(){
        const dateTime =  getTime();
        dateElem.textContent = dateTime;
      };
      setInterval(refreshTime , 1000);
  
      // get button elem
      const startTimeElem = document.getElementById('startTime_button');
      const endTimeElem = document.getElementById('endTime_button');
  
      const getRecord = async(appId, query) =>{
        const params = {
          app: appId,
          query: query
        };
        const resp = await kintone.api(kintone.api.url('/k/v1/records.json', true), 'GET', params);   
        return resp;
      };
  
      async function createNewBody(appId, loginUserId) {
        const query = `ログインID = "${loginUserId}"`
        const newBody = JSON.parse(JSON.stringify(bodyTemplate));
        const currentBody = await getRecord(appId, query);
        
        console.log(newBody);
        
        // 用意したappID, loginUserId Record情報をnewBodyに詰めてあげる
        // appID, loginUserId詰める作業
        newBody.app = appId;
        newBody.updateKey.value = loginUserId;
        
        // record情報を詰める作業
        // 用意したcurrentBodyを雛形(newbody)に入れる
        newBody.record.table= currentBody.records[0].table;
        return newBody;
      };
      
  
      async function updateNewBody(loginUserId, appId, newBody, fieldcode, currentDate, currentTime) {
        const MIN_BREAKTIME = '60';
        // TODO: loginUser & 日付が一致するレコードを検索＆結果を格納
        const query = `日付 in ("${currentDate}") and ログインID = "${loginUserId}"`;
        const records = await getRecord(appId, query);
  
        // TODO: currentDateRecordのrecordsが存在する場合
        if(records.records.length != 0){
          const newBodyRecords = newBody.record.table.value;
          for(const element of newBodyRecords){
            if(element.value.日付.value === currentDate){
              element.value[fieldcode].value = currentTime;
            }
          }
        } else{
          // TODO: currentDateRecordのrecordsが存在しない場合
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

      async function getStartTime() {
        console.log('hello');
        const appId = kintone.mobile.app.getId();
        const loginUserId = kintone.getLoginUser().code;
        const fieldcode = '出勤時間';
        const [currentDate, currentTime] = getTime();
       
        // TODO:  更新前のデータが入った雛形を作成
        //! newbodyにレコードのテーブル以下の情報を入れる
        const newBody = await createNewBody(appId, loginUserId)
  
       
        const updatedNewBody = await updateNewBody(loginUserId, appId, newBody, fieldcode, currentDate, currentTime);
        //updateNewBody(records, newBody, fieldcode, currentDate,currentTime);
        
        // TODO: 最後に値を更新したnewbodyをPUTする
        await kintone.api(kintone.api.url('/k/v1/record.json', true), 'PUT', updatedNewBody);    
      };
      
      async function getEndTime(){
        const appId = kintone.mobile.app.getId();
        const loginUserId = kintone.getLoginUser().code;
        const fieldcode = '退勤時間';
        const [currentDate, currentTime] = getTime();
  
        const newBody = await createNewBody(appId, loginUserId); 
  
      
        const updatedNewBody = await updateNewBody(loginUserId, appId, newBody, fieldcode, currentDate, currentTime);
        console.log(updatedNewBody);
        //updateNewBody(records, newBody, fieldcode, currentDate,currentTime);
  
        await kintone.api(kintone.api.url('/k/v1/record.json', true), 'PUT', updatedNewBody);      
      };
    
      // run getCurrentTime when buttons clicked
      startTimeElem.addEventListener('click', getStartTime);
      endTimeElem.addEventListener('click', getEndTime);
  
      return event;
    });
    
  })();