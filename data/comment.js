const Comment = function(name,comment){
  this.name = name;
  this.comment = comment;
  this.date = new Date().toLocaleDateString();
  this.time = new Date().toLocaleTimeString();
}

Comment.prototype.getComment = function(){
  let foo = `${this.date} ${this.time} ${this.name} ${this.comment}`;
  return this;
}

module.exports = Comment;
