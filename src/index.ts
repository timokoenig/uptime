import * as http from "http";
import * as cron from "node-cron";

const hostname = "127.0.0.1";
const port = 3000;

let cronValue = 0;

const server = http.createServer(
  (req: http.IncomingMessage, res: http.ServerResponse) => {
    res.statusCode = 200;
    res.setHeader("Content-Type", "text/plain");
    res.end(`CronValue: ${cronValue}`);
  }
);

cron.schedule("* * * * *", () => {
  console.log("running a task every minute");
  cronValue++;
});

server.listen(port, hostname, () => {
  console.log(`Server running at http://${hostname}:${port}/`);
});
