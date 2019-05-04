const fs=require('fs')

fs.readFile('mockdata.json', (err, data) => {  
        if (err) throw err;
        let trans = JSON.parse(data);
        console.log(trans);
        });