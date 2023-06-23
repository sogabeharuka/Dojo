(() => {
  'use strict';
  //レコード保存ボタンを押した時に、他レコードと重複があるか確認したい
  const eventType = [
    'app.record.create.submit',
    'app.record.edit.submit'];

  kintone.events.on(eventType, (event) => {
    
    console.log(event);

    return event;
    
  });
    
  
  //重複を許可するかどうかはレコードごとにユーザーに任せる
  function checkOver {
    const answer = confirm('レコードが重複しています。このまま保存しますか？');
    if (answer === true) {
      //OKならレコードを保存
      
    } else {
      //キャンセルなら保存操作を取り消して編集画面に戻る
      return ;
    }};
    
    
    //フィールドの情報をとってくる
    query += '';

    const getAPI = async () => {
        const params = {
          'app': 13,
          'query': query,
        };
        getAPI();
        
        return kintone.api(kintone.api.url('/k/v1/.json',true),'GET',params).then((resp) =>{

        })

        }
    }
    
    // const eventTools = [
      //   'app.record.create.show',
    //   'app.record.create.change.日付',
    //   'app.record.create.change.サイボウズ製品',
    //   'app.record.create.change.管理番号',
    //   'app.record.edit.show',
    //   'app.record.edit.change.日付',
    //   'app.record.edit.change.サイボウズ製品',
    //   'app.record.edit.change.管理番号'];
  
    // kintone.events.on(eventTools, (event) => {
    //   const dataFormat = dateFns.format(event.record.日付.value, 'YYYYMMDD');
    //   const product = event.record.サイボウズ製品.value;
    //   const identifyNum = event.record.管理番号.value ? event.record.管理番号.value:'';
    //   let productId = '';
  
    //   if (product === 'kintone') {
    //     productId = 'KN';
    //   } else if (product === 'Garoon') {
    //     productId = 'GR';
    //   } else if (product === 'サイボウズ Office') {
    //     productId = 'OF';
    //   } else if (product === 'Mailwise') {
    //     productId = 'MW';
    //   }
  
    //   event.record.重複禁止項目_文字列.value = `${dataFormat}-${productId}-${identifyNum}`;
    // });
  })();
