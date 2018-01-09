const getTime = function() {
  let date = new Date();
  return date.toLocaleTimeString()
}
const getDate = function() {
  let date = new Date();
  return date.toLocaleDateString();
}
const nameAndCommentFormatted = function(name, comment) {
  name = "<p> Name: " + name + "</p>";
  comment = "<p> Comment: " + comment + "</p>" + "<br>";
  let line = "----------------------";
  let date = getDate();
  let time = getTime();
  date = "<h5> Date: " + date + '    ' + time + "</h5>";
  return (date + name + comment);
}
exports.nameAndCommentFormatted = nameAndCommentFormatted;
