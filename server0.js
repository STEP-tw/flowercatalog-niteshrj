const http = require("http");
const fs = require("fs");
const qs = require("querystring");
const nameAndCommentFormatted = require('./public/js/formattedNameAndComment.js').nameAndCommentFormatted;


const contentType = require('./contentType').contentType;
const port = 8000;

const send404Response = function(res) {
  res.writeHead(404, {"Content-Type":"text/plain"});
  res.write("Error 404: Page not found!");
}

const getName = function(nameAndComment) {
  return nameAndComment['firstname']
}

const getComment = function(nameAndComment) {
  return nameAndComment['comment'];
}

const pushFormattedNameAndComment = function(nameAndComment) {
  let name = getName(nameAndComment);
  let comment = getComment(nameAndComment);
  namesAndComments.unshift(nameAndCommentFormatted(name, comment));
}

const addCommentToGuestBook = function(guestBook, nameAndComment) {
  const newGuestBook = guestBook.replace('<h2 id="replacer"></h2>',namesAndComments.join(""));
  return newGuestBook;
}

// const getNameAndCommentFromUrl = function(url) {
//   console.log(url.split("?")[1]);
//   return url.split("?")[1];
// }

const showLogs = function(url, headers) {
  console.log(url);
  console.log(headers);
}

const addComment = function(res,nameAndComment){
  res.writeHead(200,{"Content-Type": "text/html"});
  if (nameAndComment) {
    pushFormattedNameAndComment(nameAndComment);
    res.writeHead(302,{Location:'guestBook.html'});
  }
}

const urlExist = function(url){
  return fs.existsSync("./public/" + url)
}

const respondToUrl = function(url,res){
  if(urlExist(url)) {
    res.writeHead(200,{"Content-Type":contentType(url)});
    res.write(fs.readFileSync("./public/" + url));
  }else
    send404Response(res);
  res.end();
}

const onQueryStringParseEnd = function(url,nameAndComment,guestBook,res) {
    addComment(res,nameAndComment);
    // console.log(nameAndComment);
    updatedGuestBook = addCommentToGuestBook(guestBook,nameAndComment)
    // console.log(namesAndComments);
    const comments = fs.readFileSync("./data/comments.json","utf8");

    nameAndComment = JSON.stringify(nameAndComment,null,2);
    fs.writeFile('./data/comments.json',comments,(err)=>{console.log(err);})
    res.write(updatedGuestBook);
    res.end();
}

let namesAndComments = [];
let nameAndComment;

const getTime = function() {
  let date = new Date();
  return date.toLocaleTimeString()
}
const getDate = function() {
  let date = new Date();
  return date.toLocaleDateString();
}
const addDateAndTime = function(nameAndComment){
  nameAndComment["date"]=getDate();
  nameAndComment["time"]=getTime();
}

const respond = function(req, res, url) {
  // showLogs(req.url,req.headers);
  if(url=="addComment"){
    let guestBook = fs.readFileSync("./public/guestBook.html", "utf8");
    req.on("data", function(data){
      nameAndComment = qs.parse(data.toString());
      addDateAndTime(nameAndComment);
      console.log(nameAndComment);
      let foo = fs.readFileSync("./data/comments.json","utf8");
      foo = JSON.parse(foo);
      foo.push(nameAndComment);
      foo = JSON.stringify(foo,null,2);
      fs.writeFileSync("./data/comments.json",foo);
    });
    req.on("end",()=>onQueryStringParseEnd(url,nameAndComment,guestBook,res));
  }else{
    respondToUrl(url,res);
  }
}

const onRequest = function(req, res) {
  let url = req.url.replace("/", "");
  if (url == "")
    url = "home.html";
  respond(req, res, url);
}

const server = http.createServer(onRequest);
server.listen(port);
console.log("server is running at 8000 port");
