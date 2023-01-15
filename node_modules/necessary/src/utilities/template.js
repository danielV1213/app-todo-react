"use strict";

import { readFile } from "../utilities/fileSystem";
import { EMPTY_STRING } from "../constants";

export function parseFile(filePath, args, regex) {
  const content = readFile(filePath),
        parsedContent = parseContent(content, args, regex);

  return parsedContent;
}

export function parseContent(content, args, regex) {
  const lines = content.split("\n"),
        parsedLines = parseLines(lines, args, regex),
        parsedContent = parsedLines.join("\n");

  return parsedContent;
}

export function parseLine(line, args, regex = /\${(.+?)}/g) {
  const parsedLine = line.replace(regex, (match, token) => {
    const parsedToken = parseToken(token, args);

    return parsedToken;
  });

  return parsedLine;
}

export default {
  parseFile,
  parseContent,
  parseLine
};

function parseLines(lines, args, regex) {
  const parsedLines = lines.map((line) => {
    const parsedLine = parseLine(line, args, regex);

    return parsedLine;
  });

  return parsedLines;
}

function parseToken(token, args) {
  let parsedToken = EMPTY_STRING;

  if (args.hasOwnProperty(token)) {
    parsedToken = args[token];
  }

  return parsedToken;
}
