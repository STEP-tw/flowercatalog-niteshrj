let fs = require('fs');
const timeStamp = require('./time.js').timeStamp;
const http = require('http');
const webapp = require('./webapp');
const contentType = require('./contentType').contentType;
let registered_users = [{userName:'alok',password:'1234'}];
let toS = o=>JSON.stringify(o,null,2);

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
  if(req.urlIsOneOf(['/','/login']) && req.user) res.redirect('/home');
}
let redirectLoggedOutUserToLogin = (req,res)=>{
  if(req.urlIsOneOf(['/home','/logout']) && !req.user) res.redirect('/login');
}

let app = webapp.create();
// console.log(app);
app.use(logRequest);
app.use(loadUser);
app.use(redirectLoggedInUserToHome);
app.use(redirectLoggedOutUserToLogin);
app.get('/login',(req,res)=>{
  res.setHeader('Content-type','text/html');
  if(req.cookies.logInFailed) res.write('<p>logIn Failed</p>');
  res.write('<form method="POST"> <input name="userName"><input name="place"> <input type="submit"></form>');
  res.end();
});
app.post('/login',(req,res)=>{

  let user = registered_users.find(u=>u.userName==req.body.userName);

  if(!user) {
    res.setHeader('Set-Cookie',`logInFailed=true`);
    res.redirect('/login');
    return;
  }
  let sessionid = new Date().getTime();
  res.setHeader('Set-Cookie',`sessionid=${sessionid}`);
  user.sessionid = sessionid;
  res.redirect('/home');
});
app.get('/home',(req,res)=>{
  res.setHeader('Content-type','text/html');
  res.write(`<p>Hello ${req.user.name}</p>`);
  res.end();
});

const send404Response = function(res) {
  res.writeHead(404, {"Content-Type":"text/plain"});
  res.write("Error 404: Page not found!");
}

const urlExist = function(url){
  return fs.existsSync("./public/" + url)
}

app.get('default',(req,res)=>{
  console.log(req.url);
  if(req.url=='/')
     req.url='/home.html';
  if(req.url=="/guestBook.html"){
    res.redirect('/guestBookLogin.html');
    return;
  }
  if(urlExist(req.url)) {
    res.writeHead(200,{"Content-Type":contentType(req.url)});
    res.write(fs.readFileSync("./public/" + req.url));
  }else
    send404Response(res);
  res.end();
});

app.get('/guestBookLogin.html',(req,res)=>{
  res.setHeader('Content-type','text/html');
  res.write(fs.readFileSync("./public/" + req.url));
  res.end();
});

app.post('/guestBook.html',(req,res)=>{
  let user = registered_users.find(u=>u.userName==req.body.name);
  if(!user) {
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

app.get('/logout',(req,res)=>{
  res.setHeader('Set-Cookie',[`loginFailed=false,Expires=${new Date(1).toUTCString()}`,`sessionid=0,Expires=${new Date(1).toUTCString()}`]);
  delete req.user.sessionid;
  res.redirect('/login');
});

const PORT = 5000;
let server = http.createServer(app);

server.on('error',e=>console.error('**error**',e.message));
server.listen(PORT,(e)=>console.log(`server listening at ${PORT}`));
