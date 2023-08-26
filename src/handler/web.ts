import * as http from "http";
import { renderHtmlTemplate } from "../utils/html";

const indexHandler = (req: http.IncomingMessage, res: http.ServerResponse) => {
  const html = renderHtmlTemplate({ count: 0 });

  res.statusCode = 200;
  res.setHeader("Content-Type", "text/html");
  res.end(html);
};

export default indexHandler;
