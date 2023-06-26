(async() => {
    'use strict';
    const tableElement = document.getElementById("table-news-body");

    const params = 'dojo';
    const url=`https://54o76ppvn8.execute-api.ap-northeast-1.amazonaws.com/prod/bb-dojo?id=${params}`;
    const fetchAdress = async() => {
        const apiUrl = await fetch(url); 
        const jsonData = await apiUrl.json();
        console.log(jsonData);
        return jsonData;
    }
    const createTable = (tableData) => {
        tableData.forEach(element => {
            
            const rowCownt = tableElement.rows.length;
            const firstRow = tableElement.insertRow(rowCownt);
            
            const dateCell = firstRow.insertCell(0);
            const categoryCell = firstRow.insertCell(1);
            const titledCell = firstRow.insertCell(2);
            console.log(tableData);
            
            dateCell.textContent = element.day.value;
            categoryCell.textContent = element.category.value;
            console.log(element);
            
            const titled = document.createElement('a');
            const createText = document. createTextNode(element.content.value);
            titled.setAttribute('href',element.url.value);
            titled.setAttribute('target',element.target.value);
            titled.appendChild(createText);
            titledCell.appendChild(titled);
            
        });
    }
    const data = await fetchAdress();
    createTable(data);

})();