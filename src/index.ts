import * as http from "http";
import * as cron from "node-cron";
import webHandler from "./handler/web";

const hostname = "127.0.0.1";
const port = 3000;

// Run cron job
cron.schedule("* * * * *", () => {
  console.log("running a task every minute");
});

// Run web server
const server = http.createServer(webHandler);
server.listen(port, hostname, () => {
  console.log(`Server running at http://${hostname}:${port}/`);
});
