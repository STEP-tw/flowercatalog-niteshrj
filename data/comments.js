const Comments = function(comment){
  this.comment = comment;
  this.comments = [];
  this.comments.unshift(comment);
}

Comments.prototype.getComments = function(){
  return this.comments;
};

module.exports = Comments;
