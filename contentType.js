const contentType = function(requstUrl) {
  let urlExtension = requstUrl.substr(requstUrl.lastIndexOf("."));
  urlExtension = urlExtension.replace(".", "");
  let contentType = {
    html: "text/html",
    css: "text/css",
    js: "text/js",
    PNG: "image/PNG",
    jpeg: "image/jpeg",
    gif: "image/gif",
    jpg: "image/jpg",
    pdf: "text/pdf"
  }
  return contentType[urlExtension];
}

exports.contentType = contentType;
