(async () => {
    'use strict';
    const tableElement = document.getElementById('table-news-body');
  
    const params = 'dojo';
    const url =`https://54o76ppvn8.execute-api.ap-northeast-1.amazonaws.com/prod/bb-dojo?id=${params}`;
    const fetchAdress = async () => {
      const apiUrl = await fetch(url);
      const jsonData = await apiUrl.json();
      return jsonData;
    };
    
    const addCategoryBackgroundColor = (categoryType) => {
        if (categoryType === '企業情報') {
            return '#87cefa';
        } else if (categoryType === '製品') {
            return '#7fffd4';
        } else {
            return '#ff6347';
        }
    };
    const createTable = (tableData) => {
        tableData.forEach(element => {
            const rowCownt = tableElement.rows.length;
            const firstRow = tableElement.insertRow(rowCownt);
            console.log(tableData);
  
        const dateCell = firstRow.insertCell(0);
        const categoryCell = firstRow.insertCell(1);
        const titledCell = firstRow.insertCell(2);
        dateCell.textContent = element.day.value;
  
        let categoryType = element.category.value;
        categoryCell.textContent = categoryType;
  
        categoryCell.style.backgroundColor = addCategoryBackgroundColor(categoryType);
  
        const titled = document.createElement('a');
        const createText = document.createTextNode(element.content.value);
        titled.setAttribute('href', element.url.value);
        titled.setAttribute('target', element.target.value);
        titled.appendChild(createText);
        titledCell.appendChild(titled);
      });
    };
    const data = await fetchAdress();
    createTable(data);
  })();