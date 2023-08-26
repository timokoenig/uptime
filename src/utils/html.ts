import * as fs from "fs";
import * as path from "path";
import * as mustache from "mustache";

export const renderHtmlTemplate = (options: { [key: string]: any }): string =>
  mustache.render(
    fs
      .readFileSync(path.join(__dirname, "../../templates/index.mustache"))
      .toString(),
    options
  );
