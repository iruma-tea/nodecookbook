var http = require("http");
var path = require("path");

var pages = [
  { route: "", output: "Woohoo!" },
  { route: "about", output: "シンプルなサンプルコードです。" },
  {
    route: "another page",
    output: function () {
      return "これが" + this.route;
    },
  },
];

http
  .createServer(function (request, response) {
    var lookup = path.basename(decodeURI(request.url));
    pages.forEach(function (page) {
      if (page.route == lookup) {
        response.writeHead(200, {
          "Content-type": "text/html;charset=utf-8",
        });
        response.end(
          typeof page.output === "function" ? page.output() : page.output
        );
      }
    });
    // response.finishedは非推奨のためwritableEndedを使用する
    // https://nodejs.org/docs/latest-v20.x/api/http.html#class-httpserverresponse
    // if (!response.finished) {
    if (!response.writableEnded) {
      response.writeHead(404, {
        "Content-Type": "text/html; charset=utf-8",
      });
      response.end("ページが見つかりません！");
    }
  })
  .listen(8080);
