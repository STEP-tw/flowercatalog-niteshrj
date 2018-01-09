let fs = require('fs');
const timeStamp = require('./time.js').timeStamp;
const http = require('http');
const webapp = require('./webapp');
let registered_users = [{userName:'bhanutv',name:'Bhanu Teja Verma'},{userName:'harshab',name:'Harsha Vardhana'}];
let toS = o=>JSON.stringify(o,null,2);


const PORT = 5000;
let server = http.createServer(app);

server.on('error',e=>console.error('**error**',e.message));
server.listen(PORT,(e)=>console.log(`server listening at ${PORT}`));
