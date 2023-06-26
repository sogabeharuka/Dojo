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
    if (resp.records.length === 0) {
    //OKならレコードを保存
      return event;
    } else {
    //キャンセルなら保存操作を取り消して編集画面に戻る
      if (window.confirm('レコードが重複しています。このまま保存しますか？')) {
        return event;
      } else {
        return false;
      }
    }
  });
})();