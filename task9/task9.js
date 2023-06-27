(() => {
  'use strict';

  const eventType = [
    'app.record.create.submit',
    'app.record.edit.submit'];

  kintone.events.on(eventType, async(event) => {
    const recordValue = event.record.重複禁止項目.value;
    const query = `重複禁止項目 = "${recordValue}"`;

    const params = {
      'app': kintone.app.getId(),
      'query': query
    };

    const resp = await kintone.api(kintone.api.url('/k/v1/records.json', true), 'GET', params);
    
    //重複していないときレコード保存
    if (resp.records.length === 0) {
      return event;
    }
    //それ以外のときダイアログ表示
    const dialog = confirm('レコードが重複しています。このまま保存しますか？');
    if (dialog) {
      return event;
    } else {
      return false;
    }
  });
})();