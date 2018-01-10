let utils =  {
  getTime: function() {
    let date = new Date();
    return date.toLocaleTimeString()
  },
  getDate: function() {
    let date = new Date();
    return date.toLocaleDateString();
  }
}

module.exports = utils;
