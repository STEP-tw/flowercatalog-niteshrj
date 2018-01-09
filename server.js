let fs = require('fs');
const timeStamp = require('./time.js').timeStamp;
const http = require('http');
const webapp = require('./webapp');
const nameAndCommentFormatted = require('./public/js/formattedNameAndComment.js').nameAndCommentFormatted;
const contentType = require('./contentType').contentType;
const utils = require('./utils.js');
let guestBook = fs.readFileSync("./public/guestBook.html","utf8");
let registered_users = [{userName:'alok',password:'1234'},{userName:'nitesh',password:'1'}];
let toS = o=>JSON.stringify(o,null,2);
let updatedGuestBook = "";

let logRequest = (req,res)=>{
  let text = ['------------------------------',
    `${timeStamp()}`,
    `${req.method} ${req.url}`,
    `HEADERS=> ${toS(req.headers)}`,
    `COOKIES=> ${toS(req.cookies)}`,
    `BODY=> ${toS(req.body)}`,''].join('\n');
  fs.appendFile('request.log',text,()=>{});
  console.log(`${req.method} ${req.url}`);
}
let loadUser = (req,res)=>{
  let sessionid = req.cookies.sessionid;
  let user = registered_users.find(u=>u.sessionid==sessionid);
  if(sessionid && user){
    req.user = user;
  }
};
let redirectLoggedInUserToHome = (req,res)=>{
  if(req.urlIsOneOf(['/guestBookLogin.html']) && req.user) res.redirect('/guestBook.html');
};
let redirectLoggedOutUserToLogin = (req,res)=>{
  if(req.urlIsOneOf(['/hfihifi']) && !req.user) res.redirect('/login');
};

let app = webapp.create();
app.use(logRequest);
app.use(loadUser);
app.use(redirectLoggedInUserToHome);
app.use(redirectLoggedOutUserToLogin);

const send404Response = function(res) {
  res.writeHead(404, {"Content-Type":"text/plain"});
  res.write("Error 404: Page not found!");
}
const urlExist = function(url){
  return fs.existsSync("./public/" + url)
}

app.get('default',(req,res)=>{
  if(req.url=='/')
     req.url='/home.html';
  if(urlExist(req.url)) {
    res.writeHead(200,{"Content-Type":contentType(req.url)});
    res.write(fs.readFileSync("./public/" + req.url));
  }else
    send404Response(res);
  res.end();
});

app.get('/guestBook.html',(req,res)=>{
  res.writeHead(200,{"Content-Type":'text/html'});
  res.write(updatedGuestBook);
  res.end();
});

app.get('/guestBookLogin.html',(req,res)=>{
  res.setHeader('Content-type','text/html');
  res.write(fs.readFileSync("./public/" + req.url));
  res.end();
});

app.post('/guestBook.html',(req,res)=>{
  let user = registered_users.find(u=>u.userName==req.body.name);
  let password = registered_users.find(u=>u.password==req.body.password);
  if(!user || !password) {
    res.redirect('/guestBookLogin.html');
    res.end();
    return;
  }
  let sessionid = new Date().getTime();
  res.setHeader('Set-Cookie',`sessionid=${sessionid}`);
  user.sessionid = sessionid;
  res.writeHead(200,{"Content-Type":contentType(req.url)});
  res.write(fs.readFileSync("./public/" + req.url));
  res.end();
});
const addCommentToGuestBook = function(guestBook, nameAndComment) {
  const newGuestBook = guestBook.replace('<h2 id="replacer"></h2>',nameAndComment);
  return newGuestBook;
}

let commentsData = [];

app.post('/addComment',(req,res)=>{
  let nameAndComment = req.body;
  nameAndComment["date"]=utils.getDate();
  nameAndComment["time"]=utils.getTime();

  let comments = fs.readFileSync("./data/comments.json","utf8");
  comments = JSON.parse(comments);
  comments.push(nameAndComment);
  comments = JSON.stringify(comments,null,2);
  fs.writeFileSync('./data/comments.json',comments);

  let formattedNameAndComment = nameAndCommentFormatted(nameAndComment);
  commentsData.unshift(formattedNameAndComment);
  updatedGuestBook = addCommentToGuestBook(guestBook,commentsData.join(""));
  res.write(updatedGuestBook);
  res.end();
});

app.get('/logout',(req,res)=>{
  res.setHeader('Set-Cookie',[`loginFailed=false,Expires=${new Date(1).toUTCString()}`,`sessionid=0,Expires=${new Date(1).toUTCString()}`]);
  delete req.user.sessionid;
  res.redirect('/login');
});

const PORT = 5000;
let server = http.createServer(app);

server.on('error',e=>console.error('**error**',e.message));
server.listen(PORT,(e)=>console.log(`server listening at ${PORT}`));
