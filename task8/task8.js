(() => {
    'use strict';
  
    kintone.events.on('app.record.create.show', (event) => {
      console.log(event);
      //const action5Array = ['あくなき探求', '不屈の心体', '理想への共感', '心を動かす', '知識を増やす', '公明正大'];
      
      const getAPI = async () => {
        const params = {
          app: 14,
        }
        //console.log(resp);
        
        const resp = await kintone.api(kintone.api.url('/k/v1/app/form/fields.json',true),'GET',params);
        const Action5 = Object.keys(resp.properties.Table.fields.Action5.options);
        console.log(Action5);
        
        //const record = event.record;
        const subtableArray = event.record.Table.value;
        subtableArray.shift();
        
        console.log(subtableArray);
        
        Action5.forEach((element) => {
          subtableArray.push(
            {
              value: {
                Action5: {
                  type: 'DROP_DOWN',
                  value: element
                },
                状況: {
                  type: 'DROP_DOWN',
                  value: ['未振り返り']
                },
                課題: {
                  type: 'MULTI_LINE_TEXT',
                  value: ''
                }
              }  
            });
            
          });
        };
        getAPI();
        
        return event;
      });
  })();