const nameAndCommentFormatted = function(nameAndComment) {
  let name = nameAndComment.name;
  let comment = nameAndComment.comment;
  let date = nameAndComment.date;
  let time = nameAndComment.time;
  name = "<p> Name: " + name + "</p>";
  comment = "<p> Comment: " + comment + "</p>" + "<br>";
  let line = "----------------------";
  date = "<h5> Date: " + date + '    ' + time + "</h5>";
  return (date + name + comment);
}
exports.nameAndCommentFormatted = nameAndCommentFormatted;
