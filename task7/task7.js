(() => {
  'use strict';
  const eventTools = [
    'app.record.create.show',
    'app.record.create.change.日付',
    'app.record.create.change.サイボウズ製品',
    'app.record.create.change.管理番号',
    'app.record.edit.show',
    'app.record.edit.change.日付',
    'app.record.edit.change.サイボウズ製品',
    'app.record.edit.change.管理番号'];

  kintone.events.on(eventTools, (event) => {
    const getSelectedProductName = (productValue) => {
      switch (productValue) {
        case 'kintone':
          return 'KN';
        case 'Garoon':
          return 'GR';
        case 'サイボウズ Office':
          return 'OF';
        case 'Mailwise':
          return 'MW';
      }
    };
    const dataFormat = dateFns.format(event.record.日付.value, 'YYYYMMDD');
    const identifyNum = event.record.管理番号.value ? event.record.管理番号.value:'';
    const productId = getSelectedProductName(event.record.サイボウズ製品.value);
    event.record.重複禁止項目_文字列.value = `${dataFormat}-${productId}-${identifyNum}`;
    return event;
  });
})();