(() =>{
    'use strict';

    const params = 'dojo';
    const url=`https://54o76ppvn8.execute-api.ap-northeast-1.amazonaws.com/prod/bb-dojo?id=${params}`;
    const fetchAdress = async() => {
        const apiUrl = await fetch(url); 
        const jsonData = await apiUrl.json();
        console.log(jsonData);
        return jsonData;
    }
    const data= fetchAdress();

   const tr = document.createElement('tr');
   const datetd = document.createElement('td');
   const categorytd = document.createElement('td');
   const 

})();