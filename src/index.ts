import * as http from "http";
import * as cron from "node-cron";
import * as fs from "fs";
import * as path from "path";
import * as mustache from "mustache";

const hostname = "127.0.0.1";
const port = 3000;

let cronValue = 0;

const server = http.createServer(
  (req: http.IncomingMessage, res: http.ServerResponse) => {
    res.statusCode = 200;
    res.setHeader("Content-Type", "text/html");

    const html = mustache.render(
      fs
        .readFileSync(path.join(__dirname, "../templates/index.mustache"))
        .toString(),
      {
        count: cronValue,
      }
    );

    res.end(html);
  }
);

cron.schedule("* * * * *", () => {
  console.log("running a task every minute");
  cronValue++;
});

server.listen(port, hostname, () => {
  console.log(`Server running at http://${hostname}:${port}/`);
});
